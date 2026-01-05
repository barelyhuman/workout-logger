/**
 * Formats duration from total seconds to human-readable string
 * @param {number} totalSeconds - Total duration in seconds
 * @returns {string} Formatted duration string (e.g., "30s", "2m", "2m 30s")
 */
export const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};
