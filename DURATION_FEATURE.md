# Duration Support Feature

## Overview
Added support for time-based exercises that are measured in duration (minutes and seconds) rather than repetitions.

## Changes Made

### 1. Data Model Updates
- **defaultExercises.js**: Added `type` field to all exercises
  - `type: 'reps'` - For repetition-based exercises (default)
  - `type: 'duration'` - For time-based exercises
  - Duration exercises: Wall Sit, Plank, L-Sit Hold, Front Lever Hold

### 2. Exercise Library Management
- **ExerciseLibraryScreen.js**: Added exercise type selector
  - Users can now choose between "Reps" or "Duration" when creating/editing exercises
  - Visual toggle buttons with active/inactive states (monochromatic design)
  - Type is saved with the exercise and persists in storage

### 3. Exercise Logging
- **LogExerciseScreen.js**: Updated logging modal
  - For duration exercises: Shows two input fields (minutes and seconds)
  - For reps exercises: Shows single input field for reps count
  - Calculates and stores total duration in seconds
  - Success message shows formatted duration (e.g., "2m 30s")

### 4. History Display
- **HistoryScreen.js**: Updated to show duration properly
  - Duration exercises display "Duration: 2m 30s" (or just minutes/seconds if one is zero)
  - Reps exercises continue to display "Reps: 20"
  - Format automatically adjusts based on exercise type

## Data Structure

### Exercise Object
```javascript
{
  id: '23',
  name: 'Plank',
  category: 'Core',
  type: 'duration'  // or 'reps'
}
```

### Exercise Log Object (Duration)
```javascript
{
  id: '1234567890',
  exerciseId: '23',
  exerciseName: 'Plank',
  category: 'Core',
  type: 'duration',
  duration: 150,  // in seconds (2m 30s)
  timestamp: '2026-01-05T03:42:02.708Z'
}
```

### Exercise Log Object (Reps)
```javascript
{
  id: '1234567890',
  exerciseId: '1',
  exerciseName: 'Push-ups',
  category: 'Upper Body',
  type: 'reps',
  reps: 20,
  timestamp: '2026-01-05T03:42:02.708Z'
}
```

## User Flow Examples

### Adding a Duration Exercise
1. Navigate to Exercise Library
2. Tap "Add Exercise"
3. Enter exercise name (e.g., "Handstand Hold")
4. Select category
5. Toggle to "Duration" type
6. Tap "Save"

### Logging a Duration Exercise
1. From home screen, tap a duration exercise (e.g., "Plank")
2. Modal shows "Duration *" with minutes and seconds inputs
3. Enter values (e.g., 2 minutes, 30 seconds)
4. Tap "Log"
5. See success message: "Logged 2m 30s of Plank"

### Viewing History
1. Navigate to History
2. Duration exercises show "Duration: 2m 30s"
3. Reps exercises show "Reps: 20"

## Technical Details

### Duration Formatting
- **Storage**: Duration stored as total seconds (integer)
- **Display**: Formatted based on value:
  - `150s` → "2m 30s"
  - `120s` → "2m"
  - `45s` → "45s"

### Backwards Compatibility
- Existing exercises without `type` field default to 'reps'
- Old logs without `type` field will display reps (maintains existing behavior)
- No data migration needed - graceful degradation

### Validation
- Duration exercises: At least one of minutes or seconds must be > 0
- Reps exercises: Must be a valid positive number
- Empty/invalid inputs show error alerts

## Testing Checklist

### Exercise Library
- [x] Add new duration exercise
- [x] Add new reps exercise
- [x] Edit existing exercise and change type
- [x] Type selector shows correct active state
- [x] Type is persisted after save

### Logging
- [x] Log duration exercise with both minutes and seconds
- [x] Log duration exercise with only minutes
- [x] Log duration exercise with only seconds
- [x] Log reps exercise
- [x] Validation works for duration (0m 0s shows error)
- [x] Validation works for reps (empty/invalid shows error)
- [x] Success message shows correct format

### History
- [x] Duration exercises display formatted duration
- [x] Reps exercises display reps count
- [x] Old logs without type field still display correctly
- [x] Formatting handles edge cases (0 seconds, 0 minutes)

### Design
- [x] All UI elements maintain monochromatic theme
- [x] Type selector buttons follow theme guidelines
- [x] Duration inputs maintain consistent spacing
- [x] Labels and placeholders are clear and consistent

## Future Enhancements (Not Included)
- Weight tracking for weighted exercises
- Set tracking (multiple sets per exercise)
- Custom units (kg vs lbs, meters vs feet)
- Rest timer between sets
- Exercise notes/comments
