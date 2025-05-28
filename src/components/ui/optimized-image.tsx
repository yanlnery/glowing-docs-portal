
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
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(priority);

  // Função para gerar URLs otimizadas
  const getOptimizedSrc = (originalSrc: string, format: 'webp' | 'avif' | 'original' = 'original') => {
    if (!originalSrc || originalSrc === '/placeholder.svg') return originalSrc;
    
    // Se já é uma URL completa externa, retorna como está
    if (originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // Para imagens locais, tenta diferentes formatos
    if (format === 'webp' && originalSrc.includes('.')) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    if (format === 'avif' && originalSrc.includes('.')) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    }
    
    return originalSrc;
  };

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority) return;

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

  // Carrega a imagem quando está em view
  useEffect(() => {
    if (!isInView) return;

    const loadImage = async () => {
      const formats = ['avif', 'webp', 'original'] as const;
      
      for (const format of formats) {
        try {
          const testSrc = getOptimizedSrc(src, format);
          
          // Testa se a imagem carrega
          await new Promise<void>((resolve, reject) => {
            const testImg = new Image();
            testImg.onload = () => resolve();
            testImg.onerror = () => reject();
            testImg.src = testSrc;
          });
          
          setCurrentSrc(testSrc);
          return;
        } catch {
          // Continua para o próximo formato
          continue;
        }
      }
      
      // Se nenhum formato funcionar, usa o original
      setCurrentSrc(src);
    };

    loadImage();
  }, [isInView, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    // Fallback para imagem original se houver erro
    if (currentSrc !== src) {
      setCurrentSrc(src);
      setHasError(false);
    } else {
      onError?.(e);
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder blur enquanto carrega */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={isInView ? currentSrc : ''}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'opacity-50'
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        {...props}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-sm text-gray-500">Erro ao carregar imagem</span>
        </div>
      )}
    </div>
  );
}
