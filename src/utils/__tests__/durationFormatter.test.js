import { formatDuration } from '../durationFormatter';

describe('formatDuration', () => {
  describe('invalid input handling', () => {
    it('should return "0s" for invalid string input', () => {
      expect(formatDuration('invalid')).toBe('0s');
    });

    it('should return "0s" for NaN', () => {
      expect(formatDuration(NaN)).toBe('0s');
    });

    it('should return "0s" for negative numbers', () => {
      expect(formatDuration(-5)).toBe('0s');
      expect(formatDuration(-100)).toBe('0s');
    });

    it('should return "0s" for Infinity', () => {
      expect(formatDuration(Infinity)).toBe('0s');
      expect(formatDuration(-Infinity)).toBe('0s');
    });

    it('should return "0s" for null', () => {
      expect(formatDuration(null)).toBe('0s');
    });

    it('should return "0s" for undefined', () => {
      expect(formatDuration(undefined)).toBe('0s');
    });

    it('should return "0s" for objects', () => {
      expect(formatDuration({})).toBe('0s');
      expect(formatDuration([])).toBe('0s');
    });
  });

  describe('valid input formatting', () => {
    it('should format zero seconds', () => {
      expect(formatDuration(0)).toBe('0s');
    });

    it('should format seconds only (less than 60)', () => {
      expect(formatDuration(1)).toBe('1s');
      expect(formatDuration(30)).toBe('30s');
      expect(formatDuration(45)).toBe('45s');
      expect(formatDuration(59)).toBe('59s');
    });

    it('should format exactly 60 seconds as minutes', () => {
      expect(formatDuration(60)).toBe('1m');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(61)).toBe('1m 1s');
      expect(formatDuration(90)).toBe('1m 30s');
      expect(formatDuration(150)).toBe('2m 30s');
      expect(formatDuration(195)).toBe('3m 15s');
    });

    it('should format minutes without seconds when seconds is zero', () => {
      expect(formatDuration(120)).toBe('2m');
      expect(formatDuration(180)).toBe('3m');
      expect(formatDuration(300)).toBe('5m');
      expect(formatDuration(600)).toBe('10m');
    });

    it('should handle large durations', () => {
      expect(formatDuration(3600)).toBe('60m');
      expect(formatDuration(3661)).toBe('61m 1s');
    });
  });
});
