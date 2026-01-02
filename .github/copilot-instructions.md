# GitHub Copilot Instructions for Workout Logger

## Project Context
This is a React Native Expo app for Android that helps users track calisthenics workouts. The app uses a strict monochromatic (black/white/gray only) theme and stores all data locally using AsyncStorage.

## Key Guidelines

### 1. Theme Consistency
- **STRICTLY MONOCHROMATIC**: Only use black, white, and shades of gray
- All colors must come from `src/utils/theme.js`
- Never suggest or add colored accents, highlights, or UI elements
- Background: `#000000`, Surface: `#1a1a1a` or `#2a2a2a`, Text: `#ffffff` or `#999999`

### 2. Code Style & Structure
- Use functional components with React hooks (never class components)
- One component per file with named exports: `export const ComponentName = () => {}`
- File naming: PascalCase for components (`HomeScreen.js`), camelCase for utilities (`storage.js`)
- Always use `StyleSheet.create()` for styles at the bottom of files
- Import SafeAreaView from `react-native-safe-area-context`, not `react-native`

### 3. Component Structure Pattern
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';

export const ComponentName = ({ navigation, prop1 }) => {
  // 1. State declarations
  // 2. Effects
  // 3. Handlers
  // 4. Render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* JSX content */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
```

### 4. Theme Usage
- Import theme: `import { theme } from '../utils/theme';`
- Use theme spacing: `theme.spacing.xs`, `sm`, `md`, `lg`, `xl`
- Use theme typography: `theme.typography.title`, `heading`, `body`, etc.
- Never hardcode colors or spacing values

### 5. Storage Patterns
- All storage functions are in `src/utils/storage.js`
- Use AsyncStorage for all persistence
- Storage keys use `@` prefix (e.g., `@workout_routines`)
- Always wrap in try/catch blocks
- Return consistent data types (arrays return `[]` on error)

### 6. Navigation
- Navigation setup is in `App.js` using React Navigation 7.x Native Stack
- Navigate with: `navigation.navigate('ScreenName', { params })`
- New screens must be registered in `App.js` Stack.Navigator

### 7. What NOT to Suggest
- ❌ Don't add colors (strictly monochromatic)
- ❌ Don't use class components
- ❌ Don't hardcode colors or spacing values
- ❌ Don't create inline styles
- ❌ Don't add network calls (app is offline-only)
- ❌ Don't use SafeAreaView from 'react-native'

## File Organization
- **Components**: `src/components/` - Reusable UI components
- **Screens**: `src/screens/` - Full screen components (use SafeAreaView + StatusBar)
- **Utils**: `src/utils/` - Utilities (storage, theme)
- **Data**: `src/data/` - Default data (routines, exercises)

## Testing
- Test on Android (primary platform)
- All data persists locally (no backend)
- Default routines load on first launch

## Quick Reference
- Theme: `src/utils/theme.js`
- Storage: `src/utils/storage.js`
- Default Routines: `src/data/defaultRoutines.js`
- Navigation: `App.js`

## When Making Suggestions
1. Always consider the monochromatic theme constraint first
2. Verify that spacing uses theme values
3. Ensure components follow the established structure pattern
4. Check that error handling is included for async operations
5. Confirm SafeAreaView is imported from the correct package
