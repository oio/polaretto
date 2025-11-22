import type sharp from 'sharp';
import type { PlaceholderType } from '../types/index.ts';

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