import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { basename, extname, join } from 'path';
import { createHash } from 'crypto';
import type { ResolvedConfig } from 'vite';
import { generateSrcSet } from '../utils/srcset.ts';
import { generatePlaceholder } from '../utils/placeholder.ts';
import type { ImageFormat, TransformOptions } from '../types/index.ts';

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
  let url: string;

  if (config.command === 'build') {
    // Production build: emit file to build output
    url = config.build.assetsDir
      ? `/${config.build.assetsDir}/${filename}`
      : `/${filename}`;
    
    // @ts-ignore - this.emitFile comes from rollup plugin context
    if (this.emitFile) {
        // @ts-ignore
        this.emitFile({
          type: 'asset',
          name: filename,
          source: buffer
        });
    }
  } else {
    // Development mode: write to cache and serve via /@fs/
    const cacheDir = join(config.root, 'node_modules/.cache/polaretto/assets');
    await mkdir(cacheDir, { recursive: true });
    const cacheFilePath = join(cacheDir, filename);
    await writeFile(cacheFilePath, buffer);
    
    // Vite serves files from filesystem using /@fs/ prefix
    url = `/@fs${cacheFilePath}`;
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