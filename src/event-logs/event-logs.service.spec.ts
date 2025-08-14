import { Test, TestingModule } from '@nestjs/testing';
import { EventLogsService } from './event-logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventLogDto } from './dto/create-event-log.dto';

describe('EventLogsService', () => {
  let service: EventLogsService;

  const mockPrisma = {
    event: {
      findMany: jest.fn(),
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
        EventLogsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EventLogsService>(EventLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBatch', () => {
    it('should throw BadRequestException if logs is not array or empty', async () => {
      await expect(
        service.createBatch(undefined as unknown as CreateEventLogDto[]),
      ).rejects.toThrow('Request body must be a non-empty array of logs');
      await expect(service.createBatch([])).rejects.toThrow(
        'Request body must be a non-empty array of logs',
      );
    });

    it('should throw BadRequestException if Prisma returns P2003 (foreign key violation)', async () => {
      const error = new Error('Foreign key violation');
      (error as Error & { code: string }).code = 'P2003';
      mockPrisma.eventLog.createMany.mockRejectedValueOnce(error);

      const logs = [{ eventId: 'missing' }];
      await expect(
        service.createBatch(logs as CreateEventLogDto[]),
      ).rejects.toThrow('Event id does not exist');
    });

    it('should call createMany and return count', async () => {
      mockPrisma.eventLog.createMany.mockResolvedValue({ count: 2 });
      const logs = [{ eventId: 'event1' }];
      const result = await service.createBatch(logs as CreateEventLogDto[]);
      expect(mockPrisma.eventLog.createMany).toHaveBeenCalledWith({
        data: logs,
        skipDuplicates: false,
      });
      expect(result).toEqual({ count: 2 });
    });
  });

  describe('findAll', () => {
    it('should return logs and totalRows', async () => {
      const logs = [{ timestamp: 123, id: '1' }];
      mockPrisma.eventLog.findMany.mockResolvedValue(logs);
      mockPrisma.eventLog.count.mockResolvedValue(1);
      const result = await service.findAll({
        eventId: '1',
        offset: 0,
        limit: 1,
      });
      expect(result.data[0].timestamp).toBe('123');
      expect(result.totalRows).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return log if found', async () => {
      mockPrisma.eventLog.findUnique = jest
        .fn()
        .mockResolvedValue({ id: '1', timestamp: 123 });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
      expect(result.timestamp).toBe('123');
    });
    it('should throw NotFoundException if not found', async () => {
      mockPrisma.eventLog.findUnique = jest.fn().mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        'EventLog not found',
      );
    });
  });

  describe('remove', () => {
    it('should return deleted true if found', async () => {
      mockPrisma.eventLog.delete = jest.fn().mockResolvedValue({});
      const result = await service.remove('1');
      expect(result).toEqual({ deleted: true });
    });
    it('should throw NotFoundException if not found', async () => {
      mockPrisma.eventLog.delete = jest.fn().mockRejectedValue(new Error());
      await expect(service.remove('missing')).rejects.toThrow(
        'EventLog not found',
      );
    });
  });
});
