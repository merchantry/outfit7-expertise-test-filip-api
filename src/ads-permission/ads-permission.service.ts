import { Injectable } from '@nestjs/common';
import { AdsPermissionsResponse } from 'src/types';
import { FetchWithBasicAuthApi } from 'src/utils/fetch-with-basic-auth';

const OUTFIT7_API_URL =
  'https://europe-west1-o7tools.cloudfunctions.net/fun7-ad-partner-expertise-test';
const USER_NAME = 'fun7user';
const USER_PASSWORD = 'fun7pass';



@Injectable()
export class AdsPermissionService {
  constructor(private fetchApi: FetchWithBasicAuthApi) {}

  async getAdsPermission(countryCode: string) {
    const res = await this.fetchApi.fetch(
      `${OUTFIT7_API_URL}?countryCode=${countryCode}`,
      USER_NAME,
      USER_PASSWORD,
    );
    const { ads } = JSON.parse(await res.text()) as AdsPermissionsResponse;
    return ads === 'sure, why not!';
  }
}
