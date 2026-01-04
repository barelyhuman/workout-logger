import AsyncStorage from '@react-native-async-storage/async-storage';

const EXERCISE_LOG_KEY = '@exercise_log';
const EXERCISE_LIBRARY_KEY = '@exercise_library';
const EXERCISE_LIBRARY_INITIALIZED_KEY = '@exercise_library_initialized';

// Exercise log storage (simplified logging)
export const saveExerciseLog = async (exerciseLog) => {
  try {
    const logs = await loadExerciseLogs();
    logs.unshift(exerciseLog); // Add to beginning
    await AsyncStorage.setItem(EXERCISE_LOG_KEY, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error('Error saving exercise log:', error);
    return false;
  }
};

export const loadExerciseLogs = async () => {
  try {
    const data = await AsyncStorage.getItem(EXERCISE_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading exercise logs:', error);
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

export const isExerciseLibraryInitialized = async () => {
  try {
    const value = await AsyncStorage.getItem(EXERCISE_LIBRARY_INITIALIZED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking exercise library initialization:', error);
    return false;
  }
};

export const setExerciseLibraryInitialized = async () => {
  try {
    await AsyncStorage.setItem(EXERCISE_LIBRARY_INITIALIZED_KEY, 'true');
    return true;
  } catch (error) {
    console.error('Error setting exercise library initialization:', error);
    return false;
  }
};
