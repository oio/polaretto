# G3 ImageTools - Svelte/SvelteKit Image Optimization Library

## Overview

This document provides a comprehensive implementation guide for building an image optimization library for Svelte/SvelteKit, similar to Astro's `<Image>` component and `astro-imagetools`. The library will provide automatic image optimization, responsive image generation, multiple format support, and art direction capabilities.

## ⚠️ Critical Architecture Requirements

**IMPORTANT**: This implementation uses a **three-layer architecture** that is essential for production use:

1. **Svelte Preprocessor** - Transforms component usage into static imports (required for Vite bundling and SSR)
2. **Vite Plugin** - Processes images with Sharp at build time (handles optimization)
3. **Svelte Components** - "Dumb renderers" that receive ImageData objects (ensures SSR works)

**Without the preprocessor layer, this library will fail in production** due to:
- ❌ Dynamic imports breaking Vite's static analysis
- ❌ Path resolution issues
- ❌ SSR failures (no `<img>` in initial HTML)
- ❌ SEO regression and poor LCP scores

See the "Architecture Decision" section below for detailed explanation of why this approach is necessary.

## Project Goals

1. **Automatic Image Optimization**: Process images at build time using Sharp
2. **Responsive Images**: Generate proper srcset/sizes attributes for optimal loading
3. **Multiple Formats**: Support AVIF, WebP with automatic fallbacks
4. **Art Direction**: Different images for different breakpoints using `<picture>`
5. **Developer Experience**: Simple component API, TypeScript support, fast HMR
6. **Performance**: Aggressive caching, minimal runtime overhead
7. **SvelteKit Native**: Work seamlessly with SSR, SSG, and all adapters

## Reference Documentation

Implementation should reference these documents for technical details:

- **docs/bibles/SVELTE_BIBLE.md** - Svelte 5 features (runes, reactivity, components)
- **docs/bibles/SVELTEKIT_BIBLE.md** - SvelteKit architecture (routing, SSR, build)
- **docs/bibles/VITE_BIBLE.md** - Vite plugin system and asset handling
- **docs/bibles/SHARP_BIBLE.md** - Image processing capabilities
- **docs/bibles/ASTRO_IMAGETOOLS_BIBLE.md** - Reference implementation patterns
- **docs/html/responsive_images.md** - HTML responsive image standards

## Architecture Decision

**Recommended Approach**: Vite Plugin + Svelte Preprocessor + Svelte Components

### Why This Three-Layer Architecture

#### 1. Vite Plugin (Image Processing)
- Build-time image processing using Sharp (zero runtime cost)
- Automatic asset optimization during development and production builds
- Integration with Vite's asset pipeline (hashing, URLs, bundling)
- Fast HMR with on-demand processing
- Works with all SvelteKit adapters

#### 2. Svelte Preprocessor (Static Analysis & Rewriting)
- **Critical for SSR and bundling**: Statically analyzes component usage at compile time
- Rewrites `<Picture src="./hero.jpg" />` to proper imports before Vite sees the code
- Resolves relative paths correctly based on the calling file's location
- Enables perfect server-side rendering with no client-side effects
- Ensures Vite can statically analyze all image dependencies

#### 3. Component Layer (Dumb Renderers)
- Clean API using Svelte 5 runes (`$props`, `$derived`)
- Type-safe props with TypeScript
- Receives pre-processed `ImageData` objects (not string paths)
- Renders proper HTML (`<picture>`, `<img>`, `<source>`) immediately on server
- No client-side effects or dynamic imports

### Why the Preprocessor is Essential

**The Problem with Dynamic Imports:**
```typescript
// ❌ This WILL NOT work in production:
let { src } = $props(); // src = "./hero.jpg"
let imageDataPromise = $derived(import(`${src}?responsive`));
```

**Issues:**
1. Vite cannot statically analyze variable imports
2. Path resolution breaks (relative to component, not caller)
3. SSR fails - `$effect` doesn't run on server
4. SEO regression - no `<img>` in initial HTML

**The Solution:**
```svelte
<!-- User writes: -->
<Picture src="./hero.jpg" alt="Hero" />

<!-- Preprocessor rewrites to: -->
<script>
  import __img_0 from "./hero.jpg?responsive";
</script>
<Picture src={__img_0} alt="Hero" />
```

