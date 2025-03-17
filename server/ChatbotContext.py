from abc import ABC, abstractmethod
from agent_prompts import get_study_prompt, get_kt_recieve_prompt, get_kt_give_prompt
from utils.voice_bot_utils import get_kt_info_for_user

class ChatbotContext(ABC):
    def __init__(self, metadata):
        self.metadata = metadata

    @abstractmethod
    async def get_initial_context(self) -> str: 
        pass
        
class SubjectContext(ChatbotContext):
    async def get_initial_context(self) -> str: 
        return (get_study_prompt(self.metadata['subject_name'], self.metadata['topic_name']))

class KTRecieveContext(ChatbotContext):
    async def get_initial_context(self) -> str: 
        return (get_kt_recieve_prompt(self.metadata['project_name']))


class KTGiveContext(ChatbotContext):
    async def get_initial_context(self) -> str: 
        kt_content = await get_kt_info_for_user(self.metadata["user_id"])
        transcript = kt_content.kt_info
        prompt = get_kt_give_prompt(transcript,self.metadata["project_name"])
        return (prompt)