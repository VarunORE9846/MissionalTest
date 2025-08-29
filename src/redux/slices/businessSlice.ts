import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BusinessProfile {
  place_id?: string;
  name: string;
  address: string;
  icon?: string;
  phone?: string;
  website?: string;
  overview?: string;
  business_status?: string;
  types?: string[];
  url?: string;
  service_times?: string[];
}

interface BusinessState {
  selected: BusinessProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  selected: null,
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessProfile: (state, action: PayloadAction<BusinessProfile>) => {
      state.selected = action.payload;
      state.error = null;
    },
    clearBusinessProfile: (state) => {
      state.selected = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setBusinessProfile,
  clearBusinessProfile,
  setLoading,
  setError,
} = businessSlice.actions;

export default businessSlice.reducer; 