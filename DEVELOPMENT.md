# Development Guide

## Project Overview
This is a minimal, monochromatic workout logging app built with React Native and Expo for Android. It allows users to create workout routines, track workouts in real-time, and view their workout history - all stored locally on the device.

## Tech Stack
- **Framework**: React Native 0.81.5
- **Platform**: Expo ~54.0
- **Navigation**: React Navigation 7.x
- **Storage**: AsyncStorage 2.x
- **Language**: JavaScript (ES6+)
- **UI**: React Native core components

## Architecture

### Directory Structure
```
workout-logger/
├── App.js                          # App entry point with navigation
├── index.js                        # Expo entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Button.js              # Custom button component
│   │   ├── ExerciseItem.js        # Exercise display component
│   │   └── RoutineCard.js         # Routine card component
│   ├── screens/                    # App screens
│   │   ├── HomeScreen.js          # Main screen with routine list
│   │   ├── RoutineDetailScreen.js # Routine details view
│   │   ├── WorkoutSessionScreen.js# Active workout tracking
│   │   ├── CreateRoutineScreen.js # Routine creation form
│   │   └── HistoryScreen.js       # Workout history
│   ├── data/
│   │   └── defaultRoutines.js     # Pre-loaded workout data
│   └── utils/
│       ├── theme.js               # Color and style constants
│       └── storage.js             # AsyncStorage utilities
├── assets/                         # App icons and images
├── README.md                       # Project documentation
└── TESTING.md                      # Testing documentation
```

### Data Flow

#### Storage Layer
- **AsyncStorage** is used for all local data persistence
- Two main data collections:
  1. `@workout_routines` - Array of routine objects
  2. `@workout_history` - Array of completed workout objects

#### Data Models

**Routine Object:**
```javascript
{
  id: string,           // Unique identifier (timestamp)
  name: string,         // Routine name
  description: string,  // Optional description
  exercises: [          // Array of exercise objects
    {
      name: string,     // Exercise name
      sets: number,     // Number of sets
      reps: string,     // Reps (can be range like "8-12" or duration like "30s")
      rest: number,     // Rest time in seconds
      notes: string     // Optional exercise notes
    }
  ],
  createdAt: string     // ISO 8601 timestamp
}
```

**Workout History Object:**
```javascript
{
  id: string,           // Unique identifier (timestamp)
  routineName: string,  // Name of completed routine
  exercises: [],        // Array of completed exercises
  duration: number,     // Duration in minutes
  completedAt: string   // ISO 8601 timestamp
}
```

### Navigation Structure
```
NavigationContainer
└── Stack Navigator
    ├── Home (headerShown: false)
    ├── RoutineDetail
    ├── WorkoutSession (headerBackVisible: false)
    ├── CreateRoutine
    └── History
```

## Key Features Implementation

### 1. Default Routines
- 5 pre-researched calisthenics routines included
- Loaded on first app launch
- Routines cover beginner to advanced levels
- Full body, upper body, and lower body focused routines

### 2. Workout Session
- Real-time exercise tracking
- Automatic rest timer between exercises
- Progress bar showing completion
- Skip rest functionality
- Automatic progression through exercises
- Completion summary with duration

### 3. Local Storage
- All data persists locally using AsyncStorage
- No network calls or external dependencies
- Works completely offline
- Data survives app restarts

### 4. Monochromatic Theme
- Strictly black and white color scheme
- Colors defined in `src/utils/theme.js`:
  - Background: `#000000` (black)
  - Surface: `#1a1a1a` (dark gray)
  - Text: `#ffffff` (white)
  - Secondary Text: `#999999` (gray)
  - Borders: `#333333` (dark gray)

## Development Setup

### Prerequisites
```bash
# Node.js 18+ required
node --version

# Install Expo CLI globally (optional)
npm install -g expo-cli
```

### Installation
```bash
# Clone the repository
git clone https://github.com/barelyhuman/workout-logger.git
cd workout-logger

# Install dependencies
npm install
```

### Running the App

#### Development Mode
```bash
# Start Expo development server
npm start

# This will open Expo DevTools in your browser
# Scan the QR code with Expo Go app on Android
```

#### Android Specific
```bash
# Run directly on Android emulator/device
npm run android

# Requires Android Studio with emulator or connected Android device
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Make Changes**
   - Edit files in `src/` directory
   - Changes hot-reload automatically

3. **Test on Device**
   - Use Expo Go app on Android device
   - Scan QR code from terminal/browser

4. **Debug**
   - Press `j` in terminal to open debugger
   - Use React DevTools
   - Check console logs in Metro bundler

## Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Use ES6+ features (arrow functions, destructuring, etc.)
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks if needed

### File Organization
- One component per file
- Name files after the component they export
- Use PascalCase for component files
- Use camelCase for utility files

### Component Structure
```javascript
import statements

