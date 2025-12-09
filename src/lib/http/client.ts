export async function clientFetch<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  const text = await res.text();
  const hasBody = text.trim().length > 0;

  let data: any = null;
  if (hasBody) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse JSON response', err, text);
      throw err;
    }
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || 'Request failed';

    throw new Error(message);
  }

  return data as T;
}
