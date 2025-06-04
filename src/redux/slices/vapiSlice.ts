import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VapiState {
  assistant: {
    id: string;
    name: string;
    prompt: string;
  } | null;
  generatedPrompt: string | null;
  loading: boolean;
  error: string | null;
  knowledgeBaseId: string | null;
}

const initialState: VapiState = {
  assistant: null,
  generatedPrompt: null,
  loading: false,
  error: null,
  knowledgeBaseId: null,
};

const vapiSlice = createSlice({
  name: 'vapi',
  initialState,
  reducers: {
    setAssistant: (state, action: PayloadAction<VapiState['assistant']>) => {
      state.assistant = action.payload;
    },
    setGeneratedPrompt: (state, action: PayloadAction<string | null>) => {
      state.generatedPrompt = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setKnowledgeBaseId: (state, action: PayloadAction<string | null>) => {
      state.knowledgeBaseId = action.payload;
    },
    clearVapiState: () => initialState,
  },
});

export const {
  setAssistant,
  setGeneratedPrompt,
  setLoading,
  setError,
  setKnowledgeBaseId,
  clearVapiState,
} = vapiSlice.actions;

export default vapiSlice.reducer; 