
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  quality = 75,
  sizes = '100vw',
  className,
  onLoad,
  onError,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer para lazy loading (apenas se não for priority)
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
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
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
    console.error('Erro ao carregar imagem:', src);
    setHasError(true);
    onError?.(e);
  };

  // Para imagens priority ou no carrossel, carrega imediatamente
  const shouldLoad = isInView || priority;

  return (
    <div className={cn('relative overflow-hidden', className)} ref={imgRef}>
      {/* Placeholder enquanto carrega */}
      {!isLoaded && shouldLoad && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" 
          style={style}
        />
      )}
      
      {/* Imagem principal */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            objectFit: 'cover',
            ...style
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          {...props}
        />
      )}
      
      {/* Fallback para erro */}
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          style={style}
        >
          <span className="text-sm text-gray-500">Erro ao carregar imagem</span>
        </div>
      )}
    </div>
  );
}
