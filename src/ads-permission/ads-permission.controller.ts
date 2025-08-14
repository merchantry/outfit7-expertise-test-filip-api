import { Controller, Get, Param } from '@nestjs/common';
import { AdsPermissionService } from './ads-permission.service';

@Controller('ads-permission')
export class AdsPermissionController {
  constructor(private adsPermissionService: AdsPermissionService) {}

  @Get(':countryCode')
  async getAdsPermission(@Param('countryCode') countryCode: string) {
    return this.adsPermissionService.getAdsPermission(countryCode);
  }
}
