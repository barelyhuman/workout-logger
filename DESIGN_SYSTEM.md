# Industrial Design System

## Overview
The Workout Logger app uses an **Industrial Design System** inspired by precision measuring tools, technical instruments, and minimalist industrial aesthetics. This design language emphasizes clarity, precision, and functionality through the use of micro-labels, generous whitespace, and a warm off-white color palette.

## Design Philosophy

### Core Principles
1. **Precision & Clarity** - Every element has a clear purpose, like markings on a measuring tool
2. **Micro-Labels** - Small, uppercase annotations provide context without cluttering the interface
3. **Generous Whitespace** - Breathing room between elements creates a calm, focused experience
4. **Minimal & Functional** - No decorative elements; everything serves a purpose
5. **Technical Aesthetic** - Angular corners, precise borders, and structured layouts

### Inspiration
- Precision measuring tools (calipers, micrometers, rulers)
- Industrial equipment interfaces
- Technical documentation and blueprints
- Swiss design principles adapted for industrial contexts

## Color Palette

### Background & Surfaces
```javascript
background: '#F5F5F0'      // Warm off-white - main background
surface: '#FFFFFF'          // Pure white - cards and elevated elements
surfaceElevated: '#FAFAF8' // Slightly elevated surfaces
```

### Text Colors
```javascript
text: '#1A1A1A'           // Primary text - almost black
textSecondary: '#666666'   // Secondary text - medium gray
textTertiary: '#999999'    // Tertiary text - light gray
textMicro: '#AAAAAA'      // Micro labels - very light gray
```

### Borders & Dividers
```javascript
border: '#E0E0DC'         // Primary border - subtle warm gray
borderMedium: '#CCCCCA'   // Medium border
borderStrong: '#999999'   // Strong border for emphasis
```

### Interactive Elements
```javascript
primary: '#1A1A1A'        // Primary action - dark
primaryLight: '#333333'   // Hover/pressed state
disabled: '#CCCCCC'       // Disabled state
```

## Typography

### Micro-Labels (Signature Feature)
The defining characteristic of this design system - small, uppercase labels that annotate and provide context.

```javascript
micro: {
  fontSize: 11,
  fontWeight: '500',
  letterSpacing: 0.5,     // Wide letter spacing for industrial feel
  lineHeight: 14,
  textTransform: 'uppercase',
}
```

**Usage Examples:**
- Section headers: "HISTORY", "EXERCISE LIBRARY"
- Field labels: "REPS", "NAME", "CATEGORY"
- Category tags: "UPPER BODY", "CORE"
- Button text: "LOG", "DELETE", "SAVE"

### Body Text
```javascript
body: {
  fontSize: 15,
  fontWeight: '400',
  letterSpacing: 0,
  lineHeight: 22,
}
```

### Numeric Display
For displaying workout data prominently:
```javascript
numeric: {
  fontSize: 24,
  fontWeight: '600',
  letterSpacing: -0.5,
  lineHeight: 32,
}
```

## Spacing System

### 8px Grid System
All spacing is based on multiples of 8px, providing generous whitespace:

```javascript
micro: 2    // For tight spacing in micro-labels
xs: 4       // Extra small
sm: 8       // Small - 1 unit
md: 16      // Medium - 2 units (doubled for more whitespace)
lg: 24      // Large - 3 units
xl: 32      // Extra large - 4 units
xxl: 40     // 2X large - 5 units
xxxl: 48    // 3X large - 6 units
```

## Border Radius

### Minimal, Angular Aesthetic
Small border radius values maintain the industrial, precise aesthetic:

```javascript
none: 0     // Sharp corners
sm: 2       // Subtle rounding
md: 4       // Standard rounding
lg: 6       // Maximum rounding
```

## Components

### Cards
```javascript
backgroundColor: surface (#FFFFFF)
borderWidth: 1
borderColor: border (#E0E0DC)
borderRadius: sm (2px)
padding: md (16px)
shadow: low (subtle)
```

### Buttons
```javascript
// Primary
backgroundColor: primary (#1A1A1A)
color: surface (#FFFFFF)
text: uppercase micro-labels
borderRadius: sm (2px)
padding: md (16px) vertical, lg (24px) horizontal

// Outline
backgroundColor: surface (#FFFFFF)
borderColor: border (#E0E0DC)
color: text (#1A1A1A)
text: uppercase micro-labels
```

### Input Fields
```javascript
backgroundColor: background (#F5F5F0)
borderColor: border (#E0E0DC)
borderWidth: 1
borderRadius: sm (2px)
padding: md (16px)
```

## Layout Patterns

### Exercise Card
```
┌─────────────────────────────────────────┐
│ UPPER BODY         (micro-label)        │
│ Push-ups           (body text)          │
│                              [LOG]      │
│                         (button)        │
└─────────────────────────────────────────┘
```

### History Card
```
┌─────────────────────────────────────────┐
│ UPPER BODY         (micro-label)        │
│                                         │
│ Push-ups           (heading)            │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ REPS              LOGGED                │
│ 20                Today, 2:30 PM        │
│ (numeric)         (caption + micro)     │
└─────────────────────────────────────────┘
```

### Modal Dialog
```
┌─────────────────────────────────────────┐
│                                         │
│            ADD EXERCISE                 │
│          (micro-label title)            │
│                                         │
│  NAME *                                 │
│  [___________________]                  │
│                                         │
│  CATEGORY                               │
│  [___________________]                  │
│                                         │
│  [CANCEL]          [SAVE]               │
│                                         │
└─────────────────────────────────────────┘
```

## Usage Guidelines

### Do's ✓
- Use micro-labels for all section headers and field labels
- Maintain generous whitespace between elements
- Keep button text uppercase
- Use subtle borders (1px) for definition
- Display numeric data prominently
- Use the 8px grid for all spacing

### Don'ts ✗
- Don't add colors outside the monochromatic palette
- Don't use large border radius (keep it angular)
- Don't use decorative elements
- Don't crowd elements (respect whitespace)
- Don't use mixed case in micro-labels
- Don't deviate from the spacing grid

## Accessibility

### Contrast Ratios
- Text on background: 13.25:1 (AAA)
- Secondary text on background: 5.4:1 (AA)
- Borders are subtle but visible: 1.3:1

### Touch Targets
- Minimum touch target: 44px height
- Buttons have generous padding for easy tapping
- Cards have adequate spacing between them

## Design Rationale

### Why Off-White Instead of Black?
- Reduces eye strain in well-lit environments
- More versatile for different lighting conditions
- Feels more approachable and less aggressive
- Better suits the industrial/technical aesthetic

### Why Micro-Labels?
- Inspired by technical equipment and measuring tools
- Provides context without visual clutter
- Creates clear hierarchy through size and weight
- Uppercase adds to the technical, precise feeling

### Why Generous Whitespace?
- Reduces cognitive load
- Makes the interface feel calm and professional
- Emphasizes the minimal, functional aesthetic
- Improves readability and focus

## Implementation

All design tokens are centralized in `src/utils/theme.js`. Components import and use these tokens exclusively:

```javascript
import { theme } from '../utils/theme';

// In styles
const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    color: theme.colors.textMicro,
    textTransform: 'uppercase',
  },
});
```

## Future Enhancements

Potential additions that maintain the industrial aesthetic:
- Monospaced font option for numeric displays
- Grid overlay option for precise alignment
- Ruler-style measurements in dev mode
- Additional micro-label variations
- Technical diagram-style illustrations
