
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getSrcSet, getTransformedUrl, getXDescriptorSrcSet, CATALOG_SIZES } from '@/utils/supabaseImageUrl';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  useXDescriptors?: boolean;
  baseWidth?: number;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  quality = 90,
  sizes = CATALOG_SIZES,
  className,
  useXDescriptors = false,
  baseWidth = 480,
  onLoad,
  onError,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    // If transformed URL fails, fallback to original src (no query params)
    const originalSrc = src?.split('?')[0] || src;
    if (target.src !== originalSrc && src) {
      target.srcset = '';
      target.src = originalSrc;
      return;
    }
    setHasError(true);
    setIsLoaded(false);
    onError?.(e);
  };

  const isValidSrc = src && src.trim() !== '' && src !== '/placeholder.svg';
  const shouldLoad = isInView || priority;

  const srcSet = isValidSrc
    ? (useXDescriptors ? getXDescriptorSrcSet(src, baseWidth, quality) : getSrcSet(src, quality))
    : '';
  const defaultSrc = isValidSrc && srcSet
    ? getTransformedUrl(src, { width: useXDescriptors ? baseWidth : 1200, quality, format: 'webp' })
    : src;

  // When using x-descriptors, sizes is not needed
  const effectiveSizes = useXDescriptors ? undefined : sizes;

  return (
    <div className={cn('relative overflow-hidden w-full h-full', className)} ref={imgRef}>
      {!isLoaded && shouldLoad && !hasError && isValidSrc && (
        <div
          className="absolute inset-0 bg-muted w-full h-full"
          style={{ ...style, backdropFilter: 'blur(8px)' }}
        />
      )}

      {shouldLoad && isValidSrc && !hasError && (
        <img
          src={defaultSrc}
          srcSet={srcSet || undefined}
          sizes={effectiveSizes}
          alt={alt}
          className={cn('w-full h-full', isLoaded ? 'opacity-100' : 'opacity-0')}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            transition: 'opacity 0.2s ease-out',
            imageRendering: 'auto',
            ...style,
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {(hasError || !isValidSrc) && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-muted w-full h-full"
          style={style}
        >
          <div className="text-muted-foreground text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 bg-muted-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm">📷</span>
            </div>
            <span className="text-xs sm:text-sm">Sem imagem</span>
          </div>
        </div>
      )}
    </div>
  );
}