This ensures:
- ✅ Vite can statically analyze the import
- ✅ Paths resolve correctly (relative to caller file)
- ✅ Perfect SSR - data available immediately
- ✅ Zero client-side effects

## Project Structure

```
svelte-imagetools/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── lib/
│   │   ├── index.ts                    # Main exports
│   │   ├── components/
│   │   │   ├── Picture.svelte          # <Picture> component
│   │   │   ├── Image.svelte            # <Image> component
│   │   │   └── BackgroundImage.svelte  # Background image component
│   │   ├── preprocessor/
│   │   │   ├── index.ts                # Svelte preprocessor entry
│   │   │   └── markup.ts               # Markup transformation logic
│   │   ├── plugin/
│   │   │   ├── index.ts                # Vite plugin entry
│   │   │   ├── transform.ts            # Image transformation logic
│   │   │   ├── cache.ts                # Build cache management
│   │   │   └── metadata.ts             # Image metadata extraction
│   │   ├── utils/
│   │   │   ├── srcset.ts               # Srcset generation
│   │   │   ├── breakpoints.ts          # Automatic breakpoint calculation
│   │   │   ├── placeholder.ts          # Placeholder generation
│   │   │   └── formats.ts              # Format handling
│   │   └── types/
│   │       ├── index.ts                # TypeScript types
│   │       └── vite-env.d.ts           # Vite type augmentation
│   └── routes/                         # Demo/test routes
├── static/
│   └── test-images/                    # Test images
└── README.md
```

## Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-2)

#### 1.1 Initialize Project

Create SvelteKit library project:

```bash
npm create svelte@latest svelte-imagetools
# Choose: Library project, TypeScript, ESLint, Prettier

cd svelte-imagetools
npm install
npm install -D sharp @types/sharp magic-string
```

**Note**: `magic-string` is required for the preprocessor to efficiently manipulate source code.

#### 1.2 Configure TypeScript

**tsconfig.json**:
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ESNext",
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "types": ["vite/client", "node"]
  }
}
```

#### 1.3 Implement Vite Plugin

**src/lib/plugin/index.ts** - Main plugin entry:

```typescript
import type { Plugin, ResolvedConfig } from 'vite';
import { transformImage } from './transform';
import { ImageCache } from './cache';
import type { ImagePluginOptions } from '../types';

