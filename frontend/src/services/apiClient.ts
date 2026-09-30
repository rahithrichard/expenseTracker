const API_URL = import.meta.env.VITE_API_URL || "/api/";

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, string | undefined>;
  body?: unknown;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { query, body, headers, ...requestOptions } = options;
  const requestUrl = new URL(API_URL + path, window.location.origin);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) requestUrl.searchParams.set(key, value);
  });

  const requestHeaders = new Headers(headers);
  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(requestUrl, {
    ...requestOptions,
    credentials: "include",
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(errorData?.message || `API request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}