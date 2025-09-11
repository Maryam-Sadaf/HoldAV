/**
 * Simple in-memory cache for API responses
 * Helps reduce database load for frequently accessed data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Maximum cache entries

  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    // Clear old entries if cache is getting too large
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const ttl = ttlMinutes * 60 * 1000; // Convert minutes to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    // If still too large, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.2)); // Remove 20% of oldest
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  // Get cache stats for monitoring
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Helper function to generate cache keys
export const generateCacheKey = (prefix: string, ...params: (string | number)[]): string => {
  return `${prefix}:${params.join(':')}`;
};

// Cache key prefixes for different data types
export const CACHE_KEYS = {
  USER_RESERVATIONS: 'user_reservations',
  COMPANY_RESERVATIONS: 'company_reservations',
  ROOM_RESERVATIONS: 'room_reservations',
  COMPANY_DATA: 'company_data',
  ROOM_DATA: 'room_data',
} as const;
