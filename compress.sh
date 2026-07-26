#!/bin/bash
TARGET_DIR="/Users/lebachanhtruc/antigravity/Website Bán Hàng/Media"

echo "=== Compressing Images ==="
find "$TARGET_DIR" -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" \) -exec sips -Z 1920 {} +

echo "=== Compressing Videos ==="
find "$TARGET_DIR" -type f \( -iname "*.mp4" -o -iname "*.mov" \) -print0 | while IFS= read -r -d '' file; do
    echo "Processing video: $file"
    temp="${file%.*}_temp.${file##*.}"
    ffmpeg -y -nostdin -i "$file" -vf scale='min(1920,iw)':-2 -crf 28 -preset fast "$temp" < /dev/null
    mv "$temp" "$file"
done

echo "=== Compression Complete ==="
