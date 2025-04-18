type CacheOptions<T> = {
  key: string;
  ttl?: number;
  loadIfMissing: () => Promise<T>;
};

export async function getFromLocalStorage<T>({
  key,
  ttl = 60 * 60 * 1000,
  loadIfMissing,
}: CacheOptions<T>): Promise<T> {
  const cached = localStorage.getItem(key);

  if (cached) {
    try {
      const parsed: { timestamp: number; data: T } = JSON.parse(cached);

      if (Date.now() - parsed.timestamp < ttl) {
        return parsed.data;
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      localStorage.removeItem(key);
    }
  }

  const data = await loadIfMissing();
  localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  return data;
}
