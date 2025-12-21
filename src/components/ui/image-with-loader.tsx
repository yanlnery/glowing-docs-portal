import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
  priority?: boolean;
}

export function ImageWithLoader({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  ...props
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Blur placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted"
          style={{ backdropFilter: 'blur(8px)' }}
        />
      )}
      
      {/* Actual image */}
      <img
        src={hasError ? "/placeholder.svg" : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}
