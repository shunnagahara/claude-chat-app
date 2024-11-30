export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  system?: string;
}

export interface NewChatRequest {
  system?: string;
}

export interface ChatResponse {
  role: 'assistant';
  content: string;
}

export interface NewChatResponse {
  system?: string;
  messages: Message[];
}