export function svelteImagePlugin(options: ImagePluginOptions = {}): Plugin {
  let config: ResolvedConfig;
  const cache = new ImageCache();

  const {
    formats = ['avif', 'webp', 'original'],
    breakpoints = [640, 768, 1024, 1280, 1536],
    placeholder = 'blur',
    cacheDir = 'node_modules/.cache/svelte-imagetools',
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
        return id;
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
```

**src/lib/plugin/transform.ts** - Image transformation logic:

```typescript
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import { createHash } from 'crypto';
import type { ResolvedConfig } from 'vite';
import { generateSrcSet } from '../utils/srcset';
import { generatePlaceholder } from '../utils/placeholder';
import type { ImageFormat, TransformOptions } from '../types';

export async function transformImage(
  filepath: string,
  options: TransformOptions
): Promise<string> {
  const { formats, breakpoints, placeholder, params, config } = options;

  // Read original image
  const buffer = await readFile(filepath);
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Extract original dimensions
  const originalWidth = metadata.width!;
  const originalHeight = metadata.height!;
  const aspectRatio = originalWidth / originalHeight;

  // Determine sizes to generate
  const sizes = breakpoints.filter(w => w <= originalWidth);
  if (!sizes.includes(originalWidth)) {
    sizes.push(originalWidth);
  }
  sizes.sort((a, b) => a - b);

  // Generate variants for each format and size
  const variants: Array<{ 
    format: ImageFormat;
    width: number;
    height: number;
    url: string;
  }> = [];

  for (const format of formats) {
    for (const width of sizes) {
      const height = Math.round(width / aspectRatio);

      // Process image
      const processed = await processImageVariant.call(this, image, {
        width,
        height,
        format,
        filepath,
        config,
      });

      variants.push({
        format,
        width,
        height,
        url: processed.url,
      });
    }
  }

  // Generate placeholder if requested
  let placeholderData: string | null = null;
  if (placeholder !== 'none') {
    placeholderData = await generatePlaceholder(image, placeholder);
  }

  // Group variants by format for srcset generation
  const sourcesByFormat = groupByFormat(variants, params);

  // Build metadata object
  const imageData = {
    src: variants.find(v => v.format === 'original')?.url || variants[0].url,
    width: originalWidth,
    height: originalHeight,
    aspectRatio,
    placeholder: placeholderData,
    sources: sourcesByFormat,
  };

  // Return as ES module
  return `export default ${JSON.stringify(imageData)};`;
}

async function processImageVariant(
  image: sharp.Sharp,
  options: { 
    width: number;
    height: number;
    format: ImageFormat;
    filepath: string;
    config: ResolvedConfig;
  }
): Promise<{ url: string; size: number }> {
  const { width, height, format, filepath, config } = options;

  // Clone the sharp instance
  let processor = image.clone().resize(width, height, {
    fit: 'cover',
    position: 'entropy', // Smart crop
  });

  // Apply format-specific optimizations
  switch (format) {
    case 'avif':
      processor = processor.avif({ quality: 80, effort: 4 });
      break;
    case 'webp':
      processor = processor.webp({ quality: 85, effort: 4 });
      break;
    case 'jpeg':
      processor = processor.jpeg({ quality: 85, progressive: true });
      break;
    case 'png':
      processor = processor.png({ quality: 85, progressive: true });
      break;
    case 'original':
      // Keep original format
      break;
  }

  const buffer = await processor.toBuffer();

  // Generate filename with hash
  const hash = generateHash(buffer);
  const ext = format === 'original' ? extname(filepath) : `.${format}`;
  const name = basename(filepath, extname(filepath));
  const filename = `${name}-${width}w-${hash}${ext}`;

  // CRITICAL: For production builds, assets must be emitted to the build output.
  // TODO: This section must use the Rollup plugin context (`this`), passed from `load`.
  // 1. Emit the file to the build output:
  //    const referenceId = this.emitFile({
  //      type: 'asset',
  //      name: filename,
  //      source: buffer
  //    });
  // 2. Generate a URL placeholder that Vite will replace:
  //    const url = `import.meta.ROLLUP_FILE_URL_${referenceId}`;
  // 3. The parent `transformImage` function must then be updated to handle this
  //    expression, ensuring it's not stringified in the final JSON output.
  const url = config.build.assetsDir
    ? `/${config.build.assetsDir}/${filename}`
    : `/${filename}`;
  
  if (config.command === 'build' && this.emitFile) {
      this.emitFile({
        type: 'asset',
        name: filename,
        source: buffer
      });
  }

  return { url, size: buffer.length };
}

function groupByFormat(variants: any[], params: URLSearchParams) {
  const groups: Record<string, any[]> = {};
  const userSizes = params.get('sizes') || undefined;

  for (const variant of variants) {
    if (!groups[variant.format]) {
      groups[variant.format] = [];
    }
    groups[variant.format].push(variant);
  }

  return Object.entries(groups).map(([format, vars]) => ({
    format,
    type: getMimeType(format),
    srcset: vars.map(v => `${v.url} ${v.width}w`).join(', '),
    sizes: generateSizesAttribute(vars, userSizes),
  }));
}

function getMimeType(format: string): string {
  const types: Record<string, string> = {
    avif: 'image/avif',
    webp: 'image/webp',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
  };
  return types[format] || 'image/jpeg';
}

function generateSizesAttribute(variants: any[], userSizes?: string): string {
  // If the user provides a `sizes` prop, prioritize it.
  if (userSizes) return userSizes;
  // Simple default: full viewport width
  return '100vw';
}

function generateHash(buffer: Buffer): string {
  return createHash('md5').update(buffer).digest('hex').slice(0, 8);
}
```

**src/lib/plugin/cache.ts** - Caching system:

```typescript
import { createHash } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export class ImageCache {
  private cacheDir: string;
  private memoryCache: Map<string, string>;

  constructor(cacheDir = 'node_modules/.cache/svelte-imagetools') {
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
```

#### 1.4 Implement Svelte Preprocessor

**src/lib/preprocessor/index.ts** - Main preprocessor entry:

```typescript
import type { PreprocessorGroup } from 'svelte/compiler';
import { transformMarkup } from './markup';
import type { ImagePluginOptions } from '../types';

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
```

**src/lib/preprocessor/markup.ts** - Markup transformation logic:

```typescript
import MagicString from 'magic-string';
import { parse, walk as svelteWalk } from 'svelte/compiler';
import { resolve, dirname } from 'path';
import type { ImagePluginOptions } from '../types';

export function transformMarkup( 
  content: string,
  filename: string,
  options: ImagePluginOptions
) {
  const s = new MagicString(content);
  const ast = parse(content);

  // Track imports we need to add
  const imports: Array<{ id: string; path: string; query: string }> = [];
  let importCounter = 0;

  // Find all image component instances
  const componentNames = ['Picture', 'Image', 'BackgroundImage'];

  svelteWalk(ast.html, {
    enter(node: any) {
      if (node.type === 'InlineComponent' && componentNames.includes(node.name)) {
        // Find the src attribute
        const srcAttr = node.attributes?.find(
          (attr: any) => attr.name === 'src' && attr.type === 'Attribute'
        );

        if (srcAttr && srcAttr.value?.length === 1 && srcAttr.value[0].type === 'Text') {
          const imagePath = srcAttr.value[0].data;

          if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
            const importPath = imagePath.startsWith('.') ? imagePath : './' + imagePath;
            const query = buildQueryString(node, options);
            const importId = `__img_${importCounter++}`;
            imports.push({ id: importId, path: importPath, query });

            const attrStart = content.indexOf('src=', srcAttr.start) + 4;
            const quoteChar = content[attrStart];
            const valueStart = attrStart + 1;
            const valueEnd = content.indexOf(quoteChar, valueStart);

            s.overwrite(attrStart, valueEnd + 1, `{${importId}}`);
          }
        }
        
        // CRITICAL TODO: Handle `artDirectives` prop for <Picture> components.
        // The logic must traverse the AST for the `artDirectives` prop value,
        // which is likely a JavaScript expression (Array of Objects). For each
        // `src` property within those objects that is a string literal, it must
        // be replaced with a static import, similar to the main `src` prop.
        const artDirectivesAttr = node.attributes?.find(
            (attr: any) => attr.name === 'artDirectives'
        );
        if (artDirectivesAttr) {
            // This is a placeholder for the complex AST traversal required.
            // console.log('Found artDirectives. Processing required.');
        }
      }
    }
  });

  // Add imports to the script block
  if (imports.length > 0) {
    const importStatements = imports
      .map(({ id, path, query }) => `  import ${id} from '${path}${query}';`)
      .join('\n');

    const scriptTag = ast.instance;
    if (scriptTag) {
      const scriptStart = scriptTag.content.start;
      s.appendLeft(scriptStart, importStatements + '\n');
    } else {
      s.prepend(`<script>\n${importStatements}\n</script>\n\n`);
    }
  }

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true }),
  };
}

