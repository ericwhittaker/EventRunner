# EventRunner Code Signing Setup Guide

## Overview
To distribute your EventRunner app without security warnings, you need to code sign it with an Apple Developer ID certificate.

## Prerequisites

### 1. Apple Developer Account
- Enroll in the Apple Developer Program ($99/year)
- Visit: https://developer.apple.com/programs/

### 2. Download Developer ID Application Certificate

**Step 1:** Log in to Apple Developer Console
- Go to: https://developer.apple.com/account/resources/certificates/

**Step 2:** Create Certificate
- Click "+" to create new certificate
- Select "Developer ID Application" 
- Follow the instructions to generate and download

**Step 3:** Install Certificate
- Double-click the downloaded certificate
- Add it to your "login" keychain
- Verify with: `security find-identity -v -p codesigning`

## Environment Variables Setup

Create a `.env` file in your project root with:

```bash
# Required for code signing
CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"

# Optional: For notarization (recommended for distribution)
APPLE_ID="your-apple-id@email.com"
APPLE_ID_PASSWORD="app-specific-password"
APPLE_TEAM_ID="YOUR_TEAM_ID"

# Disable auto-discovery if you want manual control
# CSC_IDENTITY_AUTO_DISCOVERY=false
```

## App-Specific Password Setup (for Notarization)

1. Go to: https://appleid.apple.com/account/manage
2. Sign in with your Apple ID
3. Go to "Security" > "App-Specific Passwords"
4. Generate a new password for "EventRunner Notarization"
5. Use this password in APPLE_ID_PASSWORD

## Find Your Team ID

```bash
# List your certificates and find the Team ID
security find-identity -v -p codesigning
```

The Team ID is in parentheses in the certificate name.

## Building Signed App

Once certificates are installed:

```bash
# Test local signing (no notarization)
npm run electronpackage

# Build and sign for distribution
CSC_NAME="Developer ID Application: Your Name" npm run electronpackage

# Full build with notarization (takes 5-10 minutes)
npm run release
```

## Verification

Test your signed app:

```bash
# Check code signature
codesign -dv --verbose=4 out/EventRunner-darwin-arm64/EventRunner.app

# Check if it will pass Gatekeeper
spctl -a -t exec -vv out/EventRunner-darwin-arm64/EventRunner.app
```

## Distribution Options

### Option 1: GitHub Releases (Current Setup)
- Your `npm run release` already publishes to GitHub
- Users download and can run without warnings

### Option 2: Mac App Store
- Requires "Mac App Store" certificate (different from Developer ID)
- More restrictive but wider distribution

### Option 3: Direct Download
- Host the signed .app or .dmg on your website
- Users can download and run immediately

## Troubleshooting

**"No identity found" error:**
- Ensure certificate is in "login" keychain
- Check certificate name with: `security find-identity -v -p codesigning`

**Notarization failed:**
- Check Apple ID credentials
- Ensure app-specific password is correct
- Wait 5-10 minutes for Apple's servers

**Gatekeeper still blocks app:**
- App may need notarization for distribution
- Test on a different Mac that hasn't seen the app before

## Current Status

✅ Code signing configuration added to forge.config.js
✅ Entitlements file created  
✅ Signing packages installed
⏳ Need Developer ID Application certificate
⏳ Need environment variables setup

## Next Steps

1. Get Apple Developer ID Application certificate
2. Set up environment variables
3. Test signing with `npm run electronpackage`
4. Test distribution with `npm run release`
