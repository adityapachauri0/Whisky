declare module 'react-lazy-load-image-component' {
  import { ReactElement, ImgHTMLAttributes } from 'react';

  export interface LazyLoadImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    effect?: 'blur' | 'black-and-white' | 'opacity';
    placeholder?: ReactElement;
    placeholderSrc?: string;
    threshold?: number;
    delayTime?: number;
    delayMethod?: 'debounce' | 'throttle';
    useIntersectionObserver?: boolean;
    visibleByDefault?: boolean;
    wrapperClassName?: string;
    wrapperProps?: any;
    afterLoad?: () => void;
    beforeLoad?: () => void;
    scrollPosition?: any;
  }

  export const LazyLoadImage: React.FC<LazyLoadImageProps>;
  export const trackWindowScroll: (Component: any) => any;
}