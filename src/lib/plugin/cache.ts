import { createHash } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export class ImageCache {
  private cacheDir: string;
  private memoryCache: Map<string, string>;

  constructor(cacheDir = 'node_modules/.cache/polaretto') {
    this.cacheDir = cacheDir;
    this.memoryCache = new Map();
  }

  generateKey(filepath: string, params: URLSearchParams): string {
    const input = `${filepath}?${params.toString()}`;
    return createHash('md5').update(input).digest('hex');
  }

  async get(key: string): Promise<string | null> {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)!;
    }

    // Check disk cache
    try {
      const cachePath = join(this.cacheDir, `${key}.json`);
      const cached = await readFile(cachePath, 'utf-8');
      this.memoryCache.set(key, cached);
      return cached;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    // Set in memory
    this.memoryCache.set(key, value);

    // Write to disk
    try {
      await mkdir(this.cacheDir, { recursive: true });
      const cachePath = join(this.cacheDir, `${key}.json`);
      await writeFile(cachePath, value, 'utf-8');
    } catch (err) {
      console.warn('Failed to write image cache:', err);
    }
  }

  clear(): void {
    this.memoryCache.clear();
  }
}