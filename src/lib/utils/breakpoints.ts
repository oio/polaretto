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