export const ComponentName = ({ props }) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Render
  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    // Styles
  },
});
```

### Styling
- Use StyleSheet.create() for all styles
- Import theme constants from `src/utils/theme.js`
- Keep styles at bottom of file
- Use consistent spacing from theme

## Common Development Tasks

### Adding a New Screen
1. Create new file in `src/screens/`
2. Import necessary dependencies
3. Create component with SafeAreaView and StatusBar
4. Add styles using theme
5. Register in navigation stack in `App.js`

### Adding a New Component
1. Create new file in `src/components/`
2. Build reusable component
3. Export component
4. Import and use in screens

### Modifying Default Routines
1. Edit `src/data/defaultRoutines.js`
2. Follow the existing data structure
3. Ensure all required fields are present
4. Clear app storage to see new defaults (or delete app data)

### Updating Theme
1. Edit `src/utils/theme.js`
2. Changes apply app-wide automatically
3. Keep monochromatic (black/white/gray only)

### Adding Storage Functions
1. Edit `src/utils/storage.js`
2. Use AsyncStorage for persistence
3. Handle errors gracefully
4. Return consistent data types

## Debugging Tips

### Common Issues

**Issue: App won't load**
- Clear Metro bundler cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors in console

**Issue: Changes not appearing**
- Ensure Metro bundler is running
- Try reloading app: Shake device > "Reload"
- Check hot reload is enabled

**Issue: Navigation not working**
- Verify screen is registered in App.js
- Check navigation prop is passed correctly
- Ensure navigation params are correct

**Issue: Storage not persisting**
- Check AsyncStorage is imported correctly
- Verify JSON serialization is working
- Test on physical device (not all emulators support AsyncStorage fully)

### Debugging Tools
- **React DevTools**: Inspect component hierarchy
- **Chrome DevTools**: Debug JavaScript
- **Metro Bundler Logs**: View console output
- **Expo DevTools**: Monitor app performance

## Testing

### Manual Testing
Refer to `TESTING.md` for comprehensive test cases

### Running Lints
Currently no linter configured. To add:
```bash
npm install --save-dev eslint
npx eslint --init
```

## Building for Production

### Android APK
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Android App Bundle (AAB)
```bash
# Build for Play Store
eas build --platform android --profile production
```

## Performance Considerations

### Optimizations Implemented
- FlatList for efficient list rendering
- React.memo for component memoization (where needed)
- Debounced timers in workout session
- Minimal re-renders using proper state management

### Best Practices
- Avoid inline functions in render
- Use useMemo for expensive calculations
- Use useCallback for event handlers passed to children
- Keep AsyncStorage operations minimal

## Contributing Guidelines

### Before Submitting Changes
1. Test on Android device/emulator
2. Ensure no console errors
3. Verify monochromatic theme is maintained
4. Update documentation if needed
5. Follow existing code style

### Pull Request Process
1. Create feature branch
2. Make focused, atomic commits
3. Write descriptive commit messages
4. Test thoroughly
5. Submit PR with description

## Future Enhancements (Ideas)

### MVP+
- Edit existing routines
- Reorder exercises in routines
- Duplicate routines
- Search/filter routines

### Advanced Features
- Exercise library with images
- Workout statistics and analytics
- Export/import routines
- Backup and restore data
- Timer sounds/vibrations
- Dark/light theme toggle (while keeping monochromatic)
- Workout reminders
- Rest day tracking

### Technical Improvements
- Add TypeScript
- Add unit tests (Jest)
- Add E2E tests (Detox)
- Add CI/CD pipeline
- Add error tracking (Sentry)
- Add analytics (Amplitude)

## Troubleshooting

### Expo Issues
```bash
# Clear Expo cache
npx expo start -c

# Update Expo
npm install expo@latest

# Check Expo diagnostics
npx expo-doctor
```

### React Navigation Issues
```bash
# Reinstall navigation dependencies
npm uninstall @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/native @react-navigation/native-stack
```

### AsyncStorage Issues
```bash
# Reinstall AsyncStorage
npm uninstall @react-native-async-storage/async-storage
npm install @react-native-async-storage/async-storage

# Clear app data on device
# Settings > Apps > Workout Logger > Clear Data
```

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)

### Community
- [React Native Community](https://github.com/react-native-community)
- [Expo Forums](https://forums.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

## License
MIT License - See LICENSE file for details
