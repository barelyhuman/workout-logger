# Workout Logger

[![Build Android APK](https://github.com/barelyhuman/workout-logger/actions/workflows/build-android.yml/badge.svg)](https://github.com/barelyhuman/workout-logger/actions/workflows/build-android.yml)

A minimal, monochromatic workout logging app for Android that helps you track calisthenics exercises by logging reps completed.

## Download

📥 **[Download Latest APK](https://github.com/barelyhuman/workout-logger/releases)**

The latest APK builds are automatically generated and available in the [Releases](https://github.com/barelyhuman/workout-logger/releases) section. Each build is tagged with the date and time it was created.

## Features

- 🏋️ **Exercise Library**: Pre-loaded with 27 calisthenics exercises across Upper Body, Lower Body, and Core categories
- ✏️ **Quick Exercise Logging**: Simply tap an exercise and log your reps
- 📊 **Exercise History**: View all your logged exercises with timestamps
- 🗂️ **Manage Exercise Library**: Add, edit, and delete exercises from your library
- 💾 **Local Storage**: All data is stored locally on your device
- 🎨 **Minimal Design**: Clean, monochromatic black and white theme
- 📴 **Offline First**: No internet connection required

## Technology Stack

- React Native with Expo
- React Navigation for navigation
- AsyncStorage for local data persistence
- Built for Android

## Installation

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Expo CLI
- Android device or emulator

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on Android:
```bash
npm run android
```

Or scan the QR code with the Expo Go app on your Android device.

## Usage

### Logging an Exercise
1. Open the app to see your exercise library
2. Tap on any exercise card
3. Enter the number of reps you completed
4. Tap "Log" to save

### Managing Exercise Library
1. Tap "Library" in the top right
2. Tap "Add Exercise" to create a new exercise
3. Tap any exercise to edit it
4. Tap "Delete" to remove an exercise

### Viewing History
1. Tap "History" in the top right
2. View all your logged exercises with timestamps
3. Pull down to refresh

## Project Structure

```
workout-logger/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   │   ├── LogExerciseScreen.js
│   │   ├── HistoryScreen.js
│   │   └── ExerciseLibraryScreen.js
│   ├── data/           # Default exercises
│   └── utils/          # Utilities (storage, theme)
├── assets/             # App assets (icons, images)
├── App.js              # Main app entry point
└── package.json        # Dependencies
```

## Default Exercise Library

The app comes pre-loaded with 27 exercises:

**Upper Body**: Push-ups (various variations), Pull-ups, Chin-ups, Muscle-ups, Inverted Rows, Dips, and more

**Lower Body**: Squats (various variations), Lunges, Single Leg Deadlifts, Calf Raises, Glute Bridges, Wall Sit

**Core**: Plank, Lying Leg Raises, L-Sit Hold, Dragon Flags, Front Lever Hold

## License

MIT
