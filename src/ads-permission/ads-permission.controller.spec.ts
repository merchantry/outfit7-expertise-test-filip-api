import { Test, TestingModule } from '@nestjs/testing';
import { AdsPermissionController } from './ads-permission.controller';

import { AdsPermissionService } from './ads-permission.service';

describe('AdsPermissionController', () => {
  let controller: AdsPermissionController;

  const mockAdsPermissionService = {
    getAdsPermission: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdsPermissionController],
      providers: [
        { provide: AdsPermissionService, useValue: mockAdsPermissionService },
      ],
    }).compile();

    controller = module.get<AdsPermissionController>(AdsPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getAdsPermission on service and return result', async () => {
    const mockResult = { allowed: true };
    const countryCode = 'SI';
    mockAdsPermissionService.getAdsPermission.mockResolvedValue(mockResult);
    const result = await controller.getAdsPermission(countryCode);
    expect(mockAdsPermissionService.getAdsPermission).toHaveBeenCalledWith(
      countryCode,
    );
    expect(result).toBe(mockResult);
  });
});
