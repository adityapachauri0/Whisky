#!/bin/bash

# Compress large images in the whisky directory
SOURCE_DIR="/Users/adityapachauri/Desktop/Whisky/frontend/public/whisky"

echo "🎯 Starting image compression..."
echo "================================"

# Find and compress images larger than 1MB
find "$SOURCE_DIR" -name "*.webp" -size +1M | while read file; do
    filesize=$(ls -lh "$file" | awk '{print $5}')
    filename=$(basename "$file")
    dirname=$(dirname "$file")
    
    echo "📦 Compressing: $filename ($filesize)"
    
    # Create backup first
    cp "$file" "${file}.backup"
    
    # Compress with ImageMagick
    # Quality 75 for images over 5MB, 80 for others
    if [ $(stat -f%z "$file") -gt 5242880 ]; then
        magick "$file" -quality 75 -resize 1920x1920\> -strip "$file.tmp"
    else
        magick "$file" -quality 80 -resize 1920x1920\> -strip "$file.tmp"
    fi
    
    # Check if compression was successful
    if [ -f "$file.tmp" ]; then
        mv "$file.tmp" "$file"
        newsize=$(ls -lh "$file" | awk '{print $5}')
        echo "✅ Compressed to: $newsize"
    else
        echo "❌ Failed to compress $filename"
        mv "${file}.backup" "$file"
    fi
    
    # Remove backup if successful
    rm -f "${file}.backup"
    echo ""
done

echo "✅ Compression complete!"
echo ""
echo "📊 Final image sizes:"
find "$SOURCE_DIR" -name "*.webp" -size +500k -exec ls -lh {} \; | awk '{print $9 " - " $5}' | sort -t'-' -k2 -h -r | head -20