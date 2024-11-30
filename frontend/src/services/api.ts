import { ChatRequest, ChatResponse, NewChatRequest, NewChatResponse } from '../types/chat';

const API_BASE_URL = 'http://localhost:8000/api';

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },

  async newChat(request: NewChatRequest): Promise<NewChatResponse> {
    const response = await fetch(`${API_BASE_URL}/new-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create new chat');
    }

    return response.json();
  },
};