function buildQueryString(node: any, options: ImagePluginOptions): string {
  const params = new URLSearchParams();
  params.set('responsive', 'true');

  const attrs = node.attributes || [];

  const getAttrValue = (name: string) => attrs.find((a: any) => a.name === name)?.value?.[0]?.data;

  params.set('formats', getAttrValue('formats') || options.formats?.join(','));
  params.set('placeholder', getAttrValue('placeholder') || options.placeholder);
  params.set('sizes', getAttrValue('sizes'));

  // clean up null/undefined entries
  for (let [key, value] of [...params]) {
    if (value === null || value === undefined || value === 'undefined') {
      params.delete(key);
    }
  }

  const queryString = params.toString();
  return queryString ? '?' + queryString : '';
}
```

#### 1.5 Utility Functions

**src/lib/utils/placeholder.ts**:

```typescript
import type sharp from 'sharp';
import type { PlaceholderType } from '../types';

export async function generatePlaceholder(
  image: sharp.Sharp,
  type: PlaceholderType
): Promise<string | null> {
  switch (type) {
    case 'blur': {
      // Generate tiny blurred version as base64 data URL
      const buffer = await image
        .clone()
        .resize(20, 20, { fit: 'inside' })
        .blur(10)
        .jpeg({ quality: 50 })
        .toBuffer();

      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }

    case 'dominant-color': {
      // Extract dominant color
      const { dominant } = await image.clone().stats();
      return `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`;
    }

    case 'traced-svg': {
      // Simplified: return a simple SVG placeholder
      // Full implementation would use potrace or similar
      const metadata = await image.metadata();
      const { width = 100, height = 100 } = metadata;
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23ddd'/%3E%3C/svg%3E`;
    }

    case 'none':
    default:
      return null;
  }
}
```

**src/lib/utils/breakpoints.ts**:

```typescript
/**
 * Calculate optimal breakpoints based on image width
 * Reference: astro-imagetools approach
 */
