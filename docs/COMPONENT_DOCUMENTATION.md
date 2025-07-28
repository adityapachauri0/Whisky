# Component Documentation

## Overview

This document provides comprehensive documentation for all React components in the ViticultWhisky frontend application. Components are organized by category and include usage examples, props documentation, and implementation details.

## Component Architecture

```
src/components/
├── layout/           # Layout and navigation components
├── sections/         # Page section components
├── calculators/      # Investment calculation tools
├── 3d/              # Three.js 3D components
├── common/          # Reusable utility components
├── charts/          # Data visualization components
├── admin/           # Administrative interface components
├── auth/            # Authentication components
└── forms/           # Form-related components
```

## Layout Components

### Header
**File**: `src/components/layout/Header.tsx`

Main navigation header with responsive design and admin access detection.

#### Props
```typescript
interface HeaderProps {
  // No props - uses internal state and hooks
}
```

#### Features
- Responsive mobile menu
- Admin login detection
- Smooth scrolling navigation
- Contact information display
- Social media links

#### Usage
```tsx
import Header from './components/layout/Header';

function App() {
  return (
    <div>
      <Header />
      {/* Page content */}
    </div>
  );
}
```

### Footer
**File**: `src/components/layout/Footer.tsx`

Site footer with links, contact information, and legal pages.

#### Features
- Company information
- Quick navigation links
- Contact details
- Legal page links
- Copyright information

#### Usage
```tsx
import Footer from './components/layout/Footer';

function Layout({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}
```

### PublicLayout
**File**: `src/components/layout/PublicLayout.tsx`

Main layout wrapper for public pages with header and footer.

#### Features
- Consistent layout structure
- Header and footer integration
- Outlet for child routes
- Responsive design

#### Usage
```tsx
// Used in App.tsx routing
<Route element={<PublicLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Route>
```

## Section Components

### Hero
**File**: `src/components/sections/Hero.tsx`

Main homepage hero section with interactive elements and animations.

#### Props
```typescript
interface HeroProps {
  // No external props - self-contained
}
```

#### Features
- Animated background gradient
- 3D barrel animations
- Investment calculator integration
- Call-to-action buttons
- Responsive design with mobile optimization

#### State Management
```typescript
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
```

#### Usage
```tsx
import Hero from './components/sections/Hero';

function Home() {
  return (
    <div>
      <Hero />
      {/* Other sections */}
    </div>
  );
}
```

### Features
**File**: `src/components/sections/Features.tsx`

Feature showcase section highlighting platform benefits.

#### Features
- Grid layout of feature cards
- Icon integration with Lucide React
- Responsive design
- Animation on scroll (AOS)

#### Usage
```tsx
import Features from './components/sections/Features';

function Home() {
  return (
    <div>
      <Features />
    </div>
  );
}
```

### Testimonials
**File**: `src/components/sections/Testimonials.tsx`

Customer testimonials carousel with ratings and feedback.

#### Features
- Testimonial card layout
- Customer photos and ratings
- Responsive grid system
- Trust indicators

#### Data Structure
```typescript
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}
```

## Calculator Components

### ROICalculator
**File**: `src/components/calculators/ROICalculator.tsx`

Interactive return on investment calculator for whisky investments.

#### Props
```typescript
interface ROICalculatorProps {
  className?: string;
  showDetailed?: boolean;
  initialInvestment?: number;
}
```

#### Features
- Real-time calculation updates
- Slider controls for inputs
- Chart visualization integration
- Angel's share calculation
- Storage cost estimation
- Tax consideration

#### State Management
```typescript
interface CalculatorState {
  investment: number;
  years: number;
  expectedReturn: number;
  storageCost: number;
  insurance: number;
  angelsShare: number;
}
```

#### Usage
```tsx
import ROICalculator from './components/calculators/ROICalculator';

function InvestmentPage() {
  return (
    <div>
      <ROICalculator 
        initialInvestment={50000}
        showDetailed={true}
        className="my-8"
      />
    </div>
  );
}
```

#### Calculation Logic
```typescript
const calculateROI = useCallback(() => {
  const totalStorage = storageCost * years;
  const totalInsurance = insurance * years;
  const evaporationLoss = Math.pow(1 - angelsShare / 100, years);
  const grossReturn = investment * Math.pow(1 + expectedReturn / 100, years);
  const netReturn = (grossReturn * evaporationLoss) - totalStorage - totalInsurance;
  const profit = netReturn - investment;
  const roiPercentage = (profit / investment) * 100;
  
  return {
    finalValue: netReturn,
    totalProfit: profit,
    roiPercentage,
    totalCosts: totalStorage + totalInsurance,
    evaporationLoss: investment * (1 - evaporationLoss)
  };
}, [investment, years, expectedReturn, storageCost, insurance, angelsShare]);
```

