
/**
 * Generates transformed Supabase Storage URLs for responsive images.
 * Uses Supabase's built-in image transformation API:
 * /storage/v1/render/image/public/bucket/path?width=X&quality=Y&format=webp
 * 
 * Falls back to original URL if not a Supabase storage URL.
 */

const SUPABASE_PROJECT_ID = 'xlhcneenthhhsjqqdmbm';
const SUPABASE_STORAGE_BASE = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1`;

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
 * Convert a Supabase Storage object URL to a render (transform) URL
 * /storage/v1/object/public/bucket/path -> /storage/v1/render/image/public/bucket/path
 */
function toRenderUrl(url: string): string {
  return url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );
}

/**
 * Get a transformed image URL with specific width and quality
 */
export function getTransformedUrl(src: string, options: TransformOptions): string {
  if (!src || !isSupabaseStorageUrl(src)) {
    return src; // Not a Supabase URL, return as-is
  }

  // Strip any existing query params from the URL
  const baseUrl = src.split('?')[0];
  const renderUrl = toRenderUrl(baseUrl);

  const params = new URLSearchParams();
  params.set('width', String(options.width));
  params.set('quality', String(options.quality ?? 90));
  if (options.format && options.format !== 'origin') {
    params.set('format', options.format);
  }

  return `${renderUrl}?${params.toString()}`;
}

/**
 * Generate a srcSet string for responsive images
 */
export function getSrcSet(src: string, quality = 90): string {
  if (!src || !isSupabaseStorageUrl(src)) {
    return ''; // Can't generate srcSet for non-Supabase URLs
  }

  return IMAGE_WIDTHS.map(w =>
    `${getTransformedUrl(src, { width: w, quality, format: 'webp' })} ${w}w`
  ).join(', ');
}

/**
 * Default sizes attribute for catalog/product grid images
 */
export const CATALOG_SIZES = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';

/**
 * Sizes for featured/hero product images
 */
export const FEATURED_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