export function calculateBreakpoints(
  originalWidth: number,
  options: { min?: number; max?: number; count?: number } = {}
): number[] {
  const { min = 640, max = originalWidth, count = 5 } = options;

  const breakpoints: number[] = [];
  const step = (max - min) / (count - 1);

  for (let i = 0; i < count; i++) {
    const width = Math.round(min + step * i);
    if (width <= originalWidth) {
      breakpoints.push(width);
    }
  }

  // Always include original width if not already present
  if (!breakpoints.includes(originalWidth) && originalWidth >= min) {
    breakpoints.push(originalWidth);
  }

  return breakpoints.sort((a, b) => a - b);
}
```

**src/lib/utils/srcset.ts**:

```typescript
import type { ImageSource } from '../types';

export function generateSrcSet(sources: ImageSource[]): string {
  return sources
    .map(source => `${source.url} ${source.width}w`)
    .join(', ');
}

export function generateSizesAttribute(
  breakpoints?: Array<{ media: string; size: string }>,
  userSizes?: string
): string {
  if (!breakpoints || breakpoints.length === 0) {
    return '100vw';
  }

  const sizes = breakpoints
    .map(bp => `${bp.media} ${bp.size}`)
    .join(', ');

  // Add default fallback
  return `${sizes}, 100vw`;
}
```

#### 1.6 TypeScript Types

**src/lib/types/index.ts**:

```typescript
export type ImageFormat = 'avif' | 'webp' | 'jpeg' | 'png' | 'original';
export type PlaceholderType = 'blur' | 'dominant-color' | 'traced-svg' | 'none';
export type LoadingType = 'lazy' | 'eager';

export interface ImagePluginOptions {
  formats?: ImageFormat[];
  breakpoints?: number[];
  placeholder?: PlaceholderType;
  cacheDir?: string;
}

export interface ImageSource {
  format: ImageFormat;
  type: string;
  srcset: string;
  sizes?: string;
  width?: number;
  height?: number;
}

export interface ImageData {
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  placeholder?: string | null;
  sources: ImageSource[];
}

// CRITICAL: Props now receive ImageData objects, not string paths
// The preprocessor converts string paths to ImageData before components see them
export interface PictureProps {
  src: ImageData; // Changed from string to ImageData
  alt: string;
  sizes?: string; // For responsive image sizes
  loading?: LoadingType;
  class?: string;
  artDirectives?: Array<{ 
    media: string;
    src: string; // This path must also be processed by the preprocessor
  }>;
  [key: string]: any; // Allow spreading other props
}

export interface ImageProps {
  src: ImageData; // Changed from string to ImageData
  alt: string;
  sizes?: string; // For responsive image sizes
  width?: number;
  height?: number;
  loading?: LoadingType;
  class?: string;
  [key: string]: any; // Allow spreading other props
}

export interface TransformOptions {
  formats: ImageFormat[];
  breakpoints: number[];
  placeholder: PlaceholderType;
  params: URLSearchParams;
  config: any;
}
```

**src/lib/types/vite-env.d.ts** - Augment Vite types:

```typescript
/// <reference types="vite/client" />

declare module '*.jpg?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.jpeg?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.png?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.webp?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}