## 3D Components

### WhiskyBarrelAnimation
**File**: `src/components/3d/WhiskyBarrelAnimation.tsx`

Three.js animated whisky barrel for hero section.

#### Props
```typescript
interface WhiskyBarrelAnimationProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  autoRotate?: boolean;
}
```

#### Features
- Realistic barrel 3D model
- Wood texture application
- Auto-rotation animation
- Memory leak prevention
- Performance optimization

#### Memory Management
```typescript
React.useEffect(() => {
  return () => {
    // Cleanup textures on unmount
    if (woodTexture) {
      woodTexture.dispose();
    }
    if (geometryRef.current) {
      geometryRef.current.dispose();
    }
    if (materialRef.current) {
      materialRef.current.dispose();
    }
  };
}, [woodTexture]);
```

#### Usage
```tsx
import { Canvas } from '@react-three/fiber';
import WhiskyBarrelAnimation from './components/3d/WhiskyBarrelAnimation';

function Hero() {
  return (
    <Canvas>
      <WhiskyBarrelAnimation 
        position={[0, 0, 0]}
        autoRotate={true}
        scale={1.2}
      />
    </Canvas>
  );
}
```

### WhiskyPourAnimation
**File**: `src/components/3d/WhiskyPourAnimation.tsx`

Animated whisky pouring effect for visual appeal.

#### Features
- Particle system for liquid effect
- Physics-based animation
- Customizable pour speed
- Glass interaction

## Common Components

### ErrorBoundary
**File**: `src/components/common/ErrorBoundary.tsx`

React error boundary for graceful error handling.

#### Props
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}
```

#### Features
- Catches JavaScript errors in component tree
- Displays fallback UI
- Logs errors for debugging
- Prevents application crashes

#### Usage
```tsx
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* Application components */}
      </Router>
    </ErrorBoundary>
  );
}
```

#### Error State Management
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

static getDerivedStateFromError(error: Error): ErrorBoundaryState {
  return {
    hasError: true,
    error
  };
}
```

### OptimizedImage
**File**: `src/components/common/OptimizedImage.tsx`

Optimized image component with lazy loading and WebP support.

#### Props
```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  webpSrc?: string;
  placeholder?: string;
}
```

#### Features
- WebP format with fallback
- Lazy loading with Intersection Observer
- Responsive image sizing
- Placeholder support
- Loading states

#### Usage
```tsx
import OptimizedImage from './components/common/OptimizedImage';

function Gallery() {
  return (
    <OptimizedImage
      src="/images/whisky-bottle.jpg"
      webpSrc="/images/whisky-bottle.webp"
      alt="Premium whisky bottle"
      className="w-full h-64 object-cover"
      lazy={true}
    />
  );
}
```

### FloatingPounds
**File**: `src/components/common/FloatingPounds.tsx`

Animated floating pound symbols for visual enhancement.

#### Props
```typescript
interface FloatingPoundsProps {
  count?: number;
  color?: 'gold' | 'white' | 'green';
  size?: 'small' | 'medium' | 'large';
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}
```

#### Features
- CSS animation-based floating effect
- Customizable appearance
- Performance optimized
- Responsive design

#### Usage
```tsx
import FloatingPounds from './components/common/FloatingPounds';

function HeroSection() {
  return (
    <div className="relative">
      <FloatingPounds 
        count={8}
        color="gold"
        size="medium"
        speed="slow"
      />
      {/* Hero content */}
    </div>
  );
}
```

## Chart Components

### AngelsShareChart
**File**: `src/components/charts/AngelsShareChart.tsx`

