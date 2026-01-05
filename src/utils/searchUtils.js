/**
 * Filters exercises by name or category based on search query
 * @param {Array} exercisesList - List of exercises to filter
 * @param {string} query - Search query string
 * @returns {Array} Filtered list of exercises
 */
export const applySearchFilter = (exercisesList, query) => {
  if (!query.trim()) {
    return exercisesList;
  }

  const lowercaseQuery = query.toLowerCase();
  return exercisesList.filter((exercise) => {
    const nameMatch = exercise.name.toLowerCase().includes(lowercaseQuery);
    const categoryMatch = exercise.category?.toLowerCase().includes(lowercaseQuery);
    return nameMatch || categoryMatch;
  });
};
