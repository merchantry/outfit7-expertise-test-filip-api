import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventLogsService } from './event-logs.service';
import { CreateEventLogDto } from './dto/create-event-log.dto';

@Controller()
export class EventLogsController {
  constructor(private readonly eventLogsService: EventLogsService) {}

  @Post('/logs')
  create(@Body() logs: CreateEventLogDto[]) {
    return this.eventLogsService.createBatch(logs);
  }

  @Get('/projects/:projectId/events/:eventId/logs')
  findAll(
    @Param('eventId') eventId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.eventLogsService.findAll({
      offset: offset ? parseInt(offset, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sortBy,
      sortOrder,
      eventId,
    });
  }

  @Get('/logs/:id')
  findOne(@Param('id') id: string) {
    return this.eventLogsService.findOne(id);
  }

  @Delete('/logs/:id')
  remove(@Param('id') id: string) {
    return this.eventLogsService.remove(id);
  }
}
