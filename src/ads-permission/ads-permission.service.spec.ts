import { Test, TestingModule } from '@nestjs/testing';
import { AdsPermissionService } from './ads-permission.service';

describe('AdsPermissionService', () => {
  let service: AdsPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdsPermissionService],
    }).compile();

    service = module.get<AdsPermissionService>(AdsPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
