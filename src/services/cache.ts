import NodeCache from "node-cache";

/**
 * In-memory cache for market data.
 * Default TTL matches frontend polling cadence.
 */
const cache = new NodeCache({
  stdTTL: 15,
  checkperiod: 20,
});

export function getFromCache<T>(key: string): T | null {
  const value = cache.get<T>(key);
  return value === undefined ? null : value;
}

export function setInCache<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): void {
  cache.set(key, value, ttlSeconds || 0);
}

export function deleteFromCache(key: string): void {
  cache.del(key);
}

export function clearCache(): void {
  cache.flushAll();
}
