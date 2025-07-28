import React, { Suspense, ComponentType, ReactElement, Component, ErrorInfo } from 'react';

// Simple error boundary implementation
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  { 
    children: React.ReactNode;
    FallbackComponent: ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { FallbackComponent } = this.props;
      return <FallbackComponent error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactElement;
  errorFallback?: ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  props?: Record<string, any>;
}

// Default loading component
const DefaultLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-premium-gold border-t-transparent"></div>
  </div>
);

// Default error component
const DefaultError: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
    <p className="text-red-500 mb-4">Something went wrong loading this component</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-premium-gold text-primary-black rounded hover:bg-premium-gold/80 transition"
    >
      Try Again
    </button>
  </div>
);

// Lazy component wrapper with error boundary
export const LazyComponent: React.FC<LazyComponentProps> = ({ 
  component, 
  fallback = <DefaultLoader />,
  errorFallback = DefaultError,
  props = {}
}) => {
  const Component = React.lazy(component);
  
  return (
    <ErrorBoundary FallbackComponent={errorFallback}>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Pre-configured lazy components for common heavy imports
export const Lazy3DComponents = {
  WhiskyBarrelAnimation: () => (
    <LazyComponent 
      component={() => import('../3d/WhiskyBarrelAnimation')} 
    />
  ),
  
  WhiskyPourAnimation: () => (
    <LazyComponent 
      component={() => import('../3d/WhiskyPourAnimation')} 
    />
  ),
};

export const LazyChartComponents = {
  ROICalculator: (props: any) => (
    <LazyComponent 
      component={() => import('../calculators/ROICalculator')} 
      props={props}
    />
  ),
  
  AngelsShareChart: (props: any) => (
    <LazyComponent 
      component={() => import('../charts/AngelsShareChart')} 
      props={props}
    />
  ),
  
  InvestmentTimeline: (props: any) => (
    <LazyComponent 
      component={() => import('../charts/InvestmentTimeline')} 
      props={props}
    />
  ),
  
  ReturnsComparisonChart: (props: any) => (
    <LazyComponent 
      component={() => import('../charts/ReturnsComparisonChart')} 
      props={props}
    />
  ),
};

// Intersection Observer hook for lazy loading on scroll
export const useLazyLoad = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isIntersecting };
};

export default LazyComponent;