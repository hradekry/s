# PWA Icon Setup

Your PWA needs two icon files to work properly on mobile devices:

## Required Icons

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)

## Quick Creation Options

### Option 1: Online Generator (Fastest)
1. Go to https://www.favicon-generator.org/
2. Upload any image or create a simple design
3. Download the generated icons
4. Rename them to `icon-192.png` and `icon-512.png`
5. Place them in the root folder of this project

### Option 2: Design Suggestion
- **Background**: Black (#000000)
- **Primary Color**: Purple (#A855F7)
- **Text/Symbol**: "ROS" or a minimalist calendar icon
- **Style**: Flat, minimalist, high contrast

### Option 3: Simple Solid Color (Temporary)
Create two solid purple squares:
- 192x192px purple square → `icon-192.png`
- 512x512px purple square → `icon-512.png`

## After Creating Icons

1. Place both PNG files in the project root (same folder as `index.html`)
2. Push to GitHub
3. On your phone, visit the site and tap "Add to Home Screen"
4. The icon will appear on your home screen

## Testing PWA Installation

### Android (Chrome/Samsung Browser)
1. Visit your GitHub Pages URL
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. Confirm

### iOS (Safari)
1. Visit your GitHub Pages URL
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Confirm

The app will now work offline and feel like a native app!
