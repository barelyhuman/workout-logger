import uuid from 'react-native-uuid';

/**
 * Generate a unique identifier using UUID v4
 * @returns {string} A UUID string
 */
export const generateId = () => {
  return uuid.v4();
};

/**
 * Check if a string is a valid UUID format
 * @param {string} id - The ID to check
 * @returns {boolean} True if valid UUID format
 */
export const isUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidRegex.test(id);
};
