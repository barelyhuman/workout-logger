import { generateId, isUUID } from '../uuid';

describe('uuid utilities', () => {
  describe('generateId', () => {
    it('should generate a valid UUID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(isUUID(id)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs in UUID v4 format', () => {
      const id = generateId();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const parts = id.split('-');
      expect(parts.length).toBe(5);
      expect(parts[0].length).toBe(8);
      expect(parts[1].length).toBe(4);
      expect(parts[2].length).toBe(4);
      expect(parts[3].length).toBe(4);
      expect(parts[4].length).toBe(12);
    });
  });

  describe('isUUID', () => {
    it('should return true for valid UUIDs', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ];

      validUUIDs.forEach(uuid => {
        expect(isUUID(uuid)).toBe(true);
      });
    });

    it('should return false for invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123',
        '',
        '550e8400-e29b-41d4-a716',
        '550e8400-e29b-41d4-a716-446655440000-extra',
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        '1234567890123456789012345678901234567890',
        null,
        undefined,
        123,
        {},
      ];

      invalidUUIDs.forEach(invalid => {
        expect(isUUID(invalid)).toBe(false);
      });
    });

    it('should return false for date-based IDs', () => {
      const dateBased = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      expect(isUUID(dateBased)).toBe(false);
    });

    it('should return false for simple numeric IDs', () => {
      expect(isUUID('1')).toBe(false);
      expect(isUUID('123')).toBe(false);
      expect(isUUID('1234567890')).toBe(false);
    });
  });
});
