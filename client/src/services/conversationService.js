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

export const getLKitTokenGiveKt = async ()=>{
  try{
    const response = await post("/generate_token/give_kt")
    console.log(response)
    return response;
  }catch(error){
    console.error('Conversation token error:',error)
    throw error
  }
}

export const getLKitTokenTakeKt = async ()=>{
  try{
    const response = await post("/generate_token/take_kt")
    console.log(response)
    return response;
  }catch(error){
    console.error('Conversation token error:',error)
    throw error
  }
}