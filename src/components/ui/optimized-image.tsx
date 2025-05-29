
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

  // Para carrossel e produtos em destaque, sempre carrega imediatamente
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
    console.log(`✅ Imagem carregada com sucesso: ${src}`);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Erro ao carregar imagem:', src);
    setHasError(true);
    setIsLoaded(false);
    onError?.(e);
  };

  // Validar se src é uma URL válida ou caminho válido
  const isValidSrc = src && src.trim() !== '' && src !== '/placeholder.svg';
  const shouldLoad = isInView || priority;

  return (
    <div className={cn('relative overflow-hidden w-full h-full', className)} ref={imgRef}>
      {/* Placeholder mínimo para carregamento */}
      {!isLoaded && shouldLoad && !hasError && isValidSrc && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 w-full h-full animate-pulse" 
          style={style}
        />
      )}
      
      {/* Imagem principal - sempre visível quando carregada */}
      {shouldLoad && isValidSrc && !hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full transition-opacity duration-200',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
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
      
      {/* Fallback para erro ou imagem inválida */}
      {(hasError || !isValidSrc) && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 w-full h-full"
          style={style}
        >
          <div className="text-gray-400 dark:text-gray-500 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm">📷</span>
            </div>
            <span className="text-xs sm:text-sm">Sem imagem</span>
          </div>
        </div>
      )}
    </div>
  );
}
