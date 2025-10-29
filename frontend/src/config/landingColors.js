/**
 * Landing & Login Pages Color Configuration
 * 
 * EASY COLOR CUSTOMIZATION:
 * Change these hex values to try new color palettes for landing/login pages.
 */

// ============================================
// SAFFRON THEME COLORS
// ============================================
export const landingColors = {
  // Primary saffron colors
  saffronGold: '#d8a24f',      // Main saffron gold
  saffronLight: '#f4d9a0',     // Light saffron
  saffronDark: '#b8822f',      // Dark saffron
  
  // Earth tones
  deepBrown: '#4a2c2a',        // Deep brown
  warmBrown: '#6b4423',        // Warm brown
  cream: '#f9f6ef',            // Cream background
  lightCream: '#fdfbf7',       // Very light cream
  
  // Accent colors
  terracotta: '#c1694f',       // Terracotta accent
  sage: '#8b9a7e',             // Sage green
  
  // Gradients (auto-generated)
  gradients: {
    hero: 'from-[#4a2c2a] via-[#6b4423] to-[#d8a24f]',
    heroReverse: 'from-[#d8a24f] via-[#6b4423] to-[#4a2c2a]',
    card: 'from-[#f9f6ef] to-[#fdfbf7]',
    button: 'from-[#d8a24f] to-[#b8822f]',
    glow: 'from-[#d8a24f]/20 to-[#b8822f]/20',
  },
};

// ============================================
// QUICK PALETTE PRESETS
// ============================================
export const landingPresets = {
  saffron: {
    saffronGold: '#d8a24f',
    deepBrown: '#4a2c2a',
    cream: '#f9f6ef',
  },
  
  lavender: {
    saffronGold: '#9d84b7',
    deepBrown: '#4a2c4a',
    cream: '#f3ecff',
  },
  
  emerald: {
    saffronGold: '#52b788',
    deepBrown: '#2a4a2c',
    cream: '#ecfff3',
  },
  
  sunset: {
    saffronGold: '#ff8c69',
    deepBrown: '#4a2a2c',
    cream: '#fff0eb',
  },
};

export default landingColors;
