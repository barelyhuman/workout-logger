# UI Flow Diagram - Duration Support Feature

## Exercise Library Screen - Adding/Editing Exercise

```
┌────────────────────────────────────────────┐
│  Exercise Library                          │
├────────────────────────────────────────────┤
│                                            │
│  [Add Exercise] (modal opens)              │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Add Exercise                        │ │
│  │                                      │ │
│  │  Exercise Name *                     │ │
│  │  [e.g., Push-ups              ]     │ │
│  │                                      │ │
│  │  Category                            │ │
│  │  [e.g., Upper Body, Lower Body]     │ │
│  │                                      │ │
│  │  Type                                │ │
│  │  ┌──────────┐  ┌──────────┐        │ │
│  │  │   Reps   │  │ Duration │        │ │
│  │  │  (ACTIVE)│  │ (inactive)│        │ │
│  │  └──────────┘  └──────────┘        │ │
│  │                                      │ │
│  │  [Cancel]         [Save]            │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘

Active button: White background, black text
Inactive button: Dark background, white text
```

## Log Exercise Screen - Reps Exercise

```
┌────────────────────────────────────────────┐
│  Log Exercise                              │
├────────────────────────────────────────────┤
│                                            │
│  (User taps "Push-ups" card)               │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Log Exercise                        │ │
│  │                                      │ │
│  │  Push-ups                            │ │
│  │  Upper Body                          │ │
│  │                                      │ │
│  │  Reps Completed *                    │ │
│  │  [Enter number of reps        ]     │ │
│  │                                      │ │
│  │  [Cancel]         [Log]             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Success alert: "Logged 20 reps of         │
│                  Push-ups"                 │
└────────────────────────────────────────────┘
```

## Log Exercise Screen - Duration Exercise

```
┌────────────────────────────────────────────┐
│  Log Exercise                              │
├────────────────────────────────────────────┤
│                                            │
│  (User taps "Plank" card)                  │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Log Exercise                        │ │
│  │                                      │ │
│  │  Plank                               │ │
│  │  Core                                │ │
│  │                                      │ │
│  │  Duration *                          │ │
│  │  ┌──────────┐  ┌──────────┐        │ │
│  │  │    2     │  │    30    │        │ │
│  │  └──────────┘  └──────────┘        │ │
│  │      min            sec              │ │
│  │                                      │ │
│  │  [Cancel]         [Log]             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Success alert: "Logged 2m 30s of Plank"  │
└────────────────────────────────────────────┘
```

## History Screen - Mixed Exercise Types

```
┌────────────────────────────────────────────┐
│  Exercise History                          │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Plank                    Today       │ │
│  │  Core                     10:30am     │ │
│  │  ─────────────────────────────────   │ │
│  │  Duration: 2m 30s                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Push-ups                 Today       │ │
│  │  Upper Body               10:15am     │ │
│  │  ─────────────────────────────────   │ │
│  │  Reps: 20                            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Wall Sit                 Yesterday   │ │
│  │  Lower Body               6:45pm      │ │
│  │  ─────────────────────────────────   │ │
│  │  Duration: 3m                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  L-Sit Hold               Yesterday   │ │
│  │  Core                     6:30pm      │ │
│  │  ─────────────────────────────────   │ │
│  │  Duration: 45s                       │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

## Color Scheme (Monochromatic)

- Background: Black (#000000)
- Surface/Cards: Dark Gray (#1a1a1a)
- Text: White (#ffffff)
- Secondary Text: Gray (#999999)
- Borders: Dark Gray (#333333)
- Active Button: White background, black text
- Inactive Button: Dark background (#1a1a1a), white text

## Key UI Features

1. **Type Selector (Exercise Library)**
   - Two toggle buttons side-by-side
   - Active state clearly indicated
   - Maintains monochromatic theme
   - Easy to tap on mobile

2. **Duration Inputs (Log Exercise)**
   - Two separate input fields
   - Clear labels below each field
   - Numeric keyboard appears
   - Equal width for visual balance

3. **History Display**
   - Intelligent formatting based on type
   - "Duration: Xm Ys" or "Reps: X"
   - Consistent card layout
   - Easy to scan and read

4. **Validation Feedback**
   - Clear error messages in alerts
   - Specific guidance for each error type
   - Success messages confirm action
   - Shows formatted duration in success

## User Experience Highlights

✅ **Intuitive:** Type selector makes it obvious what kind of exercise it is
✅ **Efficient:** Two inputs for duration allow quick entry
✅ **Clear:** Labels and placeholders guide the user
✅ **Consistent:** Same card design throughout
✅ **Accessible:** Large touch targets, clear contrast
✅ **Minimal:** No clutter, just what's needed
