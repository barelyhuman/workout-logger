import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId, isUUID } from './uuid';

const EXERCISE_LOG_KEY = '@exercise_log';
const EXERCISE_LIBRARY_KEY = '@exercise_library';
const EXERCISE_LIBRARY_INITIALIZED_KEY = '@exercise_library_initialized';
const MIGRATION_COMPLETED_KEY = '@migration_to_uuid_completed';

// Migration function to convert existing IDs to UUIDs
export const migrateIdsToUUID = async () => {
  try {
    // Check if migration already completed
    const migrationCompleted = await AsyncStorage.getItem(MIGRATION_COMPLETED_KEY);
    if (migrationCompleted === 'true') {
      return { success: true, alreadyMigrated: true };
    }

    let migratedLogs = 0;
    let migratedExercises = 0;

    // Migrate exercise logs
    const logs = await loadExerciseLogs();
    if (logs.length > 0) {
      const needsMigration = logs.some(log => !isUUID(log.id));
      if (needsMigration) {
        const migratedLogsData = logs.map(log => {
          if (!isUUID(log.id)) {
            migratedLogs++;
            return { ...log, id: generateId(), oldId: log.id };
          }
          return log;
        });
        await AsyncStorage.setItem(EXERCISE_LOG_KEY, JSON.stringify(migratedLogsData));
      }
    }

    // Migrate exercise library
    const exercises = await loadExerciseLibrary();
    if (exercises.length > 0) {
      const needsMigration = exercises.some(ex => !isUUID(ex.id));
      if (needsMigration) {
        const migratedExercisesData = exercises.map(ex => {
          if (!isUUID(ex.id)) {
            migratedExercises++;
            return { ...ex, id: generateId(), oldId: ex.id };
          }
          return ex;
        });
        await AsyncStorage.setItem(EXERCISE_LIBRARY_KEY, JSON.stringify(migratedExercisesData));
      }
    }

    // Mark migration as completed
    await AsyncStorage.setItem(MIGRATION_COMPLETED_KEY, 'true');

    return { 
      success: true, 
      alreadyMigrated: false,
      migratedLogs,
      migratedExercises
    };
  } catch (error) {
    console.error('Error migrating IDs to UUID:', error);
    return { success: false, error: error.message };
  }
};

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

export const updateExerciseLog = async (updatedLog) => {
  try {
    const logs = await loadExerciseLogs();
    const index = logs.findIndex((log) => log.id === updatedLog.id);
    if (index !== -1) {
      logs[index] = updatedLog;
      await AsyncStorage.setItem(EXERCISE_LOG_KEY, JSON.stringify(logs));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating exercise log:', error);
    return false;
  }
};

export const deleteExerciseLog = async (logId) => {
  try {
    const logs = await loadExerciseLogs();
    const filteredLogs = logs.filter((log) => log.id !== logId);
    await AsyncStorage.setItem(EXERCISE_LOG_KEY, JSON.stringify(filteredLogs));
    return true;
  } catch (error) {
    console.error('Error deleting exercise log:', error);
    return false;
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
