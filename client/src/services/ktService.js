import { get, post, del } from "./apiService";

export const saveGithubGivenKtTranscripts = async (transcripts,give_kt_id)=>{
  try {
    console.log(give_kt_id)
    const data = {
      "kt_transcripts":transcripts,
      "give_kt_id":give_kt_id
    }
    const response = await post("/api/give_kt/save-kt-info",data) 
    return response
  } catch (error) {
    console.error(error) 
  }
}

export const saveGivenKtTranscripts = async (transcripts,give_kt_id)=>{
  try {
      const data = {
        "kt_transcripts":transcripts,
        give_kt_id
      }
      const response = await post("/api/give_kt/save-kt-info",data) 
      return response
  } catch (error) {
    console.error(error) 
  }
}

/**
 * Get project KT status
 * @returns {Promise} Promise resolving to project KT status
 */
export const getGiveKt = async () => {
  try {
    const response = await get(`/api/give_kt/`);
    return response;
  } catch (error) {
    console.error('Error fetching project KT status:', error);
    throw error;
  }
};

/**
 * Get project KT status
 * @returns {Promise} Promise resolving to project KT status
 */
export const getReceiveKt = async () => {
  try {
    const response = await get(`/api/take_kt/`);
    return response;
  } catch (error) {
    console.error('Error fetching project KT status:', error);
    throw error;
  }
};

/**
 * Set project KT status
 * @param {Object} status - The status to set
 * @returns {Promise} Promise resolving to the response data
 */
export const assignReceiveKt = async (kt) => {
  try {
    const response = await post(`/api/take_kt/`, kt);
    return response;
  } catch (error) {
    console.error('Error setting project KT status:', error);
    throw error;
  }
};

/**
 * Delete project KT status
 * @param {number} take_kt_id - The ID of the project KT status to delete
 * @returns {Promise} Promise resolving to the response data
 */
export const deleteReceiveKt = async (take_kt_id) => {
  try { 
    const response = await del(`/api/take_kt/${take_kt_id}`);
    return response;
  } catch (error) {
    console.error('Error deleting project KT status:', error);
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