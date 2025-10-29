# 🎨 Color Customization Guide

## Quick Start

To change the color scheme for **Producer, Consumer, and Seller** dashboards:

1. Open `src/config/colors.js`
2. Modify the values in the `userColors` object
3. Save the file - changes will apply automatically!

## File Location

```
frontend/src/config/colors.js
```

## Current Color Palette (Ocean Theme)

```javascript
export const userColors = {
  primary: '#7AB2B2',        // Main brand color
  primaryHover: '#4D869C',   // Hover state
  bgLight: '#EEF7FF',        // Light background
  bgAccent: '#CDE8E5',       // Accent background
};
```

### Color Breakdown:
- **#CDE8E5** - Soft mint/teal (accent backgrounds)
- **#EEF7FF** - Very light blue (main backgrounds)
- **#7AB2B2** - Medium teal (primary buttons, icons)
- **#4D869C** - Darker blue-teal (hover states)

## How to Try New Color Palettes

### Option 1: Use a Preset

We've included 6 ready-to-use color presets at the bottom of `colors.js`:

```javascript
export const colorPresets = {
  ocean: { ... },      // Current (teal/blue)
  sunset: { ... },     // Warm red/pink
  forest: { ... },     // Green nature theme
  lavender: { ... },   // Purple/violet
  coral: { ... },      // Orange/coral
  mint: { ... },       // Bright mint/turquoise
};
```

**To apply a preset:**
1. Copy the values from your chosen preset
2. Paste them into the `userColors` object
3. Save!

Example - switching to **Sunset** theme:
```javascript
export const userColors = {
  primary: '#FF6B6B',
  primaryHover: '#EE5A6F',
  bgLight: '#FFE5E5',
  bgAccent: '#FFD1D1',
  // ... rest stays the same
};
```

### Option 2: Create Your Own

Simply replace the hex color values with your own:

```javascript
export const userColors = {
  primary: '#YOUR_COLOR',        // Main buttons, icons, accents
  primaryHover: '#YOUR_COLOR',   // Hover effects
  bgLight: '#YOUR_COLOR',        // Light backgrounds
  bgAccent: '#YOUR_COLOR',       // Accent backgrounds
};
```

## Color Selection Tips

### For Best Results:

1. **Primary Colors** - Choose medium-to-dark colors for good contrast
2. **Background Colors** - Use very light tints (90-95% lightness)
3. **Contrast** - Ensure `primary` is darker than backgrounds
4. **Harmony** - Keep colors in the same family or use complementary colors

### Recommended Tools:
- [Coolors.co](https://coolors.co/) - Generate color palettes
- [Adobe Color](https://color.adobe.com/) - Color wheel and harmony rules
- [Paletton](https://paletton.com/) - Advanced palette designer

## What Gets Updated?

When you change colors in `colors.js`, these elements automatically update:

✅ **Navigation bars** (top bar, sidebar)  
✅ **Buttons** (all primary action buttons)  
✅ **Icons** (role icons, feature icons)  
✅ **Gradients** (backgrounds, accents, hover effects)  
✅ **Cards** (product cards, metric cards, form cards)  
✅ **Borders and accents** (top bars, dividers)  
✅ **Glow effects** (hover animations)  

## Admin Dashboard

The **Admin Dashboard** keeps the original **saffron-gold** theme and is NOT affected by changes to `userColors`.

If you need to change admin colors, modify the `adminColors` object instead:

```javascript
export const adminColors = {
  primary: '#D4A017',        // Saffron gold
  primaryHover: '#E8AE3A',   // Lighter gold
  bgLight: '#FEF3C7',        // Light amber
  bgAccent: '#FDE68A',       // Amber accent
};
```

## Testing Your Colors

After changing colors:

1. **Save the file** - Hot reload should apply changes
2. **Check all dashboards**:
   - Producer Dashboard (`/dashboard/producer`)
   - Consumer Dashboard (`/dashboard/consumer`)
   - Seller Dashboard (`/dashboard/seller`)
3. **Test dark mode** - Toggle dark mode to ensure colors work well
4. **Check accessibility** - Ensure text is readable on all backgrounds

## Troubleshooting

### Colors not updating?
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check for syntax errors in `colors.js`
- Restart the development server

### Colors look wrong in dark mode?
- Dark mode automatically adjusts opacity and brightness
- Test both light and dark modes when choosing colors
- Lighter colors work better for dark mode compatibility

### Need more customization?
The color system uses inline styles for maximum flexibility. You can:
- Add more color properties to the config
- Modify gradient directions in component files
- Adjust opacity values (the `33` in `${userColors.primary}33` means 20% opacity)

## Examples

### Professional Blue Theme
```javascript
primary: '#2563EB',
primaryHover: '#1D4ED8',
bgLight: '#EFF6FF',
bgAccent: '#DBEAFE',
```

### Earthy Green Theme
```javascript
primary: '#059669',
primaryHover: '#047857',
bgLight: '#ECFDF5',
bgAccent: '#D1FAE5',
```

### Modern Purple Theme
```javascript
primary: '#7C3AED',
primaryHover: '#6D28D9',
bgLight: '#F5F3FF',
bgAccent: '#EDE9FE',
```

---

**Need Help?** Check the comments in `src/config/colors.js` for more details!
