
/**
 * Generates transformed Supabase Storage URLs for responsive images.
 * Uses query parameters on /object/public/ URLs (Supabase Pro feature).
 * 
 * Falls back to original URL if not a Supabase storage URL.
 */

const SUPABASE_PROJECT_ID = 'xlhcneenthhhsjqqdmbm';

// Standard breakpoints for srcset
export const IMAGE_WIDTHS = [480, 768, 1200, 1600] as const;

export interface TransformOptions {
  width: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
}

/**
 * Check if a URL is a Supabase Storage URL from our project
 */
function isSupabaseStorageUrl(url: string): boolean {
  return url.includes(`${SUPABASE_PROJECT_ID}.supabase.co/storage/`);
}

/**
 * Get a transformed image URL with specific width and quality.
 * Appends query params directly to the /object/public/ URL.
 */
export function getTransformedUrl(src: string, options: TransformOptions): string {
  if (!src || !isSupabaseStorageUrl(src)) {
    return src;
  }

  // Strip any existing query params
  const baseUrl = src.split('?')[0];

  const params = new URLSearchParams();
  params.set('width', String(options.width));
  params.set('quality', String(options.quality ?? 90));
  if (options.format && options.format !== 'origin') {
    params.set('format', options.format);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate a srcSet string for responsive images.
 * `format` defaults to 'webp'; pass 'origin' to skip re-encoding.
 */
export function getSrcSet(src: string, quality = 90, format: TransformOptions['format'] = 'webp'): string {
  if (!src || !isSupabaseStorageUrl(src)) {
    return '';
  }

  return IMAGE_WIDTHS.map(w =>
    `${getTransformedUrl(src, { width: w, quality, format })} ${w}w`
  ).join(', ');
}

/**
 * Default sizes attribute for catalog/product grid images
 */
export const CATALOG_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 420px';

/**
 * Generate a srcSet using x-descriptors (1x/2x/3x) based on the base width of the element.
 * This ensures retina displays always pull a higher-resolution image.
 */
export function getXDescriptorSrcSet(src: string, baseWidth: number, quality = 90, format: TransformOptions['format'] = 'webp'): string {
  if (!src || !isSupabaseStorageUrl(src)) {
    return '';
  }

  const descriptors = [
    { multiplier: 1, width: baseWidth },
    { multiplier: 2, width: baseWidth * 2 },
    { multiplier: 3, width: baseWidth * 3 },
  ];

  return descriptors.map(d =>
    `${getTransformedUrl(src, { width: d.width, quality, format })} ${d.multiplier}x`
  ).join(', ');
}

/**
 * Sizes for featured/hero product images
 */
export const FEATURED_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
