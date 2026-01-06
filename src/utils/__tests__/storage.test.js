import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveExerciseLog,
  loadExerciseLogs,
  updateExerciseLog,
  deleteExerciseLog,
  saveExerciseLibrary,
  loadExerciseLibrary,
  isExerciseLibraryInitialized,
  setExerciseLibraryInitialized,
  migrateIdsToUUID,
} from '../storage';
import { isUUID } from '../uuid';

// Mock uuid module
jest.mock('../uuid', () => ({
  generateId: jest.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)),
  isUUID: jest.fn((id) => typeof id === 'string' && id.startsWith('mock-uuid-')),
}));

// Mock console methods to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('storage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset mock implementations
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue();
    AsyncStorage.removeItem.mockResolvedValue();
  });

  describe('saveExerciseLog', () => {
    it('should save a new exercise log to empty storage', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockResolvedValueOnce();

      const newLog = {
        id: '1',
        exercise: 'Push-ups',
        reps: 20,
        timestamp: new Date().toISOString(),
      };

      const result = await saveExerciseLog(newLog);

      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@exercise_log');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@exercise_log',
        JSON.stringify([newLog])
      );
    });

    it('should add new log to beginning of existing logs', async () => {
      const existingLogs = [
        { id: '1', exercise: 'Pull-ups', reps: 10 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingLogs));
      AsyncStorage.setItem.mockResolvedValueOnce();

      const newLog = { id: '2', exercise: 'Push-ups', reps: 20 };
      const result = await saveExerciseLog(newLog);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@exercise_log',
        JSON.stringify([newLog, ...existingLogs])
      );
    });

    it('should return false on error', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await saveExerciseLog({ id: '1', exercise: 'Push-ups' });

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('loadExerciseLogs', () => {
    it('should return empty array when no logs exist', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await loadExerciseLogs();

      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@exercise_log');
    });

    it('should return parsed logs when logs exist', async () => {
      const logs = [
        { id: '1', exercise: 'Push-ups', reps: 20 },
        { id: '2', exercise: 'Pull-ups', reps: 10 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(logs));

      const result = await loadExerciseLogs();

      expect(result).toEqual(logs);
    });

    it('should return empty array on error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await loadExerciseLogs();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateExerciseLog', () => {
    it('should update existing log', async () => {
      const logs = [
        { id: '1', exercise: 'Push-ups', reps: 20 },
        { id: '2', exercise: 'Pull-ups', reps: 10 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(logs));
      AsyncStorage.setItem.mockResolvedValueOnce();

      const updatedLog = { id: '1', exercise: 'Push-ups', reps: 25 };
      const result = await updateExerciseLog(updatedLog);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@exercise_log',
        JSON.stringify([updatedLog, logs[1]])
      );
    });

    it('should return false when log not found', async () => {
      const logs = [{ id: '1', exercise: 'Push-ups', reps: 20 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(logs));

      const updatedLog = { id: '999', exercise: 'Squats', reps: 30 };
      const result = await updateExerciseLog(updatedLog);

      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should return false on error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await updateExerciseLog({ id: '1', exercise: 'Push-ups' });

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteExerciseLog', () => {
    it('should delete log by id', async () => {
      const logs = [
        { id: '1', exercise: 'Push-ups', reps: 20 },
        { id: '2', exercise: 'Pull-ups', reps: 10 },
        { id: '3', exercise: 'Squats', reps: 15 },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(logs));
      AsyncStorage.setItem.mockResolvedValueOnce();

      const result = await deleteExerciseLog('2');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@exercise_log',
        JSON.stringify([logs[0], logs[2]])
      );
    });

    it('should handle deletion of non-existent log', async () => {
      const logs = [{ id: '1', exercise: 'Push-ups', reps: 20 }];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(logs));
      AsyncStorage.setItem.mockResolvedValueOnce();

      const result = await deleteExerciseLog('999');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@exercise_log',
        JSON.stringify(logs)
      );
    });

    it('should return false on error', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await deleteExerciseLog('1');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('saveExerciseLibrary', () => {
    it('should save exercise library', async () => {
      AsyncStorage.setItem.mockResolvedValueOnce();

      const exercises = [
        { id: '1', name: 'Push-ups', category: 'Upper Body' },
        { id: '2', name: 'Squats', category: 'Lower Body' },
      ];

      const result = await saveExerciseLibrary(exercises);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@exercise_library',
        JSON.stringify(exercises)
      );
    });

    it('should return false on error', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await saveExerciseLibrary([]);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('loadExerciseLibrary', () => {
    it('should return empty array when no library exists', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await loadExerciseLibrary();

      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@exercise_library');
    });

    it('should return parsed library when it exists', async () => {
      const exercises = [
        { id: '1', name: 'Push-ups', category: 'Upper Body' },
        { id: '2', name: 'Squats', category: 'Lower Body' },
      ];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(exercises));

      const result = await loadExerciseLibrary();

      expect(result).toEqual(exercises);
    });

    it('should return empty array on error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await loadExerciseLibrary();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('isExerciseLibraryInitialized', () => {
    it('should return true when library is initialized', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('true');

      const result = await isExerciseLibraryInitialized();

      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@exercise_library_initialized');
    });

    it('should return false when library is not initialized', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await isExerciseLibraryInitialized();

      expect(result).toBe(false);
    });

    it('should return false when value is not "true"', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('false');

      const result = await isExerciseLibraryInitialized();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await isExerciseLibraryInitialized();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('setExerciseLibraryInitialized', () => {
    it('should set library as initialized', async () => {
      AsyncStorage.setItem.mockResolvedValueOnce();

      const result = await setExerciseLibraryInitialized();

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@exercise_library_initialized',
        'true'
      );
    });

    it('should return false on error', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await setExerciseLibraryInitialized();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('migrateIdsToUUID', () => {
    beforeEach(() => {
      // Reset the isUUID mock for each test
      isUUID.mockImplementation((id) => typeof id === 'string' && id.startsWith('mock-uuid-'));
    });

    it('should skip migration if already completed', async () => {
      AsyncStorage.getItem.mockImplementation(async (key) => {
        if (key === '@migration_to_uuid_completed') return 'true';
        return null;
      });

      const result = await migrateIdsToUUID();

      expect(result.success).toBe(true);
      expect(result.alreadyMigrated).toBe(true);
    });

    it('should migrate exercise logs with non-UUID IDs', async () => {
      const oldLogs = [
        { id: '1234567890', exercise: 'Push-ups', reps: 20 },
        { id: 'mock-uuid-abc', exercise: 'Pull-ups', reps: 10 },
      ];

      AsyncStorage.getItem.mockImplementation(async (key) => {
        if (key === '@migration_to_uuid_completed') return null;
        if (key === '@exercise_log') return JSON.stringify(oldLogs);
        if (key === '@exercise_library') return JSON.stringify([]);
        return null;
      });

      const result = await migrateIdsToUUID();

      expect(result.success).toBe(true);
      expect(result.alreadyMigrated).toBe(false);
      expect(result.migratedLogs).toBe(1);
      
      // Check that setItem was called with migrated data
      const setItemCalls = AsyncStorage.setItem.mock.calls;
      const logSetCall = setItemCalls.find(call => call[0] === '@exercise_log');
      expect(logSetCall).toBeDefined();
      
      const migratedLogs = JSON.parse(logSetCall[1]);
      expect(migratedLogs[0].oldId).toBe('1234567890');
      expect(migratedLogs[1].id).toBe('mock-uuid-abc');
    });

    it('should migrate exercise library with non-UUID IDs', async () => {
      const oldExercises = [
        { id: '1', name: 'Push-ups', category: 'Upper Body' },
        { id: 'mock-uuid-xyz', name: 'Squats', category: 'Lower Body' },
      ];

      AsyncStorage.getItem.mockImplementation(async (key) => {
        if (key === '@migration_to_uuid_completed') return null;
        if (key === '@exercise_log') return JSON.stringify([]);
        if (key === '@exercise_library') return JSON.stringify(oldExercises);
        return null;
      });

      const result = await migrateIdsToUUID();

      expect(result.success).toBe(true);
      expect(result.migratedExercises).toBe(1);
      
      const setItemCalls = AsyncStorage.setItem.mock.calls;
      const exerciseSetCall = setItemCalls.find(call => call[0] === '@exercise_library');
      expect(exerciseSetCall).toBeDefined();
      
      const migratedExercises = JSON.parse(exerciseSetCall[1]);
      expect(migratedExercises[0].oldId).toBe('1');
      expect(migratedExercises[1].id).toBe('mock-uuid-xyz');
    });

    it('should mark migration as completed', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      await migrateIdsToUUID();

      const setItemCalls = AsyncStorage.setItem.mock.calls;
      const migrationFlagCall = setItemCalls.find(
        call => call[0] === '@migration_to_uuid_completed' && call[1] === 'true'
      );
      expect(migrationFlagCall).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const result = await migrateIdsToUUID();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    it('should skip migration if all IDs are already UUIDs', async () => {
      const uuidLogs = [
        { id: 'mock-uuid-abc', exercise: 'Push-ups', reps: 20 },
        { id: 'mock-uuid-def', exercise: 'Pull-ups', reps: 10 },
      ];

      AsyncStorage.getItem.mockImplementation(async (key) => {
        if (key === '@migration_to_uuid_completed') return null;
        if (key === '@exercise_log') return JSON.stringify(uuidLogs);
        if (key === '@exercise_library') return JSON.stringify([]);
        return null;
      });

      const result = await migrateIdsToUUID();

      expect(result.success).toBe(true);
      expect(result.migratedLogs).toBe(0);
      
      // Should still mark migration as completed
      const setItemCalls = AsyncStorage.setItem.mock.calls;
      const migrationFlagCall = setItemCalls.find(
        call => call[0] === '@migration_to_uuid_completed'
      );
      expect(migrationFlagCall).toBeDefined();
    });
  });
});
