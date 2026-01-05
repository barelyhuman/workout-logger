import { defaultExercises } from '../defaultExercises';

describe('defaultExercises', () => {
  it('should be an array', () => {
    expect(Array.isArray(defaultExercises)).toBe(true);
  });

  it('should contain exercises', () => {
    expect(defaultExercises.length).toBeGreaterThan(0);
  });

  describe('exercise structure', () => {
    it('should have all required properties for each exercise', () => {
      defaultExercises.forEach((exercise) => {
        expect(exercise).toHaveProperty('id');
        expect(exercise).toHaveProperty('name');
        expect(exercise).toHaveProperty('category');
        expect(exercise).toHaveProperty('trackingType');
      });
    });

    it('should have unique IDs', () => {
      const ids = defaultExercises.map((ex) => ex.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have non-empty names', () => {
      defaultExercises.forEach((exercise) => {
        expect(exercise.name).toBeTruthy();
        expect(typeof exercise.name).toBe('string');
        expect(exercise.name.length).toBeGreaterThan(0);
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['Upper Body', 'Lower Body', 'Core'];
      defaultExercises.forEach((exercise) => {
        expect(validCategories).toContain(exercise.category);
      });
    });

    it('should have valid tracking types', () => {
      const validTrackingTypes = ['reps', 'duration'];
      defaultExercises.forEach((exercise) => {
        expect(validTrackingTypes).toContain(exercise.trackingType);
      });
    });
  });

  describe('exercise categories', () => {
    it('should have Upper Body exercises', () => {
      const upperBodyExercises = defaultExercises.filter(
        (ex) => ex.category === 'Upper Body'
      );
      expect(upperBodyExercises.length).toBeGreaterThan(0);
    });

    it('should have Lower Body exercises', () => {
      const lowerBodyExercises = defaultExercises.filter(
        (ex) => ex.category === 'Lower Body'
      );
      expect(lowerBodyExercises.length).toBeGreaterThan(0);
    });

    it('should have Core exercises', () => {
      const coreExercises = defaultExercises.filter((ex) => ex.category === 'Core');
      expect(coreExercises.length).toBeGreaterThan(0);
    });
  });

  describe('tracking types', () => {
    it('should have rep-based exercises', () => {
      const repExercises = defaultExercises.filter(
        (ex) => ex.trackingType === 'reps'
      );
      expect(repExercises.length).toBeGreaterThan(0);
    });

    it('should have duration-based exercises', () => {
      const durationExercises = defaultExercises.filter(
        (ex) => ex.trackingType === 'duration'
      );
      expect(durationExercises.length).toBeGreaterThan(0);
    });
  });

  describe('specific exercises', () => {
    it('should include Push-ups', () => {
      const pushups = defaultExercises.find((ex) => ex.name === 'Push-ups');
      expect(pushups).toBeDefined();
      expect(pushups.category).toBe('Upper Body');
      expect(pushups.trackingType).toBe('reps');
    });

    it('should include Pull-ups', () => {
      const pullups = defaultExercises.find((ex) => ex.name === 'Pull-ups');
      expect(pullups).toBeDefined();
      expect(pullups.category).toBe('Upper Body');
      expect(pullups.trackingType).toBe('reps');
    });

    it('should include Plank', () => {
      const plank = defaultExercises.find((ex) => ex.name === 'Plank');
      expect(plank).toBeDefined();
      expect(plank.category).toBe('Core');
      expect(plank.trackingType).toBe('duration');
    });

    it('should include Bodyweight Squats', () => {
      const squats = defaultExercises.find((ex) => ex.name === 'Bodyweight Squats');
      expect(squats).toBeDefined();
      expect(squats.category).toBe('Lower Body');
      expect(squats.trackingType).toBe('reps');
    });
  });
});
