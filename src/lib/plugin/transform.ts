import sharp from "sharp";
import { readFile, writeFile, mkdir } from "fs/promises";
import { basename, extname, join } from "path";
import { createHash } from "crypto";
import type { ResolvedConfig } from "vite";
import { generateSrcSet } from "../utils/srcset.ts";
import { generatePlaceholder } from "../utils/placeholder.ts";
import type { ImageFormat, TransformOptions } from "../types/index.ts";

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

  // Extract fit option
  // @ts-ignore
  const fit = params.get("fit") || "cover";

  // @ts-ignore
  const requestedPlaceholder = params.get("placeholder") || placeholder;

  // console.log(`[Transform] Processing ${filepath} | Placeholder: ${requestedPlaceholder}`);

  // Determine sizes to generate
  let sizes: number[] = [];
  const requestedWidth = params.get("w");
  const requestedHeight = params.get("h");

  if (requestedWidth) {
    // User requested specific width
    sizes = [parseInt(requestedWidth, 10)];
  } else if (requestedHeight) {
    // User requested specific height - calculate width
    sizes = [Math.round(parseInt(requestedHeight, 10) * aspectRatio)];
  } else {
    // Default behavior: use breakpoints
    sizes = breakpoints.filter((w) => w <= originalWidth);
    if (!sizes.includes(originalWidth)) {
      sizes.push(originalWidth);
    }
    sizes.sort((a, b) => a - b);
  }

  // Calculate final dimensions for metadata
  let finalWidth = originalWidth;
  let finalHeight = originalHeight;

  if (requestedWidth && requestedHeight) {
    finalWidth = parseInt(requestedWidth, 10);
    finalHeight = parseInt(requestedHeight, 10);
  } else if (requestedWidth) {
    finalWidth = parseInt(requestedWidth, 10);
    finalHeight = Math.round(finalWidth / aspectRatio);
  } else if (requestedHeight) {
    finalHeight = parseInt(requestedHeight, 10);
    finalWidth = Math.round(finalHeight * aspectRatio);
  }

  // Generate variants for each format and size
  const variants: Array<{
    format: ImageFormat;
    width: number;
    height: number;
    url: string;
  }> = [];

  for (const format of formats) {
    for (const width of sizes) {
      let height: number;

      if (requestedHeight && !requestedWidth) {
        height = parseInt(requestedHeight, 10);
      } else if (requestedWidth && requestedHeight) {
        height = parseInt(requestedHeight, 10);
      } else {
        // If sizes array is used (breakpoints) OR only width requested
        height = Math.round(width / aspectRatio);
      }

      // Process image
      const processed = await processImageVariant.call(this, image, {
        width,
        height,
        format,
        fit,
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

  // Generate placeholder (LQIP)
  let placeholderUrl: string | string[] | null = null;
  if (requestedPlaceholder !== "none") {
    let placeholderWidth = 10;
    let placeholderHeight: number | undefined = undefined;

    // Helper to calculate height maintaining aspect ratio
    const calcHeight = (w: number) => {
      if (requestedWidth && requestedHeight) {
        const targetRatio =
          parseInt(requestedWidth) / parseInt(requestedHeight);
        return Math.round(w / targetRatio);
      }
      return Math.round(w / aspectRatio);
    };

    if (requestedPlaceholder === "pixelated") {
      // Generate 2-stage pixelated placeholder: 40px and 10px
      const sizes = [8, 4];
      const urls: string[] = [];

      for (const width of sizes) {
        const height = calcHeight(width);
        const variant = await processImageVariant.call(this, image, {
          width,
          height,
          format: "webp",
          fit: fit,
          filepath,
          config,
        });
        urls.push(variant.url);
      }
      placeholderUrl = urls; // [url100, url10]
    } else {
      // Standard blur/dominant-color (base64)
      placeholderHeight = calcHeight(placeholderWidth);
      placeholderUrl = await generatePlaceholder(image, requestedPlaceholder, {
        fit: fit,
        position: "entropy",
        width: placeholderWidth,
        height: placeholderHeight,
      });
    }
  }

  // Group variants by format for srcset generation
  const sourcesByFormat = groupByFormat(variants, params);

  // Build metadata object
  const imageData = {
    src: variants.find((v) => v.format === "original")?.url || variants[0].url,
    width: finalWidth,
    height: finalHeight,
    aspectRatio,
    placeholder: placeholderUrl, // URL to the 10px image
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
    fit: any;
    filepath: string;
    config: ResolvedConfig;
  }
): Promise<{ url: string; size: number }> {
  const { width, height, format, fit, filepath, config } = options;

  // Clone the sharp instance
  let processor = image.clone().resize(width, height, {
    fit: fit,
    position: "entropy", // Smart crop (only applies if fit is cover/contain)
  });

  // Apply format-specific optimizations
  switch (format) {
    case "avif":
      processor = processor.avif({ quality: 80, effort: 4 });
      break;
    case "webp":
      processor = processor.webp({ quality: 85, effort: 4 });
      break;
    case "jpeg":
      processor = processor.jpeg({ quality: 85, progressive: true });
      break;
    case "png":
      processor = processor.png({ quality: 85, progressive: true });
      break;
    case "original":
      // Keep original format
      break;
  }

  const buffer = await processor.toBuffer();

  // Generate filename with hash
  const hash = generateHash(buffer);
  const ext = format === "original" ? extname(filepath) : `.${format}`;
  const name = basename(filepath, extname(filepath));
  const filename = `${name}-${width}w-${hash}${ext}`;
  let url: string;

  if (config.command === "build") {
    // Production build: emit file to build output
    url = config.build.assetsDir
      ? `/${config.build.assetsDir}/${filename}`
      : `/${filename}`;

    // @ts-ignore - this.emitFile comes from rollup plugin context
    if (this.emitFile) {
      // @ts-ignore
      this.emitFile({
        type: "asset",
        name: filename,
        source: buffer,
      });
    }
  } else {
    // Development mode: write to cache and serve via /@fs/
    const cacheDir = join(config.root, "node_modules/.cache/polaretto/assets");
    try {
      await mkdir(cacheDir, { recursive: true });
      const cacheFilePath = join(cacheDir, filename);
      await writeFile(cacheFilePath, buffer);
      // Vite serves files from filesystem using /@fs/ prefix
      url = `/@fs${cacheFilePath}`;
    } catch (err) {
      console.error("[Vite Plugin] Error writing image to cache:", err);
      // Fallback or rethrow? Rethrowing to make it visible.
      throw err;
    }
  }

  return { url, size: buffer.length };
}

function groupByFormat(variants: any[], params: URLSearchParams) {
  const groups: Record<string, any[]> = {};
  const userSizes = params.get("sizes") || undefined;

  for (const variant of variants) {
    if (!groups[variant.format]) {
      groups[variant.format] = [];
    }
    groups[variant.format].push(variant);
  }

  return Object.entries(groups).map(([format, vars]) => ({
    format,
    type: getMimeType(format),
    srcset: vars.map((v) => `${v.url} ${v.width}w`).join(", "),
    sizes: generateSizesAttribute(vars, userSizes),
  }));
}

function getMimeType(format: string): string {
  const types: Record<string, string> = {
    avif: "image/avif",
    webp: "image/webp",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
  };
  return types[format] || "image/jpeg";
}

function generateSizesAttribute(variants: any[], userSizes?: string): string {
  // If the user provides a `sizes` prop, prioritize it.
  if (userSizes) return userSizes;
  // Simple default: full viewport width
  return "100vw";
}

function generateHash(buffer: Buffer): string {
  return createHash("md5").update(buffer).digest("hex").slice(0, 8);
}