Chart showing whisky evaporation over time (Angel's Share).

#### Props
```typescript
interface AngelsShareChartProps {
  years: number;
  initialVolume: number;
  annualEvaporation: number;
  className?: string;
}
```

#### Features
- Line chart visualization
- Chart.js integration
- Responsive design
- Interactive tooltips

#### Usage
```tsx
import AngelsShareChart from './components/charts/AngelsShareChart';

function InvestmentDetails() {
  return (
    <AngelsShareChart
      years={25}
      initialVolume={200}
      annualEvaporation={2}
      className="my-8"
    />
  );
}
```

### CostBreakdownChart
**File**: `src/components/charts/CostBreakdownChart.tsx`

Pie chart showing investment cost breakdown.

#### Features
- Doughnut chart visualization
- Cost category breakdown
- Interactive segments
- Responsive legend

### InvestmentTimeline
**File**: `src/components/charts/InvestmentTimeline.tsx`

Timeline chart showing investment growth projection.

#### Features
- Line chart with multiple datasets
- Growth projection visualization
- Risk scenario modeling
- Interactive data points

## Admin Components

### SiteConfigManager
**File**: `src/components/admin/SiteConfigManager.tsx`

Administrative interface for site configuration management.

#### Props
```typescript
interface SiteConfigManagerProps {
  onConfigUpdate?: (config: SiteConfig) => void;
}
```

#### Features
- Form-based configuration editing
- Real-time preview
- Validation and error handling
- Save and reset functionality

#### Configuration Types
```typescript
interface SiteConfig {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  analytics: {
    googleAnalyticsId?: string;
    gtmId?: string;
  };
}
```

## Auth Components

### ProtectedRoute
**File**: `src/components/auth/ProtectedRoute.tsx`

Route protection component for admin areas.

#### Features
- JWT token validation
- Automatic redirect to login
- Role-based access control
- Loading state management

#### Usage
```tsx
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
```

## Form Components

### ContactForm
**File**: `src/pages/Contact.tsx` (component within page)

Contact form with validation and submission handling.

#### Features
- React Hook Form integration
- Real-time validation
- Error state management
- Success modal
- Rate limiting handling

#### Validation Schema
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  preferredContactMethod: 'email' | 'phone' | 'both';
  investmentAmount?: string;
  timeframe?: string;
}
```

#### Form Validation
```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset
} = useForm<ContactFormData>({
  resolver: yupResolver(contactSchema)
});
```

### SellWhiskyForm
**File**: `src/pages/SellWhisky.tsx` (component within page)

Multi-step form for whisky selling submissions.

#### Features
- Multi-step form wizard
- File upload capability
- Progress indication
- Field validation
- Draft saving

## Component Styling

### Tailwind CSS Classes

#### Common Patterns
```css
/* Card components */
.card-base {
  @apply bg-white rounded-lg shadow-lg p-6;
}

/* Button variants */
.btn-primary {
  @apply bg-premium-gold text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-premium-gold/90 transition-colors;
}

.btn-secondary {
  @apply bg-transparent border-2 border-premium-gold text-premium-gold px-6 py-3 rounded-lg font-semibold hover:bg-premium-gold hover:text-primary-dark transition-all;
}

/* Form inputs */
.input-base {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent;
}
```

#### Responsive Design
```css
/* Mobile-first responsive design */
.responsive-container {
  @apply px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16;
}

.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

### CSS Custom Properties
```css
:root {
  --color-premium-gold: #D4AF37;
  --color-primary-dark: #1F2937;
  --color-accent-copper: #B87333;
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Performance Considerations

### Code Splitting
```typescript
// Lazy loading for heavy components
const ROICalculator = React.lazy(() => import('./calculators/ROICalculator'));
const WhiskyBarrelAnimation = React.lazy(() => import('./3d/WhiskyBarrelAnimation'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ROICalculator />
</Suspense>
```

### Memory Management
```typescript
// Cleanup in useEffect
useEffect(() => {
  const interval = setInterval(() => {
    // Animation logic
  }, 16);

  return () => {
    clearInterval(interval);
  };
}, []);
```

### Optimization Patterns
```typescript
// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(props.data);
}, [props.data]);

// Callback memoization
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

## Testing

### Component Testing Examples

#### Unit Test Example
```typescript
// __tests__/ROICalculator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ROICalculator from '../ROICalculator';

describe('ROICalculator', () => {
  test('renders calculator with default values', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/investment amount/i)).toBeInTheDocument();
    expect(screen.getByText(/investment period/i)).toBeInTheDocument();
  });

  test('updates calculation when inputs change', () => {
    render(<ROICalculator />);
    
    const investmentSlider = screen.getByRole('slider', { name: /investment/i });
    fireEvent.change(investmentSlider, { target: { value: '100000' } });
    
    // Assert calculation updates
    expect(screen.getByText(/£100,000/)).toBeInTheDocument();
  });
});
```

#### Integration Test Example
```typescript
// __tests__/ContactForm.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactForm from '../ContactForm';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ContactForm Integration', () => {
  test('submits form successfully', async () => {
    renderWithRouter(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

## Accessibility

### ARIA Labels and Roles
```tsx
// Proper accessibility attributes
<button
  aria-label="Calculate ROI"
  aria-describedby="roi-description"
  role="button"
  tabIndex={0}
>
  Calculate
</button>

<div id="roi-description">
  Click to calculate return on investment
</div>
```

### Keyboard Navigation
```typescript
// Keyboard event handling
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};
```

### Focus Management
```typescript
// Focus management for modals
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector('button, input, select, textarea');
    firstFocusable?.focus();
  }
}, [isOpen]);
```

---

*Component Documentation Version: 1.0.0*
*Last Updated: January 2025*
*For component updates and contributions, contact: dev-team@viticultwhisky.co.uk*