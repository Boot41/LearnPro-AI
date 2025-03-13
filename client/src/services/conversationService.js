import { post } from "./apiService";
export const getConversationToken = async (email) => {
  try {
    const response = await post(`/generate_token`);
    console.log(response)
    return response;
  } catch (error) {
    console.error('Conversation token error:', error);
    throw error;
  }
};