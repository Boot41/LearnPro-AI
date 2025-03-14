import { get, post, del } from "./apiService";

/**
 * Get project KT status
 * @returns {Promise} Promise resolving to project KT status
 */
export const getKtStatus = async () => {
  try {
    const response = await get(`/api/give_kt/`);
    return response;
  } catch (error) {
    console.error('Error fetching project KT status:', error);
    throw error;
  }
};

/**
 * Remove an assigned KT session by project ID
 * @param {number} projectId - The ID of the project to remove
 * @returns {Promise} Promise resolving to the response data
 */

export const removeAssignedGiveKt = async (projectId) => {
  try {
    const response = await del(`/api/give_kt/${projectId}`);
    return response;
  } catch (error) {
    console.error('Error removing assigned KT:', error);
    throw error;
  }
};

/**
 * Assign a project to an employee
 * @param {Object} employeeData - Employee data including employee id and project id
 * @returns {Promise} Promise resolving to the assigned project data
 */

export const assignGiveKt = async (employeeData) => {
  try {
    const response = await post(`/api/give_kt/`, employeeData);
    return response;
  } catch (error) {
    console.error('Error assigning KT:', error);
    throw error;
  }
};