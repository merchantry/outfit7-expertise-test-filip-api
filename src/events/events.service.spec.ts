import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { AdsPermissionService } from '../ads-permission/ads-permission.service';
import { CreateEventDto, EventType } from './dto/create-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let adsPermission: jest.Mocked<AdsPermissionService>;

  const mockPrisma = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    eventLog: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
        {
          provide: AdsPermissionService,
          useValue: {
            getAdsPermission: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    adsPermission = module.get(AdsPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create non-ads event', async () => {
      mockPrisma.event.create.mockResolvedValue('created');
      const dto: CreateEventDto = {
        name: 'Test',
        priority: 1,
        type: EventType.app,
        tags: ['tag'],
      };
      expect(await service.create('project-id', dto)).toBe('created');
    });

    it('should throw UnauthorizedException if ads event and no countryCode', async () => {
      const dto: CreateEventDto = {
        name: 'Test',
        priority: 1,
        type: EventType.ads,
        tags: ['tag'],
      };
      await expect(service.create('project-id', dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if ads permission denied', async () => {
      const dto: CreateEventDto = {
        name: 'Test',
        priority: 1,
        type: EventType.ads,
        tags: ['tag'],
      };
      adsPermission.getAdsPermission.mockResolvedValue(false);
      await expect(service.create('project-id', dto, 'SI')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create ads event if permission granted', async () => {
      mockPrisma.event.create.mockResolvedValue('created');
      adsPermission.getAdsPermission.mockResolvedValue(true);
      const dto: CreateEventDto = {
        name: 'Test',
        priority: 1,
        type: EventType.ads,
        tags: ['tag'],
      };
      expect(await service.create('project-id', dto, 'SI')).toBe('created');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if event not found', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);
      await expect(service.update('id', 'pid', {}, 'SI')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update event if not ads', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ type: EventType.app });
      mockPrisma.event.update.mockResolvedValue('updated');
      const dto: UpdateEventDto = { name: 'Updated' };
      expect(await service.update('id', 'pid', dto)).toBe('updated');
    });

    it('should throw UnauthorizedException if ads and no countryCode', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ type: EventType.ads });
      await expect(service.update('id', 'pid', {}, undefined)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if ads permission denied', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ type: EventType.ads });
      adsPermission.getAdsPermission.mockResolvedValue(false);
      await expect(service.update('id', 'pid', {}, 'SI')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should update ads event if permission granted', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ type: EventType.ads });
      mockPrisma.event.update.mockResolvedValue('updated');
      adsPermission.getAdsPermission.mockResolvedValue(true);
      expect(await service.update('id', 'pid', {}, 'SI')).toBe('updated');
    });
  });
});
