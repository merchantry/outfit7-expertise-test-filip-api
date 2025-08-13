import { Module } from '@nestjs/common';
import { AdsPermissionController } from './ads-permission.controller';
import { AdsPermissionService } from './ads-permission.service';

@Module({
  controllers: [AdsPermissionController],
  providers: [AdsPermissionService],
  exports: [AdsPermissionService],
})
export class AdsPermissionModule {}
