import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus } from 'lucide-react';
import { Message } from '../types/chat';
import { chatApi } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const newMessage: Message = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      const response = await chatApi.sendMessage({
        messages: [...messages, newMessage],
        system: systemPrompt || undefined,
      });
      // レスポンスを Message 型に変換して追加
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      await chatApi.newChat({
        system: systemPrompt || undefined,
      });
      setMessages([]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="System prompt (optional)"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 border rounded p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded ${
              message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <div className="font-bold mb-1">
              {message.role === 'user' ? 'You' : 'Claude'}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 italic">Claude is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          <Send size={20} />
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
