// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// Mock react-native-uuid with crypto-based UUID v4 implementation for Node.js
jest.mock('react-native-uuid', () => ({
  __esModule: true,
  default: {
    v4: () => {
      // Simple UUID v4 implementation for tests using crypto
      const crypto = require('crypto');
      const bytes = crypto.randomBytes(16);
      
      // Set version (4) and variant bits
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      
      // Format as UUID string
      const hex = bytes.toString('hex');
      return [
        hex.substring(0, 8),
        hex.substring(8, 12),
        hex.substring(12, 16),
        hex.substring(16, 20),
        hex.substring(20, 32)
      ].join('-');
    }
  }
}));

// Silence console errors in tests unless they're assertion failures
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
