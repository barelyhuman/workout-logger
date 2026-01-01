import AsyncStorage from '@react-native-async-storage/async-storage';

const ROUTINES_KEY = '@workout_routines';
const WORKOUT_HISTORY_KEY = '@workout_history';
const EXERCISE_LIBRARY_KEY = '@exercise_library';

// Routines storage
export const saveRoutines = async (routines) => {
  try {
    await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
    return true;
  } catch (error) {
    console.error('Error saving routines:', error);
    return false;
  }
};

export const loadRoutines = async () => {
  try {
    const data = await AsyncStorage.getItem(ROUTINES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading routines:', error);
    return [];
  }
};

// Workout history storage
export const saveWorkoutToHistory = async (workout) => {
  try {
    const history = await loadWorkoutHistory();
    history.unshift(workout); // Add to beginning
    await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving workout to history:', error);
    return false;
  }
};

export const loadWorkoutHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading workout history:', error);
    return [];
  }
};

// Exercise library storage
export const saveExerciseLibrary = async (exercises) => {
  try {
    await AsyncStorage.setItem(EXERCISE_LIBRARY_KEY, JSON.stringify(exercises));
    return true;
  } catch (error) {
    console.error('Error saving exercise library:', error);
    return false;
  }
};

export const loadExerciseLibrary = async () => {
  try {
    const data = await AsyncStorage.getItem(EXERCISE_LIBRARY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading exercise library:', error);
    return [];
  }
};
