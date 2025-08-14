

export class FetchWithBasicAuthApi {
  constructor(private fetchImpl: typeof fetch = fetch) {}

  async fetch(url: string, username: string, password: string, options: RequestInit = {}) {
    const auth = Buffer.from(`${username}/${password}`).toString('base64');
    const headers = {
      ...(options.headers || {}),
      Authorization: `Basic ${auth}`,
    };
    return this.fetchImpl(url, { ...options, headers });
  }
}