declare module '*.avif?responsive' {
  import type { ImageData } from './index';
  const data: ImageData;
  export default data;
}
```

### Phase 2: Svelte Components (Weeks 3-4)

#### 2.1 Picture Component

**src/lib/components/Picture.svelte**:

```svelte
<script lang="ts">
  import type { ImageData } from '../types';

  // Props using Svelte 5 $props rune
  // CRITICAL: src is now ImageData, not a string path
  // The preprocessor converts string paths to ImageData objects before this component sees them
  let { 
    src, // This is ImageData, pre-loaded by preprocessor + Vite plugin
    alt,
    sizes,
    loading = 'lazy',
    class: className = '',
    artDirectives = [],
    ...restProps
  }: { 
    src: ImageData;
    alt: string;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    class?: string;
    artDirectives?: Array<{ media: string; src: string }>;
    [key: string]: any;
  } = $props();

  // Computed placeholder style
  // No $effect needed - data is already available!
  let placeholderStyle = $derived.by(() => {
    if (!src?.placeholder) return '';

    // Detect placeholder type from data format
    if (src.placeholder.startsWith('data:image/')) {
      return `background-image: url(${src.placeholder}); background-size: cover; background-position: center;`;
    } else if (src.placeholder.startsWith('rgb(')) {
      return `background-color: ${src.placeholder};`;
    }
    return '';
  });
</script>

