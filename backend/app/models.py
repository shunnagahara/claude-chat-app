from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    system: Optional[str] = None

class NewChatRequest(BaseModel):
    system: Optional[str] = None

class ChatResponse(BaseModel):
    role: str
    content: str

class NewChatResponse(BaseModel):
    system: Optional[str]
    messages: List[Message] = []
