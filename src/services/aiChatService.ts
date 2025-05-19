
import api from './api';

export interface AIChatResponse {
  answer: string;
}

export const aiChatService = {
  // This matches the API spec POST /ai-chat/ask
  askQuestion: async (question: string): Promise<AIChatResponse> => {
    const formData = new FormData();
    formData.append('question', question);
    
    const response = await api.post('/ai-chat/ask', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  }
};
