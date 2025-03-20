import { get, post, del, put } from "./apiService";

/**
 * GitHub Knowledge Transfer Services
 */

// Give KT Services

/**
 * Save GitHub commits to the database
 * @param {Object} commitData - Data containing employee_id, project_id, repo_url, and username
 * @returns {Promise} Promise resolving to the saved commit data
 */
export const saveGitHubCommits = async (commitData) => {
  try {
    const response = await post("/api/give_github_kt/commits", commitData);
    return response;
  } catch (error) {
    console.error('Error saving GitHub commits:', error);
    throw error;
  }
};

/**
 * Get all GitHub KT sessions
 * @returns {Promise} Promise resolving to all GitHub KT sessions
 */
export const getGiveGitHubKt = async () => {
  try {
    const response = await get("/api/give_github_kt/");
    return response;
  } catch (error) {
    console.error('Error fetching GitHub KT sessions:', error);
    throw error;
  }
};

/**
 * Delete a GitHub KT session
 * @param {number} commitId - The ID of the commit to delete
 * @returns {Promise} Promise resolving to the response data
 */
export const removeGitHubKt = async (commitId) => {
  try {
    const response = await del(`/api/give_github_kt/${commitId}`);
    return response;
  } catch (error) {
    console.error('Error removing GitHub KT session:', error);
    throw error;
  }
};

/**
 * Save KT information for a GitHub commit
 * @param {Object} ktInfo - Object containing kt_info and github_commit_id
 * @returns {Promise} Promise resolving to the saved KT info
 */
export const saveGitHubKtInfo = async (ktInfo) => {
  try {
    const response = await post("/api/give_github_kt/save-kt-info", ktInfo);
    return response;
  } catch (error) {
    console.error('Error saving GitHub KT info:', error);
    throw error;
  }
};

/**
 * Get pending GitHub KT assignments
 * @returns {Promise} Promise resolving to pending GitHub KT assignments
 */
export const getPendingGitHubKt = async () => {
  try {
    const response = await get("/api/give_github_kt/pending");
    return response;
  } catch (error) {
    console.error('Error fetching pending GitHub KT assignments:', error);
    throw error;
  }
};

// Take KT Services

/**
 * Create a new Take KT session for GitHub commits
 * @param {Object} takeKtData - Object containing github_commit_id and email
 * @returns {Promise} Promise resolving to the created Take KT session
 */
export const assignTakeGitHubKt = async (takeKtData) => {
  try {
    const response = await post("/api/take_github_kt/", takeKtData);
    return response;
  } catch (error) {
    console.error('Error assigning GitHub Take KT session:', error);
    throw error;
  }
};

/**
 * Get all Take KT sessions for GitHub commits
 * @returns {Promise} Promise resolving to all Take KT sessions
 */
export const getTakeGitHubKt = async () => {
  try {
    const response = await get("/api/take_github_kt/");
    return response;
  } catch (error) {
    console.error('Error fetching GitHub Take KT sessions:', error);
    throw error;
  }
};

/**
 * Delete a Take KT session for GitHub commits
 * @param {number} takeKtId - The ID of the Take KT session to delete
 * @returns {Promise} Promise resolving to the response data
 */
export const deleteTakeGitHubKt = async (takeKtId) => {
  try {
    const response = await del(`/api/take_github_kt/${takeKtId}`);
    return response;
  } catch (error) {
    console.error('Error deleting GitHub Take KT session:', error);
    throw error;
  }
};

/**
 * Get KT details for a specific Take KT session
 * @param {number} takeKtId - The ID of the Take KT session
 * @returns {Promise} Promise resolving to the KT details
 */
export const getGitHubKtDetails = async (takeKtId) => {
  try {
    const response = await get(`/api/take_github_kt/kt-details/${takeKtId}`);
    return response;
  } catch (error) {
    console.error('Error fetching GitHub KT details:', error);
    throw error;
  }
};

/**
 * Mark a Take KT session as completed
 * @param {number} takeKtId - The ID of the Take KT session to mark as completed
 * @returns {Promise} Promise resolving to the response data
 */
export const markGitHubKtCompleted = async (takeKtId) => {
  try {
    const response = await put(`/api/take_github_kt/mark-completed/${takeKtId}`);
    return response;
  } catch (error) {
    console.error('Error marking GitHub KT as completed:', error);
    throw error;
  }
};
