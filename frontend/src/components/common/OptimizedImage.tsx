import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  placeholderSrc?: string;
  effect?: 'blur' | 'opacity';
  threshold?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderSrc,
  effect = 'blur',
  threshold = 100,
  onLoad,
  onError,
}) => {
  // Generate placeholder if not provided
  const placeholder = placeholderSrc || `data:image/svg+xml,%3Csvg width='${width || 400}' height='${height || 300}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23333'/%3E%3C/svg%3E`;

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      placeholderSrc={placeholder}
      effect={effect}
      threshold={threshold}
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
    />
  );
};

export default OptimizedImage;