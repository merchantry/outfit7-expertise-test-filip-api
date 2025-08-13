import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { EventLogsModule } from './event-logs/event-logs.module';
import { AdsPermissionModule } from './ads-permission/ads-permission.module';

@Module({
  imports: [
    EventsModule,
    PrismaModule,
    ProjectsModule,
    EventLogsModule,
    AdsPermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
