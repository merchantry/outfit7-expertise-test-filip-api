export async function fetchWithBasicAuth(url: string, username: string, password: string, options: RequestInit = {}) {
  const auth = Buffer.from(`${username}/${password}`).toString('base64');
  const headers = {
    ...(options.headers || {}),
    Authorization: `Basic ${auth}`,
  };
  return fetch(url, { ...options, headers });
}
