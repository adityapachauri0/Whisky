import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ImageAltGenerator from '../../utils/imageAltGenerator';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  placeholderSrc?: string;
  effect?: 'blur' | 'opacity';
  threshold?: number;
  onLoad?: () => void;
  onError?: () => void;
  enableZoom?: boolean;
  zoomType?: 'default' | 'rotate' | 'subtle' | '3d';
  // Enhanced props for automatic alt text generation
  context?: {
    page?: string;
    section?: string;
    purpose?: 'hero' | 'gallery' | 'blog' | 'product' | 'testimonial' | 'cta' | 'icon' | 'logo';
    distillery?: string;
    caskType?: string;
    year?: string;
    category?: string;
    title?: string;
  };
  generateAlt?: boolean;
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
  enableZoom = true,
  zoomType = 'default',
  context,
  generateAlt = true,
}) => {
  // Generate optimized alt text if not provided or if generateAlt is true
  const optimizedAlt = generateAlt 
    ? ImageAltGenerator.generateAltText(src, context || {}, alt)
    : alt || 'Image';

  // Generate placeholder if not provided
  const placeholder = placeholderSrc || `data:image/svg+xml,%3Csvg width='${width || 400}' height='${height || 300}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23333'/%3E%3C/svg%3E`;

  const zoomClasses = {
    default: 'zoom-on-hover',
    rotate: 'zoom-rotate-on-hover',
    subtle: 'hero-zoom',
    '3d': 'zoom-3d'
  };

  const wrapperClass = enableZoom ? zoomClasses[zoomType] : '';

  if (enableZoom) {
    return (
      <div className={wrapperClass}>
        <LazyLoadImage
          src={src}
          alt={optimizedAlt}
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
      </div>
    );
  }

  return (
    <LazyLoadImage
      src={src}
      alt={optimizedAlt}
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