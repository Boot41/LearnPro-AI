import { get } from './apiService';

/**
 * Get all employees with their learning progress
 * @returns {Promise} Promise resolving to the list of employees with progress
 */
export const getEmployees = async () => {
  try {
    const response = await get('/api/users/employees');
    return response;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};
