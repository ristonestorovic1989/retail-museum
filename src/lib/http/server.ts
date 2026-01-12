export const API_URL = process.env.API_URL!;
if (!API_URL) throw new Error('Missing API_URL');

type Opts = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  accessToken?: string;
};

export async function apiFetch<T>(path: string, opts: Opts = {}): Promise<T> {
  const { method = 'GET', body, headers, accessToken } = opts;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const text = await res.text();

  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = typeof data === 'string' ? data : data?.message || res.statusText;

    console.error(`[apiFetch] ${method} ${path} failed:`, res.status, data);

    throw new Error(`${res.status} ${message}`);
  }

  return data as T;
}
