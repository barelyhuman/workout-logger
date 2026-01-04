# Workout Logger - App Flow

## Screen Structure

```
┌─────────────────────────────────────────┐
│      LogExerciseScreen (Home)           │
│  ┌───────────────────────────────────┐  │
│  │  [Library] [History]              │  │
│  ├───────────────────────────────────┤  │
│  │  Exercise Library List            │  │
│  │  ┌─────────────────────┐ [Log]    │  │
│  │  │ Push-ups            │          │  │
│  │  │ Upper Body          │          │  │
│  │  └─────────────────────┘          │  │
│  │  ┌─────────────────────┐ [Log]    │  │
│  │  │ Pull-ups            │          │  │
│  │  │ Upper Body          │          │  │
│  │  └─────────────────────┘          │  │
│  │  ...                              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │                │
           │                └──────────────┐
           │                               │
           ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│  ExerciseLibrary     │      │  HistoryScreen       │
│  ┌────────────────┐  │      │  ┌────────────────┐  │
│  │ Push-ups       │  │      │  │ Push-ups       │  │
│  │ Upper Body  [×]│  │      │  │ Upper Body     │  │
│  └────────────────┘  │      │  │ Today, 10:30am │  │
│  [Add Exercise]      │      │  │ Reps: 20       │  │
│                      │      │  └────────────────┘  │
└──────────────────────┘      └──────────────────────┘

```

## User Flows

### 1. Log an Exercise
```
Home Screen → Tap Exercise → Enter Reps → Log → Success!
```

### 2. Manage Exercise Library
```
Home Screen → Library → Add/Edit/Delete → Save
```

### 3. View History
```
Home Screen → History → See All Logged Exercises
```

## Data Flow

```
LogExerciseScreen
    ↓ loadExerciseLibrary()
Exercise Library (AsyncStorage)
    ↓ Display exercises
User taps exercise
    ↓ Open modal
User enters reps
    ↓ saveExerciseLog()
Exercise Log (AsyncStorage)
    ↓
History Screen displays logs
```

## Key Features

1. **Simple Logging**: Tap exercise → Enter reps → Done
2. **Exercise Management**: Full CRUD on exercise library
3. **History Tracking**: View all logged exercises with timestamps
4. **Offline First**: All data stored locally
5. **Monochromatic Design**: Clean black/white interface
