import type { PreprocessorGroup } from 'svelte/compiler';
import { transformMarkup } from './markup.ts';
import type { ImagePluginOptions } from '../types/index.ts';

export function svelteImagePreprocessor(
  options: ImagePluginOptions = {}
): PreprocessorGroup {
  return {
    name: 'svelte-image-preprocessor',

    markup({ content, filename }) {
      // Skip if not a Svelte file or no image components found
      if (!filename?.endsWith('.svelte')) {
        return { code: content };
      }

      // Check if file contains our components
      if (!/<(?:Picture|Image|BackgroundImage)\s/.test(content)) {
        return { code: content };
      }

      // Transform the markup
      const result = transformMarkup(content, filename, options);

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}