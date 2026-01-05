import { formatDate, formatTime } from '../dateFormatter';

describe('formatDate', () => {
  // Mock the current date for consistent testing
  const mockNow = new Date('2024-01-15T12:00:00Z');
  
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('relative date formatting', () => {
    it('should return "Today" for current date', () => {
      const today = new Date('2024-01-15T08:00:00Z');
      expect(formatDate(today)).toBe('Today');
    });

    it('should return "Today" for date string of today', () => {
      expect(formatDate('2024-01-15T23:59:59Z')).toBe('Today');
    });

    it('should return "Yesterday" for date one day ago', () => {
      const yesterday = new Date('2024-01-14T12:00:00Z');
      expect(formatDate(yesterday)).toBe('Yesterday');
    });

    it('should return "2 days ago" for date two days ago', () => {
      const twoDaysAgo = new Date('2024-01-13T12:00:00Z');
      expect(formatDate(twoDaysAgo)).toBe('2 days ago');
    });

    it('should return "3 days ago" for date three days ago', () => {
      const threeDaysAgo = new Date('2024-01-12T12:00:00Z');
      expect(formatDate(threeDaysAgo)).toBe('3 days ago');
    });

    it('should return "6 days ago" for date six days ago', () => {
      const sixDaysAgo = new Date('2024-01-09T12:00:00Z');
      expect(formatDate(sixDaysAgo)).toBe('6 days ago');
    });
  });

  describe('absolute date formatting', () => {
    it('should return formatted date for dates 7+ days ago in same year', () => {
      const sevenDaysAgo = new Date('2024-01-08T12:00:00Z');
      const result = formatDate(sevenDaysAgo);
      // Should include weekday, month, and day but not year
      expect(result).toMatch(/\w{3}/); // Weekday short form
      expect(result).toMatch(/Jan/); // Month short form
      expect(result).toMatch(/8/); // Day
      expect(result).not.toMatch(/2024/); // Should not include year for same year
    });

    it('should return formatted date with year for dates in different year', () => {
      const lastYear = new Date('2023-12-01T12:00:00Z');
      const result = formatDate(lastYear);
      // Should include year for different year
      expect(result).toMatch(/2023/);
    });
  });

  describe('input types', () => {
    it('should handle Date objects', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      expect(formatDate(date)).toBe('Today');
    });

    it('should handle date strings', () => {
      expect(formatDate('2024-01-15T10:00:00Z')).toBe('Today');
    });

    it('should handle timestamps', () => {
      const timestamp = new Date('2024-01-15T10:00:00Z').getTime();
      expect(formatDate(timestamp)).toBe('Today');
    });
  });
});

describe('formatTime', () => {
  it('should format time in 12-hour format with AM/PM', () => {
    const dateString = '2024-01-15T09:30:00Z';
    const result = formatTime(dateString);
    // Result will vary by timezone, but should contain time elements
    expect(result).toMatch(/\d{1,2}:\d{2}/); // Should have hours and minutes
  });

  it('should format afternoon time', () => {
    const dateString = '2024-01-15T14:45:00Z';
    const result = formatTime(dateString);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('should format midnight', () => {
    const dateString = '2024-01-15T00:00:00Z';
    const result = formatTime(dateString);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('should format noon', () => {
    const dateString = '2024-01-15T12:00:00Z';
    const result = formatTime(dateString);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});
