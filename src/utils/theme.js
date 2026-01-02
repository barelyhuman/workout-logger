// Monochromatic theme configuration with Swiss Design principles
export const theme = {
  colors: {
    background: '#000000',
    surface: '#1a1a1a',
    surfaceLight: '#2a2a2a',
    surfaceLighter: '#2f2f2f',
    text: '#ffffff',
    textSecondary: '#999999',
    textTertiary: '#666666',
    border: '#333333',
    borderLight: '#404040',
    primary: '#ffffff',
    success: '#ffffff',
    disabled: '#666666',
  },
  // 8pt grid system - compact mode (4pt base, multiples of 4)
  spacing: {
    xs: 4,    // 0.5 unit
    sm: 8,    // 1 unit
    md: 12,   // 1.5 units
    lg: 16,   // 2 units
    xl: 20,   // 2.5 units
    xxl: 24,  // 3 units
    xxxl: 32, // 4 units
  },
  // Border radius scale - compact
  borderRadius: {
    sm: 3,
    md: 6,
    lg: 8,
    xl: 12,
  },
  // Typography with letter spacing and line heights - compact mobile sizes
  typography: {
    title: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: 0.4,
      lineHeight: 34,
    },
    heading: {
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 0.4,
      lineHeight: 28,
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.25,
      lineHeight: 24,
    },
    body: {
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '500',
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodySemibold: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      letterSpacing: 0.15,
      lineHeight: 16,
    },
    captionMedium: {
      fontSize: 12,
      fontWeight: '500',
      letterSpacing: 0.15,
      lineHeight: 16,
    },
    small: {
      fontSize: 11,
      fontWeight: '400',
      letterSpacing: 0.15,
      lineHeight: 15,
    },
  },
  // Elevation system using opacity (monochrome shadows)
  elevation: {
    low: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    high: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};
