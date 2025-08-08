# Whisky Image Organization

## Directory Structure
All images are organized within the `/public/whisky/` folder with the following structure:

```
/public/whisky/
├── distilleries/     # All distillery building and facility images
├── casks/           # Whisky cask and warehouse images
├── hero/            # Hero section images
├── regions/         # Regional landscape images
├── blog/            # Blog post images
├── testimonials/    # Customer testimonial images
├── about/           # About page images
├── buy-sell/        # Buy/Sell page images
├── flags/           # Country flag icons
└── how-it-works/    # Process images
```

## Distillery Images (Optimized WebP)
All distillery images have been converted to WebP format with both full-size and thumbnail versions:

### Full-Size Images (for hero sections and galleries)
- `macallan-distillery.webp` (233K)
- `dalmore-exterior.webp` (418K)
- `glenfiddich-estate.webp` (355K)
- `highland-park-building.webp` (308K)
- `lagavulin-facade.webp` (225K)
- `ardbeg-distillery.webp` (309K)
- `bowmore-aerial.webp` (309K)
- `springbank-entrance.webp` (262K)
- `balvenie-grounds.webp` (207K)
- `glenmorangie-view.webp` (36K)

### Thumbnail Images (for cards and previews)
- All images have corresponding `-thumb.webp` versions
- Thumbnails are optimized for 800x800px max
- Quality set to 80% for optimal file size

## Image Guidelines
1. **No Bottle or Glass Images**: Focus on distilleries, casks, and landscapes
2. **WebP Format**: All new images should be converted to WebP for better performance
3. **Responsive Sizes**: Provide both full-size and thumbnail versions
4. **Meaningful Names**: Use descriptive names like `distillery-name-view.webp`
5. **Path Convention**: All images must be within `/whisky/` subdirectories

## Removed Images
The following bottle and glass images have been removed:
- All `shop-bottle-*.webp` files
- `whisky-glass.webp`
- `dalmore-whisky-glass.webp`
- `dalmore-rare-luminary.webp`
- `shop-daftmill-2011.webp`
- `shop-secrets-smoke.webp`

## Usage in Code
All image references in the codebase use the `/whisky/` path:
```javascript
image: '/whisky/distilleries/macallan-distillery.webp'
```

## Optimization Script
Use the optimization script to convert new images:
```bash
/scripts/optimize-distillery-images.sh
```

Last Updated: August 7, 2025