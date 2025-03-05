// Key for storing the auth token in localStorage
const TOKEN_KEY = 'auth_token';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The token to store
 */
export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user has a token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
