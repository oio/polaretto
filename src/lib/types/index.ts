export type ImageFormat = 'avif' | 'webp' | 'jpeg' | 'png' | 'original';
export type PlaceholderType = 'blur' | 'dominant-color' | 'traced-svg' | 'pixelated' | 'none';
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
  placeholder?: string | string[] | null;
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
    src: ImageData | string; // Can be pre-processed ImageData or raw string
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