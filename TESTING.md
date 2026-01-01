# Testing Documentation

## Manual Testing Guide

### Prerequisites
- Android device or emulator with Expo Go app installed
- Node.js and npm installed
- Repository cloned and dependencies installed

### Test Environment Setup
```bash
npm install
npm start
```

### Test Cases

#### 1. Home Screen Tests
**Test 1.1: View Default Routines**
- [ ] Launch the app
- [ ] Verify 5 default routines are displayed
- [ ] Verify each routine shows: name, description, exercise count
- [ ] Verify monochromatic theme (black background, white text)

**Test 1.2: Navigation**
- [ ] Tap on a routine card
- [ ] Verify navigation to Routine Detail screen
- [ ] Tap "History" button
- [ ] Verify navigation to History screen
- [ ] Tap "Create New Routine" button
- [ ] Verify navigation to Create Routine screen

**Test 1.3: Delete Routine**
- [ ] Long-press on a routine card
- [ ] Verify delete confirmation dialog appears
- [ ] Test "Cancel" - routine remains
- [ ] Test "Delete" - routine is removed
- [ ] Verify routine no longer appears in list

---

#### 2. Routine Detail Screen Tests
**Test 2.1: Display Routine Information**
- [ ] Navigate to a routine detail
- [ ] Verify routine name is displayed
- [ ] Verify routine description is displayed
- [ ] Verify all exercises are listed with:
  - Exercise name
  - Sets × Reps
  - Rest time
  - Notes (if present)

**Test 2.2: Start Workout**
- [ ] Tap "Start Workout" button
- [ ] Verify navigation to Workout Session screen
- [ ] Verify selected routine is loaded

---

#### 3. Workout Session Screen Tests
**Test 3.1: Exercise Progress**
- [ ] Start a workout
- [ ] Verify current exercise is displayed prominently
- [ ] Verify progress bar shows current position
- [ ] Verify "Exercise X of Y" counter is correct
- [ ] Tap "Complete Exercise"
- [ ] Verify rest timer starts
- [ ] Verify rest time counts down from configured seconds

**Test 3.2: Rest Timer**
- [ ] Complete an exercise
- [ ] Verify rest screen appears with:
  - "Rest Time" title
  - Countdown timer
  - Next exercise name
- [ ] Wait for timer to reach 0
- [ ] Verify automatic progression to next exercise
- [ ] Test "Skip Rest" button
- [ ] Verify immediate progression to next exercise

**Test 3.3: Complete Workout**
- [ ] Complete all exercises in a routine
- [ ] On last exercise, verify "Finish Workout" button appears
- [ ] Tap "Finish Workout"
- [ ] Verify completion dialog shows:
  - Number of exercises completed
  - Total workout duration
- [ ] Tap "OK"
- [ ] Verify navigation back to Home screen

**Test 3.4: Upcoming Exercises**
- [ ] During workout, verify "Upcoming" section displays
- [ ] Verify it shows remaining exercises
- [ ] Verify exercise details are visible

---

#### 4. Create Routine Screen Tests
**Test 4.1: Create Valid Routine**
- [ ] Navigate to Create Routine
- [ ] Enter routine name: "Test Routine"
- [ ] Enter description: "Test description"
- [ ] Verify one exercise form is pre-populated
- [ ] Fill in exercise details:
  - Name: "Test Exercise"
  - Sets: "3"
  - Reps: "10"
  - Rest: "60"
  - Notes: "Test notes"
- [ ] Tap "Save Routine"
- [ ] Verify navigation back to Home
- [ ] Verify new routine appears in list

**Test 4.2: Add Multiple Exercises**
- [ ] Navigate to Create Routine
- [ ] Tap "+ Add" button
- [ ] Verify new exercise form appears
- [ ] Add 3 exercises total
- [ ] Verify all forms are editable
- [ ] Save routine
- [ ] Verify routine saved with all exercises

**Test 4.3: Remove Exercise**
- [ ] Navigate to Create Routine
- [ ] Add 2 exercises
- [ ] Tap "Remove" on second exercise
- [ ] Verify exercise is removed
- [ ] Verify "Remove" is not shown when only 1 exercise remains

**Test 4.4: Validation**
- [ ] Try to save with empty name
- [ ] Verify error alert appears
- [ ] Try to save with empty exercise name
- [ ] Verify error alert appears
- [ ] Verify user cannot proceed until valid

**Test 4.5: Input Fields**
- [ ] Verify all text inputs accept text
- [ ] Verify numeric inputs (sets, rest) only accept numbers
- [ ] Verify multi-line text areas work for description and notes

---

#### 5. History Screen Tests
**Test 5.1: Empty History**
- [ ] Navigate to History before completing any workouts
- [ ] Verify empty state message displays
- [ ] Message: "No workout history yet..."

**Test 5.2: View Completed Workouts**
- [ ] Complete a workout
- [ ] Navigate to History
- [ ] Verify workout appears with:
  - Routine name
  - Date (formatted as "Today", "Yesterday", or date)
  - Duration in minutes
  - Exercise count
  - List of completed exercises

**Test 5.3: Multiple Workouts**
- [ ] Complete multiple workouts
- [ ] Verify they appear in reverse chronological order
- [ ] Verify date formatting is correct for various dates

