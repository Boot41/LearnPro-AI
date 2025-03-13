from abc import ABC, abstractmethod
from agent_prompts import get_study_prompt, get_kt_recieve_prompt
class ChatbotContext(ABC):
    def __init__(self, metadata):
        self.metadata = metadata

    @abstractmethod
    def get_initial_context(self) -> str: 
        pass
        
class SubjectContext(ChatbotContext):
    def get_initial_context(self) -> str: 
        return (get_study_prompt(self.metadata['subject_name'], self.metadata['topic_name']))

class KTRecieveContext(ChatbotContext):
    def get_initial_context(self) -> str: 
        return (get_kt_recieve_prompt(self.metadata['project_name']))


class KTGiveContext(ChatbotContext):
    def get_initial_context(self) -> str: 
        return ("To be implemented")