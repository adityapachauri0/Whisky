# Whisky Website - Hero Section Configuration & Settings

## Overview
This document contains all the configuration details and implementation settings for the Whisky website hero section, including the image carousel setup, sequential loading implementation, and all modifications made during the development session.

## Hero Section Images Configuration

### Current Image Order (as of latest update)
```javascript
const heroImages = [
  '/images/hero/resized_winery_Viticult-7513835 (1).jpg', // Main hero image - winery landscape
  '/images/hero/viticult_whisky_cask_investment43.jpg', // Viticult whisky cask collection (1.3MB)
  '/images/hero/viticult_whisky_cask_investment46.jpg', // Premium whisky cask investment (34.5MB - large file)
  '/images/hero/whiskey-2382370.jpg', // Premium whiskey (from upscaled folder)
  '/images/hero/dalmore-21-lifestyle.jpg', // Dalmore 21 year old premium (789KB)
  '/images/hero/dalmore-18-lifestyle.jpg', // Dalmore 18 year old lifestyle shot (460KB)
];
```

### Image Details
1. **resized_winery_Viticult-7513835 (1).jpg** - Main winery landscape shot
2. **viticult_whisky_cask_investment43.jpg** - Cask collection (1.3MB)
3. **viticult_whisky_cask_investment46.jpg** - Premium cask investment shot (34.5MB - required special handling)
4. **whiskey-2382370.jpg** - Premium whiskey bottle shot (moved from upscaled folder)
5. **dalmore-21-lifestyle.jpg** - Dalmore 21 year premium bottle (789KB)
6. **dalmore-18-lifestyle.jpg** - Dalmore 18 year lifestyle shot (460KB)

### Key Implementation: Sequential Image Loading

To handle the large 34.5MB image without compression, implemented sequential preloading:

```javascript
// Sequential preloading for large images
React.useEffect(() => {
  const preloadImage = (index: number) => {
    if (index >= heroImages.length) return;
    
    const img = new Image();
    img.onload = () => {
      setLoadedImages(prev => {
        const newSet = new Set(prev);
        newSet.add(index);
        return newSet;
      });
      // Preload next image after current one loads
      preloadImage(index + 1);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${heroImages[index]}`);
      // Continue with next image even if one fails
      preloadImage(index + 1);
    };
    img.src = heroImages[index];
  };
  
  // Start preloading from first image
  preloadImage(0);
}, []);
```

### Carousel Settings
- **Transition Duration**: 5 seconds per image
- **Transition Effect**: Smooth opacity fade (3 second duration)
- **Loading Strategy**: Sequential loading to prevent browser memory issues
- **Fallback**: Skip to next loaded image if current isn't ready

## TypeScript Configuration Fixes

### Module Resolution Fix
Created barrel export file at `/src/components/sections/index.ts`:
```typescript
export { default as AngelsShareVisualization } from './AngelsShareVisualization';
export { default as InvestmentCalculator } from './InvestmentCalculator';
export { default as MarketGrowthChart } from './MarketGrowthChart';
export { default as InvestmentProcessSteps } from './InvestmentProcessSteps';
export { default as RiskConsiderations } from './RiskConsiderations';
```

### TypeScript Set Iteration Fix
Fixed TS2802 error by using explicit Set manipulation:
```typescript
setLoadedImages(prev => {
  const newSet = new Set(prev);
  newSet.add(index);
  return newSet;
});
```

## Color Themes Implemented

### Website Current Color System
- **Primary Black**: `#0F1419` - Deep black for backgrounds
- **Premium Gold**: `#D4A574` - Luxury gold accents
- **Text Primary**: `#FFFEF7` - Off-white for main text
- **Text Secondary**: `#A8A29E` - Muted gray for secondary text
- **Eco Green**: `#22C55E` - Sustainability indicators

### FAQ Page - Ultra-Premium Mahogany Theme
Implemented on FAQ page with following color palette:
- **Base Mahogany**: `#3E1A0F` - Deep mahogany base
- **Mid Mahogany**: `#5D2818` - Rich mid-tone
- **Light Mahogany**: `#7C3A28` - Lighter accent
- **Gold Accents**: `#E3C878`, `#D4A76A`, `#C8963E` - Premium gold gradient
- **Light Background**: `#F8F4E6`, `#F3E5AB` - Cream/ivory tones

## Image Hosting Configuration

### Directory Structure
All images consolidated in: `/public/images/hero/`
- Previously scattered between `/upscaled/` and `/images/hero/`
- Now unified for VPS deployment consistency

### VPS Deployment Considerations
1. All images served from single location
2. No external image dependencies
3. Relative paths used for portability
4. Large file (34.5MB) handled with sequential loading

## Performance Optimizations

### Large Image Handling (34.5MB file)
1. **Sequential Loading**: Images load one after another
2. **Memory Management**: Only loaded images kept in memory
3. **Graceful Degradation**: Skip unloaded images in rotation
4. **No Compression**: Original quality maintained

### Loading States
- Initial skeleton loader with gradient animation
- Per-image loading tracking
- Smooth transitions only after image ready

## Testing Configuration

### Playwright Testing Commands
```javascript
// Navigate to homepage
await page.goto('http://localhost:5173');

// Wait for hero section
await page.waitForSelector('.hero-image-wrapper');

// Check image loading
const images = await page.$$eval('.hero-image-wrapper img', imgs => 
  imgs.map(img => ({ src: img.src, loaded: img.complete }))
);

// Test FAQ page interactions
await page.goto('http://localhost:5173/faq');
await page.click('button:has-text("Investment Process")');
await page.click('h3:has-text("What is the minimum investment")');
```

## Important Notes

### User Preferences
1. **Always test with Playwright** before delivering features
2. **No file compression** - maintain original quality
3. **Check TypeScript errors** before completion
4. **Use single image location** for VPS deployment

### Common Issues & Solutions
1. **TS2307 Module Error**: Use barrel exports (index.ts)
2. **TS2802 Set Iteration**: Use explicit Set methods
3. **Large Image Loading**: Implement sequential loading
4. **Memory Issues**: Track loaded state per image

## Session Commands Used

### Build & Type Checking
```bash
npm run build
npm run typecheck
```

### Git Operations
```bash
git status
git add .
git commit -m "Fix hero image loading and implement sequential preloading"
```

### File Operations
- Moved images from `/upscaled/` to `/images/hero/`
- Created TypeScript barrel export
- Updated Hero.tsx component

---

**Last Updated**: Session completed with all hero images loading successfully, including 34.5MB file without compression.