<!-- No conditional rendering - data is always available at render time -->
<!-- This ensures perfect SSR with <img> in initial HTML -->
<picture class={className}>
  <!-- Art direction sources (if provided) -->
  {#if artDirectives && artDirectives.length > 0}
    {#each artDirectives as directive}
      <source media={directive.media} srcset={directive.src} />
    {/each}
  {/if}

  <!-- Format-specific sources -->
  {#each src.sources as source}
    <source
      type={source.type}
      srcset={source.srcset}
      sizes={sizes || source.sizes || '100vw'}
    />
  {/each}

  <!-- Fallback img -->
  <img
    src={src.src}
    {alt}
    width={src.width}
    height={src.height}
    {loading}
    style={placeholderStyle}
    {...restProps}
  />
</picture>

<style>
  picture {
    display: block;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
```

#### 2.2 Image Component

**src/lib/components/Image.svelte**:

```svelte
<script lang="ts">
  import type { ImageData } from '../types';

  let {
    src, // ImageData object, pre-loaded by preprocessor
    alt,
    sizes,
    width,
    height,
    loading = 'lazy',
    class: className = '',
    ...restProps
  }: { 
    src: ImageData;
    alt: string;
    sizes?: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    class?: string;
    [key: string]: any;
  } = $props();

  // Use first source's srcset (typically AVIF or WebP)
  let srcset = $derived(src?.sources[0]?.srcset || '');
  let finalSizes = $derived(sizes || src?.sources[0]?.sizes || '100vw');

  let placeholderStyle = $derived.by(() => {
    if (!src?.placeholder) return '';

    if (src.placeholder.startsWith('data:image/')) {
      return `background-image: url(${src.placeholder}); background-size: cover; background-position: center;`;
    } else if (src.placeholder.startsWith('rgb(')) {
      return `background-color: ${src.placeholder};`;
    }
    return '';
  });
</script>

<!-- No conditional - data is always available for perfect SSR -->
<img
  src={src.src}
  {alt}
  {srcset}
  sizes={finalSizes}
  width={width || src.width}
  height={height || src.height}
  {loading}
  class={className}
  style={placeholderStyle}
  {...restProps}
/>

<style>
  img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
```

#### 2.3 BackgroundImage Component

**src/lib/components/BackgroundImage.svelte**:

```svelte
<script lang="ts">
  import type { ImageData } from '../types';

  let { 
    src, // ImageData object, pre-loaded by preprocessor
    class: className = '',
    children,
    ...restProps
  }: { 
    src: ImageData;
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();

  // Generate CSS image-set
  // No $effect needed - data is immediately available
  let backgroundStyle = $derived.by(() => {
    if (!src) return '';

    const imageSets = src.sources
      .map(source => {
        const urls = source.srcset.split(', ').map(entry => {
          const [url] = entry.split(' ');
          return `url("${url}") type("${source.type}")`;
        });
        return urls.join(', ');
      })
      .join(', ');

    return `background-image: image-set(${imageSets}); background-size: cover; background-position: center;`;
  });
</script>

<div
  class={className}
  style={backgroundStyle}
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  div {
    position: relative;
  }
</style>
```

### Phase 3: Configuration & Export (Week 5)

#### 3.1 Package Configuration

**package.json**:

```json
{
  "name": "g3-imagetools",
  "version": "0.1.0",
  "description": "Image optimization library for Svelte/SvelteKit",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && npm run package",
    "package": "svelte-kit sync && svelte-package && publint",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "eslint ."
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    },
    "./plugin": {
      "types": "./dist/plugin/index.d.ts",
      "import": "./dist/plugin/index.js"
    }
  },
  "files": [
    "dist",
    "!dist/**/*.test.*",
    "!dist/**/*.spec.*
  ],
  "peerDependencies": {
    "svelte": "^5.0.0",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/package": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^9.0.0",
    "publint": "^0.2.0",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tslib": "^2.4.1",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  },
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

#### 3.2 Main Export

**src/lib/index.ts**:

```typescript
// Components
export { default as Picture } from './components/Picture.svelte';
export { default as Image } from './components/Image.svelte';
export { default as BackgroundImage } from './components/BackgroundImage.svelte';

// Preprocessor (critical for SSR and static analysis)
export { svelteImagePreprocessor } from './preprocessor/index';

// Vite Plugin (handles image transformation)
export { svelteImagePlugin } from './plugin/index';

// Types
export type { 
  ImageFormat,
  PlaceholderType,
  LoadingType,
  ImagePluginOptions,
  ImageSource,
  ImageData,
  PictureProps,
  ImageProps,
} from './types';

// Utilities
export { calculateBreakpoints } from './utils/breakpoints';
export { generateSrcSet, generateSizesAttribute } from './utils/srcset';
```

#### 3.3 Vite Config

**vite.config.ts** (for development/testing):

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelteImagePlugin } from './src/lib/plugin';

export default defineConfig({
  plugins: [
    // Vite plugin handles image transformation
    svelteImagePlugin({
      formats: ['avif', 'webp', 'jpeg'],
      breakpoints: [640, 768, 1024, 1280, 1536],
      placeholder: 'blur',
    }),
    sveltekit(),
  ],
});
```

**svelte.config.js** (CRITICAL - preprocessor must be configured):

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { svelteImagePreprocessor } from './src/lib/preprocessor/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Preprocessor runs BEFORE Vite sees the code
  // This is critical for SSR and static analysis
  preprocess: [
    vitePreprocess(),
    // CRITICAL: Preprocessor must be included for SSR and static analysis
    svelteImagePreprocessor({
      formats: ['avif', 'webp', 'jpeg'],
      breakpoints: [640, 768, 1024, 1280, 1536],
      placeholder: 'blur',
    }),
  ],

  kit: {
    adapter: adapter(),
  },
};

export default config;
```

#### 4.2 Component Usage

**Basic responsive image with custom sizes**:

```svelte
<script>
  import { Image } from 'g3-imagetools';
</script>

<Image
  src="/images/hero.jpg"
  alt="Hero image"
  loading="eager"
  sizes="(min-width: 1024px) 50vw, 100vw"
/>
```

**Picture with multiple formats**:

```svelte
<script>
  import { Picture } from 'g3-imagetools';
</script>

<Picture
  src="/images/product.jpg"
  alt="Product photo"
  formats={['avif', 'webp', 'jpeg']}
  placeholder="blur"
  loading="lazy"
/>
```

**Art direction example**:

```svelte
<script>
  import { Picture } from 'g3-imagetools';
</script>

<Picture
  src="/images/landscape-wide.jpg"
  alt="Scenic landscape"
  artDirectives={[
    // NOTE: The preprocessor MUST also transform these local paths.
    { media: '(max-width: 768px)', src: './landscape-portrait.jpg' },
    { media: '(min-width: 769px)', src: './landscape-wide.jpg' }
  ]}
/>
```

**Background image**:

```svelte
<script>
  import { BackgroundImage } from 'g3-imagetools';
</script>

<BackgroundImage
  src="/images/hero-bg.jpg"
  class="hero-section"
>
  <h1>Welcome</h1>
</BackgroundImage>

<style>
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

## Testing Strategy

### Unit Tests
- Image transformation logic
- Breakpoint calculation
- Placeholder generation
- Srcset generation

### Integration Tests
- Vite plugin in dev mode
- Vite plugin in build mode
- Component rendering
- SSR compatibility

### E2E Tests
- Full build process
- Asset emission
- Browser image loading
- Responsive behavior

### Performance Tests
- Build time benchmarks
- Cache effectiveness
- Bundle size analysis
- Runtime performance

## Optimization Opportunities

### Build Performance
1. **Parallel Processing**: Use worker threads for Sharp operations
2. **Incremental Builds**: Only process changed images
3. **Smart Caching**: Multi-tier cache (memory, disk, CDN)
4. **Lazy Transform**: On-demand processing in dev mode

### Runtime Performance
1. **Zero Runtime**: All processing at build time
2. **Minimal JavaScript**: Components are simple wrappers
3. **Native Loading**: Use browser-native lazy loading
4. **Efficient Placeholders**: Tiny blurred images (`<2KB`)

### Developer Experience
1. **Fast HMR**: Instant updates without full rebuild
2. **Clear Errors**: Helpful error messages with solutions
3. **Type Safety**: Full TypeScript support
4. **Auto-complete**: IntelliSense for all props

## Advanced Features (Future)

### Phase 2 Enhancements
- **Custom breakpoint strategies**: Auto-detect from CSS/Tailwind
- **Advanced placeholders**: Traced SVG using potrace
- **Quality presets**: Profiles for different use cases
- **CDN integration**: Automatic upload to Cloudinary/Imgix
- **Video support**: Similar API for video optimization

### Phase 3 Enhancements
- **Dynamic imports**: Code-split components
- **Web Workers**: Background processing
- **Service Worker**: Offline image caching
- **Analytics**: Track image performance
- **A/B Testing**: Compare format effectiveness

## Getting Started

To begin implementation:

1. Create new SvelteKit library project
2. **Start with Preprocessor (Phase 1.4) - This is the critical piece!**
3. Implement Vite plugin (Phase 1.3)
4. **Test the full pipeline: preprocessor → plugin → component**
5. Build "dumb renderer" components that receive ImageData
6. Follow the phased approach outlined above
7. Reference the documentation files for specific API details

## Critical Architectural Decisions Summary

### Why Three Layers?

1. **Svelte Preprocessor** (runs at compile time, before Vite)
   - Converts `<Picture src="./hero.jpg" />` to static imports
   - Ensures Vite can analyze dependencies
   - Fixes path resolution issues
   - **Without this, the library doesn't work in production**

2. **Vite Plugin** (runs during bundling)
   - Processes images with Sharp
   - Generates optimized variants
   - Returns ImageData objects
   - Handles caching

3. **Svelte Components** (runtime, but SSR-ready)
   - Receive ImageData objects (not strings)
   - Render HTML immediately (no async loading)
   - Work perfectly with SSR
   - Zero client-side overhead

### The Data Flow

```
1. User writes:
   <Picture src="./hero.jpg" alt="Hero" />

2. Preprocessor transforms (compile time):
   <script>
     import __img_0 from "./hero.jpg?responsive";
   </script>
   <Picture src={__img_0} alt="Hero" />

3. Vite plugin processes (build time):
   import "./hero.jpg?responsive"
   → Sharp processes image
   → Returns: { src, width, height, sources: [...], placeholder }

4. Component renders (runtime/SSR):
   <picture>
     <source srcset="hero-640w.avif 640w, hero-1280w.avif 1280w" />
     <img src="hero-1280w.jpg" width="1280" height="720" />
   </picture>
```

### Why This Approach Works

✅ **Bundling**: Vite sees static imports, can analyze dependencies
✅ **Path Resolution**: Imports resolve relative to caller file
✅ **SSR**: Components render synchronously with full data
✅ **SEO**: `<img>` tags in initial HTML
✅ **Performance**: Zero runtime overhead, perfect LCP scores
✅ **Developer Experience**: Simple API, TypeScript support

### Common Pitfalls to Avoid

❌ **Don't use dynamic imports in components**
```typescript
// ❌ BROKEN
import(`${src}?responsive`)
```

❌ **Don't use $effect to load image data**
```typescript
// ❌ BROKEN (no SSR)
$effect(() => { ... })
```

❌ **Don't make components async**
```typescript
// ❌ BROKEN (conditional rendering breaks SSR)
{#if imageData} <img /> {/if}
```

✅ **Do use the preprocessor to convert to static imports**
✅ **Do make components synchronous "dumb renderers"**
✅ **Do ensure all data is available at render time**

Good luck with the implementation!
