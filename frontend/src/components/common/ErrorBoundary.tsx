import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-black">
          <div className="max-w-md w-full bg-rich-brown rounded-lg shadow-xl p-8 text-center">
            <h1 className="text-3xl font-serif text-premium-gold mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-text-secondary mb-6">
              We apologize for the inconvenience. Our team has been notified and is working on a fix.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6">
                <summary className="cursor-pointer text-premium-gold hover:text-bright-gold mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="bg-primary-black p-4 rounded text-xs text-text-secondary overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="space-y-4">
              <button
                onClick={this.handleReset}
                className="btn-primary w-full"
              >
                Try Again
              </button>
              <a
                href="/"
                className="btn-secondary w-full inline-block"
              >
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;