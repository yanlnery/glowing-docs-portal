
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getSrcSet, getTransformedUrl, getXDescriptorSrcSet, CATALOG_SIZES } from '@/utils/supabaseImageUrl';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  useXDescriptors?: boolean;
  baseWidth?: number;
  forcedWidth?: number;
  disableSrcSet?: boolean;
  disableTransform?: boolean;
  disablePlaceholderBlur?: boolean;
  transformFormat?: 'webp' | 'avif' | 'origin';
  debugId?: string;
  onDebug?: (info: {
    renderedWidth: number;
    naturalWidth: number;
    currentSrc: string;
    currentWidthParam: string | null;
  }) => void;
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
  imgClassName,
  useXDescriptors = false,
  baseWidth = 480,
  forcedWidth,
  disableSrcSet = false,
  disableTransform = false,
  disablePlaceholderBlur = false,
  transformFormat = 'webp',
  debugId,
  onDebug,
  onLoad,
  onError,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = useCallback(() => {
    const el = imgElRef.current;
    if (el) {
      const currentSrc = el.currentSrc || el.src;
      const widthMatch = currentSrc.match(/[?&]width=(\d+)/);
      const info = {
        renderedWidth: Math.round(el.getBoundingClientRect().width),
        naturalWidth: el.naturalWidth,
        currentSrc,
        currentWidthParam: widthMatch?.[1] ?? null,
      };

      if (import.meta.env.DEV && debugId) {
        console.info(`[OptimizedImage:${debugId}]`, info);
      }
      onDebug?.(info);
    }

    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [debugId, onDebug, onLoad]);

  // Handle cached images: check img.complete on mount / src change
  useEffect(() => {
    const el = imgElRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      handleLoad();
    }
  }, [src, handleLoad]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
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

  const shouldTransform = !disableTransform;

  const srcSet = isValidSrc && shouldTransform
    ? (useXDescriptors ? getXDescriptorSrcSet(src, baseWidth, quality, transformFormat) : getSrcSet(src, quality, transformFormat))
    : '';

  const transformedSrc = isValidSrc && shouldTransform
    ? getTransformedUrl(src, { width: forcedWidth ?? (useXDescriptors ? baseWidth : 1200), quality, format: transformFormat })
    : src;

  const defaultSrc = isValidSrc ? transformedSrc : src;

  const effectiveSrcSet = disableSrcSet ? undefined : (srcSet || undefined);
  const effectiveSizes = disableSrcSet || useXDescriptors ? undefined : sizes;

  return (
    <div className={cn('relative overflow-hidden w-full h-full', className)} ref={containerRef}>
      {/* Placeholder: covers image until loaded, then removed */}
      {!isLoaded && shouldLoad && !hasError && isValidSrc && (
        <div
          className="absolute inset-0 bg-muted w-full h-full z-10"
          style={disablePlaceholderBlur ? style : { ...style, backdropFilter: 'blur(8px)' }}
        />
      )}

      {shouldLoad && isValidSrc && !hasError && (
        <img
          ref={imgElRef}
          src={defaultSrc}
          srcSet={effectiveSrcSet}
          sizes={effectiveSizes}
          alt={alt}
          className={cn('w-full h-full', imgClassName)}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
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
