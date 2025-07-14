#!/bin/bash

# EventRunner Icon Generator with Rounded Corners
# This script creates macOS-style rounded corner icons from your source logo

echo "🚀 EventRunner Rounded Icon Generator"
echo "====================================="

# Check if source logo exists
if [ ! -f "Icon-ER-Logo-v3.jpg" ]; then
    echo "❌ Error: Icon-ER-Logo-v3.jpg not found!"
    echo "Please make sure your EventRunner logo JPEG is in this folder."
    exit 1
fi

echo "📁 Found Icon-ER-Logo-v3.jpg (1024x1024)"

# Create temporary directory for icon generation
mkdir -p temp_icons

echo "🔄 Creating rounded corner version..."

# First, convert JPEG to PNG for transparency support
sips -s format png Icon-ER-Logo-v3.jpg --out temp_icons/source.png

# Use Python to create rounded corners (if available)
python3 -c "
from PIL import Image, ImageDraw
import sys
import os

try:
    # Open the source image
    img = Image.open('temp_icons/source.png')
    
    # Ensure it's square and RGBA
    size = max(img.size)
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img = img.convert('RGBA')
    
    # Create a mask for rounded corners
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    
    # Calculate corner radius (about 18% of size for modern macOS look)
    corner_radius = int(size * 0.18)
    
    # Draw rounded rectangle mask
    draw.rounded_rectangle([(0, 0), (size-1, size-1)], radius=corner_radius, fill=255)
    
    # Apply the mask
    img.putalpha(mask)
    
    # Save the rounded version
    img.save('temp_icons/rounded_source.png')
    print('✅ Created rounded corner version')
    
except ImportError:
    print('⚠️  PIL not available - using square icon')
    # Copy original if PIL not available
    import shutil
    shutil.copy('temp_icons/source.png', 'temp_icons/rounded_source.png')
except Exception as e:
    print(f'⚠️  Error creating rounded corners: {e}')
    import shutil
    shutil.copy('temp_icons/source.png', 'temp_icons/rounded_source.png')
"

echo "🔄 Generating icon sizes..."

# Generate PNG sizes for iconset (macOS) from rounded source
sips -z 16 16 temp_icons/rounded_source.png --out temp_icons/icon_16x16.png
sips -z 32 32 temp_icons/rounded_source.png --out temp_icons/icon_16x16@2x.png
sips -z 32 32 temp_icons/rounded_source.png --out temp_icons/icon_32x32.png
sips -z 64 64 temp_icons/rounded_source.png --out temp_icons/icon_32x32@2x.png
sips -z 128 128 temp_icons/rounded_source.png --out temp_icons/icon_128x128.png
sips -z 256 256 temp_icons/rounded_source.png --out temp_icons/icon_128x128@2x.png
sips -z 256 256 temp_icons/rounded_source.png --out temp_icons/icon_256x256.png
sips -z 512 512 temp_icons/rounded_source.png --out temp_icons/icon_256x256@2x.png
sips -z 512 512 temp_icons/rounded_source.png --out temp_icons/icon_512x512.png
sips -z 1024 1024 temp_icons/rounded_source.png --out temp_icons/icon_512x512@2x.png

echo "🍎 Creating macOS .icns file with rounded corners..."

# Create iconset directory
mkdir -p temp_icons/EventRunner.iconset

# Move files to iconset
mv temp_icons/icon_*.png temp_icons/EventRunner.iconset/

# Generate .icns file
iconutil -c icns temp_icons/EventRunner.iconset -o icon.icns

echo "✅ Created rounded icon.icns"

# Also create a rounded PNG for Linux
echo "🐧 Creating rounded Linux PNG icon..."
cp temp_icons/rounded_source.png icon.png
echo "✅ Created rounded icon.png"

# Keep the original square .ico for Windows (Windows typically uses square icons)
echo "🪟 Windows .ico file kept as square (Windows standard)"

# Clean up temporary files
rm -rf temp_icons

echo ""
echo "🎉 Rounded icon generation complete!"
echo ""
echo "📋 Generated files:"
echo "   ✅ icon.icns (macOS - with rounded corners)"
echo "   ✅ icon.png (Linux - with rounded corners)" 
echo "   ✅ icon.ico (Windows - square, as per Windows standards)"
echo ""
echo "🚀 Next steps:"
echo "   1. Run 'npm run electronpackage' to test your new rounded icons"
echo "   2. Your EventRunner icon will now match other macOS apps in the dock!"
echo ""
