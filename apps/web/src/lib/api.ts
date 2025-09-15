export async function api<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const token = options.token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const text = await res.text();
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try { message = (JSON.parse(text)?.error as string) || message; } catch {}
    throw new Error(message);
  }
  return text ? JSON.parse(text) : ({} as T);
}
