module.exports = {
  preset: 'jest-expo',
  
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '(jest-)?react-native|' +
      '@react-native(-community)?|' +
      'expo(nent)?|' +
      '@expo(nent)?/.*|' +
      '@expo-google-fonts/.*|' +
      'react-navigation|' +
      '@react-navigation/.*|' +
      '@unimodules/.*|' +
      'unimodules|' +
      'sentry-expo|' +
      'native-base|' +
      'react-native-svg' +
    '))',
  ],
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/screens/**',
  ],
  
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    './src/utils/**/*.js': {
      statements: 95,
      branches: 95,
      functions: 100,
      lines: 95,
    },
    './src/components/**/*.js': {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
    './src/data/**/*.js': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