**Test 5.4: Pull to Refresh**
- [ ] Pull down on history list
- [ ] Verify loading indicator appears
- [ ] Verify list refreshes

---

#### 6. Data Persistence Tests
**Test 6.1: Routine Persistence**
- [ ] Create a custom routine
- [ ] Close the app completely
- [ ] Reopen the app
- [ ] Verify custom routine is still present
- [ ] Verify all routine details are preserved

**Test 6.2: History Persistence**
- [ ] Complete a workout
- [ ] Close the app completely
- [ ] Reopen the app
- [ ] Navigate to History
- [ ] Verify workout is still in history
- [ ] Verify all workout details are preserved

**Test 6.3: Delete and Persistence**
- [ ] Delete a routine
- [ ] Close app and reopen
- [ ] Verify deletion persisted

---

#### 7. UI/UX Tests
**Test 7.1: Monochromatic Theme**
- [ ] Verify all screens use black/white/gray colors only
- [ ] Background: Black (#000000)
- [ ] Text: White (#ffffff) and Gray (#999999, #666666)
- [ ] Borders: Dark gray (#333333)
- [ ] No colors present in the app

**Test 7.2: Touch Targets**
- [ ] Verify all buttons are easily tappable
- [ ] Verify minimum touch target size
- [ ] Test on small and large screens

**Test 7.3: Typography**
- [ ] Verify text is readable on black background
- [ ] Verify font sizes are appropriate
- [ ] Verify hierarchy is clear (titles > headings > body)

**Test 7.4: Layout**
- [ ] Test app in portrait orientation
- [ ] Verify layouts adapt to different screen sizes
- [ ] Verify no content is cut off
- [ ] Verify proper spacing and padding

**Test 7.5: Navigation**
- [ ] Verify back button works on all screens
- [ ] Verify navigation is intuitive
- [ ] Verify no navigation dead ends

---

#### 8. Edge Cases and Error Handling
**Test 8.1: Very Long Names**
- [ ] Create routine with 100+ character name
- [ ] Verify it displays without breaking layout
- [ ] Create exercise with long name
- [ ] Verify layout handles it gracefully

**Test 8.2: Special Characters**
- [ ] Use emojis in routine names
- [ ] Use special characters in notes
- [ ] Verify they save and display correctly

**Test 8.3: Rapid Interactions**
- [ ] Rapidly tap buttons
- [ ] Verify no duplicate actions occur
- [ ] Verify app doesn't crash

**Test 8.4: Zero Values**
- [ ] Try creating exercise with 0 sets
- [ ] Try creating exercise with 0 rest time
- [ ] Verify defaults are applied

---

#### 9. Performance Tests
**Test 9.1: Large Data Sets**
- [ ] Create 20+ routines
- [ ] Verify scrolling is smooth
- [ ] Complete 50+ workouts
- [ ] Verify history loads quickly

**Test 9.2: Workout Session Performance**
- [ ] Create routine with 15+ exercises
- [ ] Start workout
- [ ] Verify smooth transitions between exercises
- [ ] Verify timer accuracy

---

#### 10. Default Routines Content Validation
**Test 10.1: Beginner Full Body**
- [ ] Verify contains: Push-ups, Squats, Plank, Leg Raises, Inverted Rows, Glute Bridges
- [ ] Verify rep ranges are appropriate for beginners
- [ ] Verify notes provide helpful guidance

**Test 10.2: Intermediate Full Body**
- [ ] Verify contains: Diamond Push-ups, Jump Squats, Pike Push-ups, Split Squats, Pull-ups, L-Sit, Dips
- [ ] Verify increased difficulty from beginner

**Test 10.3: Advanced Full Body**
- [ ] Verify contains: Archer Push-ups, Pistol Squats, Handstand Push-ups, Muscle-ups, Dragon Flags, One-Arm Push-ups, Front Lever
- [ ] Verify advanced techniques are included

**Test 10.4: Upper Body Focus**
- [ ] Verify focuses on push-ups, pull-ups, dips variations
- [ ] Verify comprehensive upper body coverage

**Test 10.5: Lower Body Focus**
- [ ] Verify focuses on squats, lunges, calf raises
- [ ] Verify comprehensive lower body coverage

---

## Automated Testing Checklist
(To be implemented in future iterations)
- [ ] Unit tests for storage utilities
- [ ] Unit tests for data transformations
- [ ] Component tests for UI components
- [ ] Integration tests for navigation flow
- [ ] End-to-end tests for critical user journeys

---

## Known Limitations
- App is optimized for portrait orientation only
- No workout editing functionality (users must delete and recreate)
- No exercise reordering in workout creation
- No pause/resume functionality during workouts
- No export/import of routines
- No statistics or analytics
- No workout notes or ratings
- No exercise images or videos
- No workout reminders or scheduling

---

## Bug Report Template
When reporting bugs, include:
1. **Device**: [Android device model and OS version]
2. **Steps to Reproduce**: [Detailed steps]
3. **Expected Behavior**: [What should happen]
4. **Actual Behavior**: [What actually happens]
5. **Screenshots**: [If applicable]
6. **Logs**: [Any error messages]

---

## Test Results Log

| Test Case | Date | Tester | Result | Notes |
|-----------|------|--------|--------|-------|
|           |      |        |        |       |
