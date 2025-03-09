import { get, post, put } from './apiService';

/**
 * Get the learning path for a specific user from the server API
 * @param {string} userId - The ID of the user
 * @returns {Promise} Promise resolving to the user's learning path or an error
 */
export const getUserLearningPath = async (userId) => {
  try {
    // Make a real API call to the server endpoint
    const response = await get(`/users/${userId}/learning_path`);
    return response;
  } catch (error) {
    console.error('Error fetching user learning path:', error);
    throw error;
  }
};

/**
 * Get learning path for the currently logged-in user
 * @returns {Promise} Promise resolving to the user's learning path
 */
export const getMyLearningPath = async () => {
  try {
    const response = await get('/api/learning_paths/me');
    return response;
  } catch (error) {
    console.error('Error fetching learning path:', error);
    throw error;
  }
};

/**
 * Get learning path for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise} Promise resolving to the learning path data
 */
export const getUserLearningPaths = async (userId) => {
  try {
    const response = await get(`/api/learning_paths/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }
};

/**
 * Create a new learning path
 * @param {Object} learningPathData - Learning path data
 * @returns {Promise} Promise resolving to the created learning path
 */
export const createLearningPath = async (learningPathData) => {
  try {
    const response = await post('/api/learning_paths', learningPathData);
    return response;
  } catch (error) {
    console.error('Error creating learning path:', error);
    throw error;
  }
};

/**
 * Update the learning path for the current user
 * @param {Object} learningPathData - Updated learning path data
 * @returns {Promise} Promise resolving to the updated learning path
 */
export const updateLearningPath = async (learningPathData) => {
  try {
    // Use the put function from apiService instead of direct fetch
    // This will properly handle authentication headers
    const response = await put('/api/learning_paths/update', learningPathData);
    return response;
  } catch (error) {
    console.error('Error updating learning path:', error);
    throw error;
  }
};
