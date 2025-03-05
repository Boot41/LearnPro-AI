/**
 * Base API service for making HTTP requests
 */

import { getAuthToken } from '../utils/auth';

// Base URL for API requests
const baseURL = import.meta.env.VITE_BASE_URL || '';

/**
 * Get headers for API requests
 * @returns {Object} Headers object with auth token if available
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch response object
 * @returns {Promise} Promise resolving to response data
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized error
      // You might want to redirect to login or refresh token
      console.error('Unauthorized access');
    }
    throw new Error(`API request failed with status ${response.status}`);
  }

  // Some endpoints (like DELETE) might not return content
  if (response.status === 204) {
    return null;
  }

  return await response.json();
};

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
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return await handleResponse(response);
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
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    return await handleResponse(response);
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
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    return await handleResponse(response);
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
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
