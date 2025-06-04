import axios from 'axios';

const vapiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VAPI_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VAPI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface CreateAssistantPayload {
  name: string;
  model: {
    provider: string;
    model: string;
    messages: Array<{
      role: string;
      content: string;
    }>;
  };
  knowledgeBaseId?: string;
}

export interface AssistantResponse {
  id: string;
  name: string;
  model: {
    provider: string;
    model: string;
  };
  knowledgeBaseId?: string;
  createdAt: string;
  updatedAt: string;
}

export const vapiService = {
  createAssistant: async (payload: CreateAssistantPayload): Promise<AssistantResponse> => {
    const response = await vapiClient.post('/assistant', payload);
    return response.data;
  },

  uploadFile: async (file: File): Promise<{ id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await vapiClient.post('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createKnowledgeBase: async (fileId: string): Promise<{ id: string }> => {
    const response = await vapiClient.post('/knowledge-base', {
      fileId,
    });
    return response.data;
  },
}; 