import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('projects/:projectId/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.create(projectId, dto);
  }

  @Get()
  findByProject(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.eventsService.findByProject(projectId);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.eventsService.findOne(id, projectId);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, projectId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ) {
    return this.eventsService.remove(id, projectId);
  }
}
