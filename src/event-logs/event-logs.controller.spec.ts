import { Test, TestingModule } from '@nestjs/testing';
import { EventLogsController } from './event-logs.controller';
import { EventLogsService } from './event-logs.service';

import { PrismaService } from '../prisma/prisma.service';
import { MatchType } from './dto/create-event-log.dto';

describe('EventLogsController', () => {
  let controller: EventLogsController;

  const mockPrisma = {
    eventLog: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventLogsController],
      providers: [
        EventLogsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<EventLogsController>(EventLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createBatch on service and return result for create', async () => {
    const mockLogs = [
      {
        key: 'log1',
        timestamp: 1691940000000,
        url: 'https://example.com/1',
        sessionId: 'a3b2c1d4-5678-4321-9876-abcdef123456',
        matchType: 'id' as MatchType,
        eventId: 'event1',
      },
    ];
    const mockResult = { success: true };
    const eventLogsService = {
      createBatch: jest.fn().mockResolvedValue(mockResult),
    };
    Object.defineProperty(controller, 'eventLogsService', {
      value: eventLogsService,
    });
    const result = await controller.create(mockLogs);
    expect(eventLogsService.createBatch).toHaveBeenCalledWith(mockLogs);
    expect(result).toBe(mockResult);
  });
});
