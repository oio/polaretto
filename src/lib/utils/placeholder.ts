import type sharp from 'sharp';
import type { PlaceholderType } from '../types/index.ts';

export async function generatePlaceholder(
  image: sharp.Sharp,
  type: PlaceholderType,
  options: { fit?: any; position?: any; width?: number; height?: number } = {}
): Promise<string | null> {
  const width = options.width || 10;
  const height = options.height || null;

  switch (type) {
    case 'blur': {
      // Generate tiny blurred version as base64 data URL
      const buffer = await image
        .clone()
        .resize(width * 2, height ? height * 2 : null, { fit: options.fit || 'inside', position: options.position }) // *2 for blur quality
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

    case 'pixelated': {
      // Generate tiny version (default 10px wide) to be scaled up with pixelated rendering
      // Use default kernel for downscaling to preserve details better than nearest neighbor
      // Use PNG to avoid JPEG artifacts at this tiny size
      const buffer = await image
        .clone()
        .resize(width, height, { fit: options.fit || 'inside', position: options.position }) 
        .png()
        .toBuffer();

      return `data:image/png;base64,${buffer.toString('base64')}`;
    }

    case 'none':
    default:
      return null;
  }
}