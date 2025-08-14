import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventLogDto } from './dto/create-event-log.dto';
import { PrismaService } from '../prisma/prisma.service';
import { isPrismaError } from 'src/utils/error';

@Injectable()
export class EventLogsService {
  constructor(private prisma: PrismaService) {}

  async createBatch(logs: CreateEventLogDto[]) {
    if (!Array.isArray(logs) || logs.length === 0) {
      throw new BadRequestException(
        'Request body must be a non-empty array of logs',
      );
    }

    try {
      const created = await this.prisma.eventLog.createMany({
        data: logs,
        skipDuplicates: false,
      });
      return { count: created.count };
    } catch (e) {
      if (!isPrismaError(e)) throw e;
      if (e.code === 'P2003') {
        throw new BadRequestException('Event id does not exist');
      }
    }
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
