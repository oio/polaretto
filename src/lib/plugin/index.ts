import type { Plugin, ResolvedConfig } from 'vite';
import { transformImage } from './transform.ts';
import { ImageCache } from './cache.ts';
import type { ImagePluginOptions } from '../types/index.ts';

export function svelteImagePlugin(options: ImagePluginOptions = {}): Plugin {
  let config: ResolvedConfig;
  const cache = new ImageCache();

  const {
    formats = ['avif', 'webp', 'original'],
    breakpoints = [640, 768, 1024, 1280, 1536],
    placeholder = 'blur',
    cacheDir = 'node_modules/.cache/polaretto',
  } = options;

  return {
    name: 'vite-plugin-svelte-images',
    enforce: 'pre',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async resolveId(id, importer) {
      // Intercept image imports with query parameters
      if (id.match(/\.(jpg|jpeg|png|webp|avif|tiff)\?/)) {
        const [path, query] = id.split('?');
        const resolved = await this.resolve(path, importer);
        if (resolved) {
          return resolved.id + '?' + query;
        }
      }
    },

    async load(id) {
      // Only process images with our query params
      if (!id.match(/\.(jpg|jpeg|png|webp|avif|tiff)\?/)) {
        return null;
      }

      const [filepath, query] = id.split('?');
      const params = new URLSearchParams(query);

      // Check cache first
      const cacheKey = cache.generateKey(id, params);
      const cached = await cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Transform image with Sharp, passing the plugin context using .call()
      const result = await transformImage.call(this, filepath, {
        formats,
        breakpoints,
        placeholder,
        params,
        config,
      });

      // Cache the result
      await cache.set(cacheKey, result);

      // Return JavaScript module that exports image metadata
      return result;
    },
  };
}