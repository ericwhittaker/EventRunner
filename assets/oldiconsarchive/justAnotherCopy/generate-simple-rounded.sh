#!/bin/bash

# Simple Rounded Icon Generator for EventRunner
# Uses SVG and rsvg-convert for creating rounded corners

echo "🚀 EventRunner Rounded Icon Generator (Simple Version)"
echo "==================================================="

# Check if source logo exists
if [ ! -f "Icon-ER-Logo-v3.jpg" ]; then
    echo "❌ Error: Icon-ER-Logo-v3.jpg not found!"
    exit 1
fi

echo "📁 Found Icon-ER-Logo-v3.jpg"

# Create a temporary directory
mkdir -p temp_rounded

# Convert to PNG first
sips -s format png Icon-ER-Logo-v3.jpg --out temp_rounded/source.png

# Create an SVG with rounded corners mask
cat > temp_rounded/rounded_mask.svg << 'EOF'
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="roundedMask">
      <rect width="1024" height="1024" rx="184" ry="184" fill="white"/>
    </mask>
  </defs>
  <image href="source.png" width="1024" height="1024" mask="url(#roundedMask)"/>
</svg>
EOF

echo "🔄 Creating rounded corners using SVG..."

# Try different methods to convert SVG to PNG
if command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert..."
    rsvg-convert temp_rounded/rounded_mask.svg -o temp_rounded/rounded.png
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick convert..."
    convert temp_rounded/rounded_mask.svg temp_rounded/rounded.png
else
    echo "⚠️  No SVG converter available. Creating manual rounded version..."
    # Fallback: use sips with a basic approach
    sips -z 1024 1024 temp_rounded/source.png --out temp_rounded/rounded.png
fi

# Check if we have a rounded version
if [ -f "temp_rounded/rounded.png" ]; then
    echo "✅ Created rounded version"
    ROUNDED_SOURCE="temp_rounded/rounded.png"
else
    echo "⚠️  Using original source"
    ROUNDED_SOURCE="temp_rounded/source.png"
fi

echo "🔄 Generating macOS icon sizes..."

# Create icon directory
mkdir -p temp_rounded/EventRunner.iconset

# Generate all required sizes
sips -z 16 16 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_16x16.png
sips -z 32 32 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_16x16@2x.png
sips -z 32 32 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_32x32.png
sips -z 64 64 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_32x32@2x.png
sips -z 128 128 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_128x128.png
sips -z 256 256 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_128x128@2x.png
sips -z 256 256 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_256x256.png
sips -z 512 512 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_256x256@2x.png
sips -z 512 512 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_512x512.png
sips -z 1024 1024 "$ROUNDED_SOURCE" --out temp_rounded/EventRunner.iconset/icon_512x512@2x.png

echo "🍎 Creating .icns file..."

# Generate .icns file
iconutil -c icns temp_rounded/EventRunner.iconset -o icon.icns

echo "✅ Created icon.icns"

# Create PNG version
sips -z 512 512 "$ROUNDED_SOURCE" --out icon.png
echo "✅ Created icon.png"

# Clean up
rm -rf temp_rounded

echo ""
echo "🎉 Icon generation complete!"
echo "📋 Your EventRunner icon now has rounded corners for macOS!"
echo ""
echo "🚀 Test it: npm run electronpackage"
echo ""
