#!/bin/bash

# Source and destination directories
SOURCE_DIR="/Users/adityapachauri/Downloads/Distelleries"
DEST_DIR="/Users/adityapachauri/Desktop/Whisky/frontend/public/whisky/distilleries"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Array of meaningful names for the distillery images
declare -a names=(
  "macallan-distillery"
  "dalmore-exterior"
  "glenfiddich-estate"
  "highland-park-building"
  "lagavulin-facade"
  "ardbeg-distillery"
  "bowmore-aerial"
  "springbank-entrance"
  "balvenie-grounds"
  "glenmorangie-view"
)

# Convert each image
counter=0
for file in "$SOURCE_DIR"/*.{jpg,png}; do
  if [ -f "$file" ]; then
    # Get the new name from array or use generic name
    if [ $counter -lt ${#names[@]} ]; then
      new_name="${names[$counter]}"
    else
      new_name="distillery-$(($counter + 1))"
    fi
    
    # Get file extension
    filename=$(basename "$file")
    
    echo "Converting $filename to ${new_name}.webp..."
    
    # Convert to WebP with optimization
    # -quality 85: Good quality/size balance
    # -resize 1920x1920>: Resize only if larger than 1920px (maintains aspect ratio)
    # -strip: Remove metadata
    convert "$file" -quality 85 -resize 1920x1920\> -strip "$DEST_DIR/${new_name}.webp"
    
    # Also create a smaller thumbnail version
    convert "$file" -quality 80 -resize 800x800\> -strip "$DEST_DIR/${new_name}-thumb.webp"
    
    echo "✓ Created ${new_name}.webp and ${new_name}-thumb.webp"
    
    counter=$((counter + 1))
  fi
done

echo ""
echo "✅ Conversion complete! Converted $counter images."
echo "📁 Output directory: $DEST_DIR"

# List the created files
echo ""
echo "Created files:"
ls -lh "$DEST_DIR"/*.webp 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'