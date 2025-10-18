import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  /**
   * Sets a value in the cache with an optional time-to-live (TTL).
   * @param key The key under which the value is stored.
   * @param value The value to store in the cache.
   * @param ttl Optional time-to-live in milliseconds. If not provided, the default TTL will be used.
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  /**
   * Retrieves a value from the cache by its key.
   * @param key The key of the value to retrieve.
   * @returns The cached value or null if not found.
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.cache.get<T>(key);
    return value ?? null;
  }

  /**
   * Deletes a value from the cache by its key.
   * @param key The key of the value to delete.
   */
  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  /**
   * Checks if a key exists in the cache.
   * @param key The key to check.
   * @returns A boolean indicating whether the key exists in the cache.
   */
  async has(key: string): Promise<boolean> {
    const value = await this.cache.get(key);
    return value !== undefined && value !== null;
  }
}
