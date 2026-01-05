/**
 * Shared date formatting utilities
 * Handles timezone-aware formatting for both Date objects and ISO strings
 */

/**
 * Format a date to display format (e.g., "Today", "Yesterday", "Jan 5, 2026")
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to midnight for comparison
  const dateStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateStart.getTime() === todayStart.getTime()) {
    return 'Today';
  } else if (dateStart.getTime() === yesterdayStart.getTime()) {
    return 'Yesterday';
  } else {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

/**
 * Format a time to display format (e.g., "2:30 PM")
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format a date to YYYY-MM-DD format for grouping
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateKey = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
