import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from './projects.service';

const mockPrisma = {
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('src/utils/error', () => ({
  isPrismaError: (e: { code?: string }) => !!e.code,
}));

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = mockPrisma;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create project', async () => {
      prisma.project.create.mockResolvedValue({ id: '1' });
      const dto = { name: 'Test', updateIntervalSeconds: 10 };
      const result = await service.create(dto);
      expect(result).toEqual({ id: '1' });
      expect(prisma.project.create).toHaveBeenCalled();
    });
    it('should throw ConflictException on duplicate', async () => {
      prisma.project.create.mockRejectedValue({ code: 'P2002' });
      await expect(
        service.create({ name: 'Test', updateIntervalSeconds: 10 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      prisma.project.findMany.mockResolvedValue([{ id: '1' }]);
      expect(await service.findAll()).toEqual([{ id: '1' }]);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return project', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: '1' });
      expect(await service.findOne('1')).toEqual({ id: '1' });
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByApiKey', () => {
    it('should return project', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: '1' });
      expect(await service.findOneByApiKey('key')).toEqual({ id: '1' });
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.findOneByApiKey('key')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update project', async () => {
      prisma.project.update.mockResolvedValue({ id: '1' });
      expect(await service.update('1', { name: 'New' })).toEqual({ id: '1' });
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.project.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.update('1', { name: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw ConflictException on duplicate', async () => {
      prisma.project.update.mockRejectedValue({ code: 'P2002' });
      await expect(service.update('1', { name: 'New' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should delete project', async () => {
      prisma.project.delete.mockResolvedValue({});
      expect(await service.remove('1')).toEqual({ deleted: true });
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.project.delete.mockRejectedValue({ code: 'P2025' });
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
