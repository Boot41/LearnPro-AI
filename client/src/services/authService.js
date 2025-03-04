/**
 * Authentication service for handling login, logout, and registration
 */
import { post, get } from './apiService';

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's full name
 * @returns {Promise} Promise resolving to the user data
 */
export const registerUser = async (email, password, name) => {
  try {
    const response = await post('/register/', {
      email,
      password,
      name
    });
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Promise resolving to the user data
 */
export const loginUser = async (email, password) => {
  try {
    const response = await post('/login/', {
      email: email,
      password: password
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Check if a user has a learning path
 * @param {string} userId - User ID to check
 * @returns {Promise} Promise resolving to the learning path data
 */
export const checkUserLearningPath = async (userId) => {
  try {
    const response = await get(`/users/${userId}/learning_path/`);
    return response;
  } catch (error) {
    // If 404, user doesn't have a learning path yet
    if (error.message.includes('404')) {
      return { hasLearningPath: false };
    }
    console.error('Learning path check error:', error);
    throw error;
  }
};
