import { Injectable } from '@nestjs/common';
import { AdsPermissionsResponse } from 'src/types';
import { fetchWithBasicAuth } from 'src/utils/fetch-with-basic-auth';

const OUTFIT7_API_URL =
  'https://europe-west1-o7tools.cloudfunctions.net/fun7-ad-partner-expertise-test';
const USER_NAME = 'fun7user';
const USER_PASSWORD = 'fun7pass';

@Injectable()
export class AdsPermissionService {
  async getAdsPermissions(countryCode: string) {
    const res = await fetchWithBasicAuth(
      `${OUTFIT7_API_URL}?countryCode=${countryCode}`,
      USER_NAME,
      USER_PASSWORD,
    );
    const { ads } = JSON.parse(await res.text()) as AdsPermissionsResponse;
    return ads === 'sure, why not!';
  }
}
