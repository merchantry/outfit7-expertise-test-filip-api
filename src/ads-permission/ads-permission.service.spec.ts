import { AdsPermissionService } from './ads-permission.service';
import { FetchWithBasicAuthApi } from '../utils/fetch-with-basic-auth';

describe('AdsPermissionService', () => {
  let service: AdsPermissionService;
  let fetchApi: FetchWithBasicAuthApi;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    fetchApi = new FetchWithBasicAuthApi(fetchMock);
    service = new AdsPermissionService(fetchApi);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when ads is "sure, why not!"', async () => {
    const mockResponse = {
      text: jest
        .fn()
        .mockResolvedValue(JSON.stringify({ ads: 'sure, why not!' })),
    };
    fetchMock.mockResolvedValue(mockResponse);
    const result = await service.getAdsPermission('SI');
    expect(fetchMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when ads is not "sure, why not!"', async () => {
    const mockResponse = {
      text: jest.fn().mockResolvedValue(JSON.stringify({ ads: 'nope' })),
    };
    fetchMock.mockResolvedValue(mockResponse);
    const result = await service.getAdsPermission('SI');
    expect(result).toBe(false);
  });

  it('should throw if fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));
    await expect(service.getAdsPermission('SI')).rejects.toThrow(
      'Network error',
    );
  });
});
