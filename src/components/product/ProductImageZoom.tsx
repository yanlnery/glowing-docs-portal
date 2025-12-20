import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageZoomProps {
  images: { id?: string; url: string; alt?: string }[];
  productName: string;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

export function ProductImageZoom({ 
  images, 
  productName, 
  selectedIndex, 
  onIndexChange 
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const selectedImage = images[selectedIndex]?.url;

  // Reset zoom when image changes
  useEffect(() => {
    setIsZoomed(false);
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
  }, [selectedIndex]);

  const toggleZoom = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isZoomed) {
      setIsZoomed(false);
      setZoomScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
      setZoomScale(2);
      
      // Center zoom on click position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        setPosition({
          x: (centerX - clickX) * 0.5,
          y: (centerY - clickY) * 0.5
        });
      }
    }
  }, [isZoomed]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [isZoomed, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, isZoomed, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for pinch-zoom
  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      e.preventDefault();
      setInitialDistance(getDistance(e.touches));
    } else if (e.touches.length === 1 && isZoomed) {
      // Pan start
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  }, [isZoomed, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      // Pinch zoom
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialDistance;
      const newZoom = Math.min(Math.max(zoomScale * scale, 1), 4);
      
      if (newZoom <= 1) {
        setIsZoomed(false);
        setZoomScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setIsZoomed(true);
        setZoomScale(newZoom);
      }
      
      setInitialDistance(currentDistance);
    } else if (e.touches.length === 1 && isDragging && isZoomed) {
      // Pan
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  }, [initialDistance, zoomScale, isDragging, isZoomed, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setInitialDistance(null);
    setIsDragging(false);
  }, []);

  // Double-tap to zoom
  const lastTapRef = useRef<number>(0);
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      e.preventDefault();
      if (isZoomed) {
        setIsZoomed(false);
        setZoomScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setIsZoomed(true);
        setZoomScale(2);
        
        if (containerRef.current && e.touches.length > 0) {
          const rect = containerRef.current.getBoundingClientRect();
          const touchX = e.touches[0].clientX - rect.left;
          const touchY = e.touches[0].clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          setPosition({
            x: (centerX - touchX) * 0.5,
            y: (centerY - touchY) * 0.5
          });
        }
      }
    }
    lastTapRef.current = now;
  }, [isZoomed]);

  const navigateImage = (direction: 'prev' | 'next') => {
    const totalImages = images.length;
    let newIndex = selectedIndex;
    
    if (direction === 'prev') {
      newIndex = selectedIndex === 0 ? totalImages - 1 : selectedIndex - 1;
    } else {
      newIndex = selectedIndex === totalImages - 1 ? 0 : selectedIndex + 1;
    }
    
    onIndexChange(newIndex);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className={`aspect-square bg-muted rounded-lg overflow-hidden relative group select-none ${
          isZoomed ? (isDragging ? 'cursor-grabbing' : 'cursor-pointer') : 'cursor-zoom-in'
        }`}
        onClick={toggleZoom}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          handleDoubleTap(e);
          handleTouchStart(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {selectedImage ? (
          <>
            <img 
              ref={imageRef}
              src={selectedImage} 
              alt={productName} 
              className="w-full h-full object-contain transition-transform duration-200 pointer-events-none"
              style={{ 
                transform: `scale(${zoomScale}) translate(${position.x / zoomScale}px, ${position.y / zoomScale}px)`,
                transformOrigin: 'center center'
              }}
              loading="eager"
              draggable={false}
            />
            
            {/* Zoom Indicator Overlay */}
            {!isZoomed && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm rounded-full p-3">
                  <ZoomIn className="h-6 w-6 text-foreground" />
                </div>
              </div>
            )}

            {/* Navigation Arrows (when multiple images and not zoomed) */}
            {images.length > 1 && !isZoomed && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Zoom Status Bar */}
            <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 transition-opacity duration-200 ${
              isZoomed ? 'bg-foreground/90 text-background opacity-100' : 'bg-background/80 text-foreground opacity-0 group-hover:opacity-100'
            }`}>
              {isZoomed ? (
                <>
                  <ZoomOut className="h-3.5 w-3.5" />
                  <span>Arraste para mover • Clique para reduzir</span>
                </>
              ) : (
                <>
                  <ZoomIn className="h-3.5 w-3.5" />
                  <span>Clique para ampliar</span>
                </>
              )}
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-background/80 text-foreground text-xs">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">Imagem não disponível</span>
          </div>
        )}
      </div>
      
      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div 
              key={image.id || index} 
              className={`aspect-square bg-muted rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${
                selectedIndex === index ? 'border-serpente-500 ring-2 ring-serpente-500/20' : 'border-transparent hover:border-serpente-300'
              }`}
              onClick={() => onIndexChange(index)}
            >
              <img 
                src={image.url}
                alt={image.alt || `${productName} - imagem ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
