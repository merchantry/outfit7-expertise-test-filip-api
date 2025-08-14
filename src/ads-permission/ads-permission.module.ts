import { Module } from '@nestjs/common';
import { AdsPermissionController } from './ads-permission.controller';

import { AdsPermissionService } from './ads-permission.service';
import { FetchWithBasicAuthApi } from '../utils/fetch-with-basic-auth';

@Module({
  controllers: [AdsPermissionController],
  providers: [AdsPermissionService, FetchWithBasicAuthApi],
  exports: [AdsPermissionService],
})
export class AdsPermissionModule {}
