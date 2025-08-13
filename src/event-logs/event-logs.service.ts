import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventLogsService {
  constructor(private prisma: PrismaService) {}

  async createBatch(logs: CreateEventLogDto[]) {
    if (!Array.isArray(logs) || logs.length === 0) {
      throw new BadRequestException(
        'Request body must be a non-empty array of logs',
      );
    }

    // Check all eventIds exist
    const eventIds = Array.from(new Set(logs.map((log) => log.eventId)));
    const foundEvents = await this.prisma.event.findMany({
      where: { id: { in: eventIds } },
      select: { id: true },
    });
    const foundIds = new Set(foundEvents.map((e) => e.id));
    const missingIds = eventIds.filter((id) => !foundIds.has(id));
    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Event(s) not found: ${missingIds.join(', ')}`,
      );
    }

    // Create logs in batch
    const created = await this.prisma.eventLog.createMany({
      data: logs,
      skipDuplicates: false,
    });
    return { count: created.count };
  }

  async findAll(params: {
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    eventId?: string;
  }) {
    const {
      offset = 0,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'desc',
      eventId,
    } = params;

    const [logs, totalRows] = await Promise.all([
      this.prisma.eventLog.findMany({
        where: {
          eventId,
        },
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.eventLog.count({ where: { eventId } }),
    ]);

    return {
      data: logs.map((log) => ({
        ...log,
        timestamp: log.timestamp.toString(),
      })),
      totalRows,
    };
  }

  async findOne(id: string) {
    const log = await this.prisma.eventLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException('EventLog not found');
    return {
      ...log,
      timestamp: log.timestamp.toString(),
    };
  }

  async remove(id: string) {
    try {
      await this.prisma.eventLog.delete({ where: { id } });
      return { deleted: true };
    } catch {
      throw new NotFoundException('EventLog not found');
    }
  }
}
