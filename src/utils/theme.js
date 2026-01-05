// Industrial Design System - Inspired by precision tools and minimalist industrial aesthetics
// Features: Off-white base, micro-labels, generous whitespace, technical precision
export const theme = {
  colors: {
    // Off-white base palette (warmer, softer than pure black/white)
    background: '#F5F5F0',        // Warm off-white background
    surface: '#FFFFFF',            // Pure white for cards/surfaces
    surfaceElevated: '#FAFAF8',   // Slightly elevated surface
    
    // Text colors (darker grays for contrast on light background)
    text: '#1A1A1A',              // Primary text - almost black
    textSecondary: '#666666',      // Secondary text - medium gray
    textTertiary: '#999999',       // Tertiary text - light gray
    textMicro: '#AAAAAA',         // Micro labels - very light gray
    
    // Borders and dividers (subtle, technical feel)
    border: '#E0E0DC',            // Primary border - subtle warm gray
    borderMedium: '#CCCCCA',      // Medium border
    borderStrong: '#999999',      // Strong border for emphasis
    
    // Interactive elements
    primary: '#1A1A1A',           // Primary action - dark
    primaryLight: '#333333',      // Hover/pressed state
    disabled: '#CCCCCC',          // Disabled state
    
    // Accents (minimal, monochromatic)
    accent: '#666666',            // Accent for highlights
    accentLight: '#F0F0EC',       // Light accent background
  },
  
  // 8px grid system - generous whitespace for industrial feel
  spacing: {
    micro: 2,   // For micro labels and tight spacing
    xs: 4,      // Extra small
    sm: 8,      // Small - 1 unit
    md: 16,     // Medium - 2 units (doubled for more whitespace)
    lg: 24,     // Large - 3 units
    xl: 32,     // Extra large - 4 units
    xxl: 40,    // 2X large - 5 units
    xxxl: 48,   // 3X large - 6 units
  },
  
  // Minimal border radius - industrial tools are precise and angular
  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 6,
  },
  
  // Typography system - includes micro labels for industrial aesthetic
  typography: {
    // Display sizes
    display: {
      fontSize: 32,
      fontWeight: '600',
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: -0.3,
      lineHeight: 32,
    },
    
    // Body text
    heading: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: -0.2,
      lineHeight: 24,
    },
    subheading: {
      fontSize: 16,
      fontWeight: '500',
      letterSpacing: 0,
      lineHeight: 22,
    },
    body: {
      fontSize: 15,
      fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 22,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '500',
      letterSpacing: 0,
      lineHeight: 22,
    },
    bodySemibold: {
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: 0,
      lineHeight: 22,
    },
    
    // Small text
    caption: {
      fontSize: 13,
      fontWeight: '400',
      letterSpacing: 0.1,
      lineHeight: 18,
    },
    captionMedium: {
      fontSize: 13,
      fontWeight: '500',
      letterSpacing: 0.1,
      lineHeight: 18,
    },
    
    // Micro labels - key feature of industrial design
    micro: {
      fontSize: 11,
      fontWeight: '500',
      letterSpacing: 0.5,
      lineHeight: 14,
      textTransform: 'uppercase',
    },
    microRegular: {
      fontSize: 11,
      fontWeight: '400',
      letterSpacing: 0.3,
      lineHeight: 14,
    },
    
    // Numeric display - for precision data
    numeric: {
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: -0.5,
      lineHeight: 32,
    },
    numericLarge: {
      fontSize: 32,
      fontWeight: '600',
      letterSpacing: -0.8,
      lineHeight: 40,
    },
  },
  
  // Subtle elevation system
  elevation: {
    none: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    low: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    high: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
