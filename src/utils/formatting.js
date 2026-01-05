// Utility functions for formatting and calculations

/**
 * Format duration in seconds to human-readable string
 * @param {number} totalSeconds - Total duration in seconds (must be non-negative integer)
 * @returns {string} Formatted duration (e.g., "2m 30s", "2m", "45s")
 */
export const formatDuration = (totalSeconds) => {
  // Validate input
  if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
    return '0s';
  }
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (minutes > 0 && seconds > 0) {
    return `${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};
