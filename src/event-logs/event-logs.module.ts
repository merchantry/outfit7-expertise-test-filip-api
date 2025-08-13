import { Module } from '@nestjs/common';
import { EventLogsService } from './event-logs.service';
import { EventLogsController } from './event-logs.controller';

@Module({
  controllers: [EventLogsController],
  providers: [EventLogsService],
})
export class EventLogsModule {}
