import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto, EventType } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const mockEventsService = {
  create: jest.fn(),
  findByProject: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockPrismaService = {
  event: { findMany: jest.fn() },
  eventLog: {
    createMany: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('EventsController', () => {
  let controller: EventsController;
  let service: typeof mockEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const dto: CreateEventDto = {
      name: 'Test',
      priority: 1,
      type: EventType.app,
      tags: ['tag'],
    };
    service.create.mockResolvedValue('created');
    expect(await controller.create('project-id', dto)).toBe('created');
    expect(service.create).toHaveBeenCalledWith('project-id', dto, undefined);
  });

  it('should call findByProject', async () => {
    service.findByProject.mockResolvedValue(['event']);
    expect(await controller.findByProject('project-id')).toEqual(['event']);
  });

  it('should call findOne', async () => {
    service.findOne.mockResolvedValue('event');
    expect(await controller.findOne('event-id', 'project-id')).toBe('event');
  });

  it('should call update', async () => {
    const dto: UpdateEventDto = { name: 'Updated' };
    service.update.mockResolvedValue('updated');
    expect(await controller.update('event-id', 'project-id', dto)).toBe(
      'updated',
    );
    expect(service.update).toHaveBeenCalledWith(
      'event-id',
      'project-id',
      dto,
      undefined,
    );
  });

  it('should call remove', async () => {
    service.remove.mockResolvedValue({ deleted: true });
    expect(await controller.remove('event-id', 'project-id')).toEqual({
      deleted: true,
    });
  });
});
