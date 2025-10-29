/**
 * Color Configuration for Saffron Supply Chain Tracker
 * 
 * EASY COLOR CUSTOMIZATION:
 * Simply change the hex values below to try new color palettes.
 * The entire application will automatically update.
 */

// ============================================
// USER DASHBOARDS COLOR PALETTE
// (Producer, Consumer, Seller)
// ============================================
const getVar = (name, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const cs = getComputedStyle(document.documentElement);
  const v = cs.getPropertyValue(name)?.trim();
  return v || fallback;
};

export const userColors = {
  get primary() { return getVar('--color-primary', '#5EEAD4'); },
  get primaryHover() { return getVar('--color-primary-hover', '#2DD4BF'); },
  get bgLight() { return getVar('--color-bg-light', '#F0FDFA'); },
  get bgAccent() { return getVar('--color-bg-accent', '#CCFBF1'); },
  get gradients() {
    const p = this.primary;
    const ph = this.primaryHover;
    const bl = this.bgLight;
    const ba = this.bgAccent;
    return {
      primary: `from-[${p}] to-[${ph}]`,
      background: `from-[${bl}] to-[${ba}]`,
      accent: `from-[${ba}] via-[${p}] to-[${ph}]`,
    };
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// ============================================
// ADMIN DASHBOARD COLOR PALETTE
// (Keep original saffron-gold theme)
// ============================================
export const adminColors = {
  // Primary colors
  primary: '#D4A017',        // Saffron gold
  primaryHover: '#E8AE3A',   // Lighter gold
  
  // Background colors
  bgLight: '#FEF3C7',        // Light amber
  bgAccent: '#FDE68A',       // Amber accent
  
  // Gradient combinations
  gradients: {
    primary: 'from-[#D4A017] to-[#E8AE3A]',
    background: 'from-[#FEF3C7] to-[#FDE68A]',
    accent: 'from-[#D4A017] via-[#E8AE3A] to-[#D4A017]',
  },
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get color palette based on user role
 * @param {string} role - User role (admin, producer, consumer, seller)
 * @returns {object} Color palette object
 */
export const getColorsByRole = (role) => {
  return role === 'admin' ? adminColors : userColors;
};

/**
 * Generate CSS custom properties for a color palette
 * @param {object} colors - Color palette object
 * @returns {object} CSS custom properties
 */
export const generateCSSVariables = (colors) => {
  return {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-bg-light': colors.bgLight,
    '--color-bg-accent': colors.bgAccent,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-error': colors.error,
    '--color-info': colors.info,
  };
};

// ============================================
// QUICK PALETTE PRESETS
// Try these by copying them to userColors above!
// ============================================

export const colorPresets = {
  ocean: {
    primary: '#7AB2B2',
    primaryHover: '#4D869C',
    bgLight: '#EEF7FF',
    bgAccent: '#CDE8E5',
  },
  
  sunset: {
    primary: '#FF6B6B',
    primaryHover: '#EE5A6F',
    bgLight: '#FFE5E5',
    bgAccent: '#FFD1D1',
  },
  
  forest: {
    primary: '#52B788',
    primaryHover: '#40916C',
    bgLight: '#D8F3DC',
    bgAccent: '#B7E4C7',
  },
  
  lavender: {
    primary: '#9D84B7',
    primaryHover: '#7B68A6',
    bgLight: '#F3ECFF',
    bgAccent: '#E5D9F2',
  },
  
  coral: {
    primary: '#FF8C69',
    primaryHover: '#FF7A59',
    bgLight: '#FFF0EB',
    bgAccent: '#FFE4DB',
  },
  
  mint: {
    primary: '#5EEAD4',
    primaryHover: '#2DD4BF',
    bgLight: '#F0FDFA',
    bgAccent: '#CCFBF1',
  },
  
  saffron: {
    primary: '#D4A017',
    primaryHover: '#E8AE3A',
    bgLight: '#FEF3C7',
    bgAccent: '#FDE68A',
  },
  
  amber: {
    primary: '#F59E0B',
    primaryHover: '#D97706',
    bgLight: '#FEF3C7',
    bgAccent: '#FDE047',
  },
  
  emerald: {
    primary: '#10B981',
    primaryHover: '#059669',
    bgLight: '#D1FAE5',
    bgAccent: '#A7F3D0',
  },
  
  sapphire: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    bgLight: '#DBEAFE',
    bgAccent: '#BFDBFE',
  },
  
  roseGold: {
    primary: '#E8A598',
    primaryHover: '#D4877E',
    bgLight: '#FFF1F0',
    bgAccent: '#FFE4E1',
  },
  
  midnight: {
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    bgLight: '#E0E7FF',
    bgAccent: '#C7D2FE',
  },
  
  peach: {
    primary: '#FDBA74',
    primaryHover: '#FB923C',
    bgLight: '#FFEDD5',
    bgAccent: '#FED7AA',
  },
};
