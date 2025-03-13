import { get, del } from "./apiService";
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

export const removeAssignedGiveKt = async (projectId) => {
  try {
    const response = await del(`/api/give_kt/${projectId}`);
    return response;
  } catch (error) {
    console.error('Error removing assigned KT:', error);
    throw error;
  }
};