

/**
 * Injectable API class for making fetch requests with Basic Auth.
 */
export class FetchWithBasicAuthApi {
  /**
   * @param fetchImpl Custom fetch implementation (for testing/mocking)
   */
  constructor(private fetchImpl: typeof fetch = fetch) {}

  /**
   * Performs a fetch request with Basic Auth headers.
   * @param url Request URL
   * @param username Basic Auth username
   * @param password Basic Auth password
   * @param options Additional fetch options
   */
  async fetch(url: string, username: string, password: string, options: RequestInit = {}) {
    const auth = Buffer.from(`${username}/${password}`).toString('base64');
    const headers = {
      ...(options.headers || {}),
      Authorization: `Basic ${auth}`,
    };
    return this.fetchImpl(url, { ...options, headers });
  }
}
