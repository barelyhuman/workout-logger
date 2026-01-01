# Workout Logger

A minimal, monochromatic workout logging app for Android that helps you create and track calisthenics workout routines locally on your phone.

## Download

[![Build Android APK](https://github.com/barelyhuman/workout-logger/actions/workflows/build-android.yml/badge.svg)](https://github.com/barelyhuman/workout-logger/actions/workflows/build-android.yml)

**Latest APK**: [Download from Releases](https://github.com/barelyhuman/workout-logger/releases/latest)

APK builds are automatically created on every push to the main branch and tagged by date. Download the latest release to install the app on your Android device.

## Features

- 🏋️ **Pre-loaded Calisthenics Routines**: 5 well-researched full body workout routines (Beginner, Intermediate, Advanced, Upper Body, Lower Body)
- ✏️ **Create Custom Routines**: Build your own workout routines with custom exercises
- 📱 **Workout Sessions**: Track your workouts in real-time with rest timers
- 📊 **Workout History**: View all your completed workouts
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

- Node.js (v18 or higher)
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

### Home Screen
- View all your workout routines
- Access pre-loaded calisthenics routines
- Create new custom routines
- View workout history

### Starting a Workout
1. Select a routine from the home screen
2. Review the exercises in the routine
3. Tap "Start Workout"
4. Complete each exercise
5. Rest timers will automatically start between exercises
6. Complete the workout and view your summary

### Creating a Custom Routine
1. Tap "Create New Routine" on the home screen
2. Enter routine name and description
3. Add exercises with sets, reps, rest time, and notes
4. Save your routine

### Viewing History
- Tap "History" in the top right of the home screen
- View all your completed workouts with dates and durations

## Project Structure

```
workout-logger/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   ├── data/           # Default workout routines
│   └── utils/          # Utilities (storage, theme)
├── assets/             # App assets (icons, images)
├── App.js              # Main app entry point
└── package.json        # Dependencies
```

## Default Workout Routines

1. **Beginner Full Body** - Perfect for beginners with fundamental movements
2. **Intermediate Full Body** - Challenging routine for intermediate practitioners
3. **Advanced Full Body** - High intensity for advanced athletes
4. **Upper Body Focus** - Concentrated upper body training
5. **Lower Body Focus** - Leg and glute strength development

## License

MIT
