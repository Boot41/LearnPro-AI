/**
 * Base API service for making HTTP requests
 * This will be used in the future when connecting to real API endpoints
 */

// Base URL for API requests - will be used when connecting to real API
let baseURL = import.meta.env.VITE_BASE_URL;

/**
 * Make a GET request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - Query parameters for the request
 * @returns {Promise} Promise resolving to the response data
 */
export const get = async (endpoint, params = {}) => {
  const url = new URL(`${baseURL}${endpoint}`, window.location.origin);
  
  // Add query parameters
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers when implementing auth
        // 'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - Data to send in the request body
 * @returns {Promise} Promise resolving to the response data
 */
export const post = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers when implementing auth
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Make a PUT request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - Data to send in the request body
 * @returns {Promise} Promise resolving to the response data
 */
export const put = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers when implementing auth
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Make a DELETE request to the API
 * @param {string} endpoint - The API endpoint
 * @returns {Promise} Promise resolving to the response data
 */
export const del = async (endpoint) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers when implementing auth
        // 'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Some DELETE operations may not return content
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
