# Per-Set Tracking Feature

## Overview
This feature enhances the workout tracking experience by allowing users to complete and track each set individually, with rest timers showing between every set rather than just between exercises.

## User Experience Improvements

### Before (Exercise-Level Tracking)
```
Exercise 1: Push-ups (3 sets × 12 reps, 90s rest)
├─ User does all 3 sets
├─ User enters reps for all sets at once: [12, 11, 10]
└─ Rest 90 seconds before next exercise
```

### After (Set-Level Tracking)  
```
Exercise 1: Push-ups (3 sets × 12 reps, 90s rest)
├─ Set 1
│  ├─ User completes set 1
│  ├─ User enters reps: 12
│  └─ Rest 90 seconds
├─ Set 2
│  ├─ User completes set 2
│  ├─ User enters reps: 11
│  └─ Rest 90 seconds
└─ Set 3
   ├─ User completes set 3
   ├─ User enters reps: 10
   └─ Rest 90 seconds before next exercise
```

## UI Components

### 1. Set Progress Indicator
Visual display showing all sets for the current exercise:

```
Set 1 of 3

┌───┐  ┌───┐  ┌───┐
│ 1 │  │ 2 │  │ 3 │
└───┘  └───┘  └───┘
  ✓   current  pending
```

**Visual States**:
- **Completed Set**: White circle, black text (filled)
- **Current Set**: White border, gray background
- **Pending Set**: Gray circle, gray text

### 2. Completed Sets Summary
Shows reps completed for previous sets:

```
┌────────────────────────────────────┐
│ Completed: Set 1: 12, Set 2: 11   │
└────────────────────────────────────┘
```

### 3. Rep Entry Modal (Simplified)
Modal now shows one set at a time:

```
┌──────────────────────────────┐
│  Enter Reps Completed        │
│  Push-ups - Set 2 of 3       │
│                              │
│         Reps:                │
│      ┌──────────┐            │
│      │    12    │            │
│      └──────────┘            │
│                              │
│  [Cancel]    [Confirm]       │
└──────────────────────────────┘
```

### 4. Rest Timer Between Sets
Rest screen shows which set is next:

```
┌────────────────────────────────┐
│       REST TIME                │
│                                │
│          90                    │
│        seconds                 │
│                                │
│ ───────────────────────────── │
│                                │
│  Next: Set 3 of Push-ups       │
│                                │
│      [Skip Rest]               │
└────────────────────────────────┘
```

## Technical Implementation

### State Management
```javascript
// New state variables
const [currentSetIndex, setCurrentSetIndex] = useState(0);
const [currentExerciseReps, setCurrentExerciseReps] = useState([]);

// Derived values
const totalSets = currentExercise?.sets || 3;
const isLastSet = currentSetIndex === totalSets - 1;
```

### Completion Flow
```javascript
handleCompleteSet() {
  // Show modal for current set only
  setShowRepsModal(true);
}

handleConfirmSetReps(reps) {
  // Store reps for this set
  currentExerciseReps[currentSetIndex] = reps;
  
  if (isLastSet) {
    // Complete exercise and move to next
    completeExercise();
  } else {
    // Start rest before next set
    startRestTimer();
  }
}
```

### Automatic Advancement
```javascript
// After rest ends
useEffect(() => {
  if (!isResting && restTimeRemaining === 0) {
    if (isLastSet && justCompletedSet) {
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
    } else if (justCompletedSet) {
      // Move to next set
      setCurrentSetIndex(prev => prev + 1);
    }
  }
}, [isResting, restTimeRemaining]);
```

## Data Structure

### Workout History (Unchanged)
The data structure for workout history remains the same, ensuring backward compatibility:

```javascript
{
  id: "1704892800000",
  routineName: "Beginner Full Body",
  exercises: [
    {
      name: "Push-ups",
      sets: 3,
      reps: "8-12",
      rest: 90,
      skipped: false,
      actualReps: ["12", "11", "10"]  // Per-set reps
    }
  ],
  duration: 25,
  completedAt: "2024-01-10T10:30:00.000Z"
}
```

## Benefits

### For Users
1. **Better Pacing**: Rest between each set, not just exercises
2. **Accurate Tracking**: Record exact reps per set as you go
3. **Visual Feedback**: See progress through each exercise with set indicators
4. **Flexibility**: Skip rest if you're ready, or take the full time
5. **Motivation**: Clear visual of sets completed vs remaining

### For Developers
1. **Granular Data**: Per-set tracking enables better analytics
2. **State Management**: Clean separation of set vs exercise completion
3. **Extensibility**: Easy to add per-set notes, timers, or other features
4. **Backward Compatible**: History data structure unchanged

## Edge Cases Handled

1. **Skip Exercise**: Resets set index and clears reps for new exercise
2. **Skip Rest (Between Sets)**: Advances to next set immediately
3. **Skip Rest (Between Exercises)**: Advances to next exercise immediately
4. **Last Set of Last Exercise**: Shows "Finish Workout" button
5. **Manual Rep Entry**: Pre-fills with planned reps, allows editing
6. **Completed Sets Display**: Only shows previous sets, not current

## Testing Checklist

- [x] Set indicators display correctly
- [x] Completed/current/pending states are visually distinct
- [x] Rep entry modal shows correct set number
- [x] Rest timer starts after each set
- [x] Rest timer shows correct "next" information
- [x] Skip rest advances correctly
- [x] Automatic advancement works after rest
- [x] Last set completes exercise properly
- [x] Last set of last exercise finishes workout
- [x] Completed sets summary displays accurately
- [x] Skip exercise resets state correctly

## Future Enhancements

Potential improvements for future iterations:

1. **Per-Set Notes**: Add notes or comments for specific sets
2. **Rest Time Adjustment**: Allow custom rest time per set
3. **Audio/Vibration Alerts**: Notify when rest timer ends
4. **Progressive Overload Tracking**: Compare sets to previous workouts
5. **Set Templates**: Pre-fill reps based on previous performance
6. **Advanced Rest Strategies**: Decreasing rest times, drop sets, etc.
7. **Per-Set Difficulty Rating**: Track perceived exertion
8. **Video Guides**: Link to form videos for each set

## Conclusion

The per-set tracking feature significantly improves the workout experience by providing:
- ✅ Granular control over workout progression
- ✅ Better rest management between sets
- ✅ Clear visual feedback on progress
- ✅ Accurate per-set rep tracking
- ✅ Maintained minimal, clean UI design
- ✅ Backward compatible data structure

This feature makes the app more aligned with how users naturally perform workouts, tracking each set as it happens rather than trying to remember all reps at the end of an exercise.
