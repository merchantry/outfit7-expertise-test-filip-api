import { Test, TestingModule } from '@nestjs/testing';
import { AdsPermissionController } from './ads-permission.controller';

describe('AdsPermissionController', () => {
  let controller: AdsPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdsPermissionController],
    }).compile();

    controller = module.get<AdsPermissionController>(AdsPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
