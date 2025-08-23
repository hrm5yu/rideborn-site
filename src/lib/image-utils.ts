// Image optimization utilities for microCMS
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  fit?: 'crop' | 'clip' | 'scale-down' | 'max' | 'fill';
  focus?: 'auto' | 'left' | 'right' | 'top' | 'bottom' | 'center';
}

/**
 * Optimize microCMS image URL with parameters
 */
export function optimizeImage(
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!originalUrl || !originalUrl.includes('microcms.io')) {
    return originalUrl;
  }

  const params = new URLSearchParams();

  if (options.width) {
    params.append('w', options.width.toString());
  }

  if (options.height) {
    params.append('h', options.height.toString());
  }

  if (options.quality) {
    params.append('q', options.quality.toString());
  }

  if (options.format) {
    params.append('fm', options.format);
  }

  // アスペクト比を保持するための設定
  if (options.fit) {
    params.append('fit', options.fit);
  } else {
    // デフォルトでアスペクト比を保持
    params.append('fit', 'max');
  }

  if (options.focus) {
    params.append('f', options.focus);
  }

  const separator = originalUrl.includes('?') ? '&' : '?';
  return `${originalUrl}${separator}${params.toString()}`;
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function generateResponsiveImages(
  originalUrl: string,
  sizes: { width: number; height?: number }[]
): string[] {
  return sizes.map(size => optimizeImage(originalUrl, size));
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcset(
  originalUrl: string,
  sizes: { width: number; height?: number }[]
): string {
  return sizes
    .map(size => {
      const optimizedUrl = optimizeImage(originalUrl, size);
      return `${optimizedUrl} ${size.width}w`;
    })
    .join(', ');
}

/**
 * Predefined image sizes for common use cases
 * Note: Using fit: 'max' to preserve aspect ratio
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 400, quality: 75, format: 'webp', fit: 'max' },
  card: { width: 600, quality: 80, format: 'webp', fit: 'max' },
  hero: { width: 1200, quality: 85, format: 'webp', fit: 'max' },
  article: { width: 800, quality: 80, format: 'webp', fit: 'max' },
  gallery: { width: 300, quality: 75, format: 'webp', fit: 'max' },
} as const;

/**
 * Responsive breakpoints for srcset
 */
export const RESPONSIVE_SIZES = [
  { width: 320 },
  { width: 480 },
  { width: 768 },
  { width: 1024 },
  { width: 1440 },
];
