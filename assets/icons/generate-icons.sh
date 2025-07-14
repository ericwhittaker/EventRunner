#!/bin/bash

# EventRunner Icon Generation Script
# This script converts your source logo to all required Electron app icon formats

echo "🚀 EventRunner Icon Generator"
echo "==============================="

# Check if source logo exists
if [ ! -f "Icon-ER-Logo-v3.jpg" ]; then
    echo "❌ Error: Icon-ER-Logo-v3.jpg not found!"
    echo "Please make sure your EventRunner logo JPEG is in this folder."
    exit 1
fi

echo "📁 Found Icon-ER-Logo-v3.jpg (1024x1024)"

# Create temporary directory for icon generation
mkdir -p temp_icons

echo "🔄 Generating icon sizes..."

# Generate PNG sizes for iconset (macOS) from JPEG source
sips -z 16 16 Icon-ER-Logo-v3.jpg --out temp_icons/icon_16x16.png
sips -z 32 32 Icon-ER-Logo-v3.jpg --out temp_icons/icon_16x16@2x.png
sips -z 32 32 Icon-ER-Logo-v3.jpg --out temp_icons/icon_32x32.png
sips -z 64 64 Icon-ER-Logo-v3.jpg --out temp_icons/icon_32x32@2x.png
sips -z 128 128 Icon-ER-Logo-v3.jpg --out temp_icons/icon_128x128.png
sips -z 256 256 Icon-ER-Logo-v3.jpg --out temp_icons/icon_128x128@2x.png
sips -z 256 256 Icon-ER-Logo-v3.jpg --out temp_icons/icon_256x256.png
sips -z 512 512 Icon-ER-Logo-v3.jpg --out temp_icons/icon_256x256@2x.png
sips -z 512 512 Icon-ER-Logo-v3.jpg --out temp_icons/icon_512x512.png
sips -z 1024 1024 Icon-ER-Logo-v3.jpg --out temp_icons/icon_512x512@2x.png

echo "🍎 Creating macOS .icns file..."

# Create iconset directory
mkdir -p temp_icons/EventRunner.iconset

# Move files to iconset
mv temp_icons/icon_*.png temp_icons/EventRunner.iconset/

# Generate .icns file
iconutil -c icns temp_icons/EventRunner.iconset -o icon.icns

echo "✅ Created icon.icns"

# Create high-res PNG for Linux
echo "🐧 Creating Linux PNG icon..."
sips -z 512 512 Icon-ER-Logo-v3.jpg --out icon.png
echo "✅ Created icon.png"

# For Windows .ico, we'll provide instructions since macOS doesn't have built-in tools
echo "🪟 For Windows .ico file:"
echo "   1. Go to https://cloudconvert.com/png-to-ico"
echo "   2. Upload your Icon-ER-Logo-v3.jpg"
echo "   3. Set sizes to: 16x16, 32x32, 48x48, 256x256"
echo "   4. Download and save as 'icon.ico' in this folder"

# Clean up temporary files
rm -rf temp_icons

echo ""
echo "🎉 Icon generation complete!"
echo ""
echo "📋 Generated files:"
echo "   ✅ icon.icns (macOS)"
echo "   ✅ icon.png (Linux)"
echo "   ⏳ icon.ico (Windows - needs manual conversion)"
echo ""
echo "🚀 Next steps:"
echo "   1. Create icon.ico using the instructions above"
echo "   2. Run 'npm run electronpackage' to test your new icons"
echo ""
