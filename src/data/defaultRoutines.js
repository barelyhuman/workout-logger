// Well-researched calisthenics workouts for full body training
// These routines follow progressive overload principles and target all major muscle groups

export const defaultRoutines = [
  {
    id: '1',
    name: 'Beginner Full Body',
    description: 'Perfect for beginners, focusing on fundamental movements',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '8-12', rest: 90, notes: 'Can be done on knees if needed' },
      { name: 'Bodyweight Squats', sets: 3, reps: '15-20', rest: 90, notes: 'Focus on form' },
      { name: 'Plank', sets: 3, reps: '30-45s', rest: 60, notes: 'Keep core tight' },
      { name: 'Lying Leg Raises', sets: 3, reps: '10-15', rest: 60, notes: 'Control the movement' },
      { name: 'Inverted Rows', sets: 3, reps: '8-12', rest: 90, notes: 'Use table or bar' },
      { name: 'Glute Bridges', sets: 3, reps: '15-20', rest: 60, notes: 'Squeeze at top' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Intermediate Full Body',
    description: 'Challenging full body routine for intermediate practitioners',
    exercises: [
      { name: 'Diamond Push-ups', sets: 4, reps: '10-15', rest: 90, notes: 'Hands close together' },
      { name: 'Jump Squats', sets: 4, reps: '12-15', rest: 90, notes: 'Land softly' },
      { name: 'Pike Push-ups', sets: 3, reps: '8-12', rest: 90, notes: 'Shoulder focus' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 each', rest: 90, notes: 'Per leg' },
      { name: 'Pull-ups', sets: 4, reps: '5-10', rest: 120, notes: 'Full range of motion' },
      { name: 'L-Sit Hold', sets: 3, reps: '15-30s', rest: 60, notes: 'Core strength' },
      { name: 'Dips', sets: 3, reps: '8-12', rest: 90, notes: 'Use parallel bars or chairs' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Advanced Full Body',
    description: 'High intensity full body routine for advanced athletes',
    exercises: [
      { name: 'Archer Push-ups', sets: 4, reps: '8-10 each', rest: 90, notes: 'Per side' },
      { name: 'Pistol Squats', sets: 3, reps: '5-8 each', rest: 120, notes: 'Single leg squats' },
      { name: 'Handstand Push-ups', sets: 3, reps: '5-8', rest: 120, notes: 'Against wall if needed' },
      { name: 'Muscle-ups', sets: 3, reps: '3-5', rest: 180, notes: 'Explosive pull to dip' },
      { name: 'Dragon Flags', sets: 3, reps: '5-8', rest: 120, notes: 'Advanced core' },
      { name: 'One-Arm Push-ups', sets: 3, reps: '5-8 each', rest: 120, notes: 'Per side' },
      { name: 'Front Lever Hold', sets: 3, reps: '10-20s', rest: 120, notes: 'Advanced pull strength' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Upper Body Focus',
    description: 'Concentrated upper body strength and hypertrophy',
    exercises: [
      { name: 'Regular Push-ups', sets: 4, reps: '15-20', rest: 60, notes: 'Chest, triceps, shoulders' },
      { name: 'Wide Push-ups', sets: 3, reps: '12-15', rest: 60, notes: 'Chest emphasis' },
      { name: 'Close-Grip Push-ups', sets: 3, reps: '12-15', rest: 60, notes: 'Triceps emphasis' },
      { name: 'Pull-ups', sets: 4, reps: '6-10', rest: 90, notes: 'Back and biceps' },
      { name: 'Chin-ups', sets: 3, reps: '6-10', rest: 90, notes: 'Biceps emphasis' },
      { name: 'Pike Push-ups', sets: 3, reps: '10-15', rest: 60, notes: 'Shoulders' },
      { name: 'Dips', sets: 4, reps: '10-15', rest: 90, notes: 'Triceps and chest' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Lower Body Focus',
    description: 'Leg and glute strength development',
    exercises: [
      { name: 'Bodyweight Squats', sets: 4, reps: '20-25', rest: 60, notes: 'Full range of motion' },
      { name: 'Walking Lunges', sets: 3, reps: '15-20 each', rest: 60, notes: 'Maintain balance' },
      { name: 'Jump Squats', sets: 3, reps: '15-20', rest: 90, notes: 'Explosive power' },
      { name: 'Single Leg Deadlifts', sets: 3, reps: '12-15 each', rest: 60, notes: 'Balance and hamstrings' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '12-15 each', rest: 90, notes: 'Rear foot elevated' },
      { name: 'Calf Raises', sets: 4, reps: '20-25', rest: 45, notes: 'Can do single leg' },
      { name: 'Wall Sit', sets: 3, reps: '45-60s', rest: 60, notes: 'Isometric hold' },
    ],
    createdAt: new Date().toISOString(),
  },
];
