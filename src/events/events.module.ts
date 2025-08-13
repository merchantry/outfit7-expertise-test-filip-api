import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AdsPermissionModule } from '../ads-permission/ads-permission.module';

@Module({
  imports: [PrismaModule, AdsPermissionModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
