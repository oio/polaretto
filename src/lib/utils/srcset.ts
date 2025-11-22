import type { ImageSource } from '../types/index.ts';

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