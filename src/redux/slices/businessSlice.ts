import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BusinessProfile {
  place_id: string;
  name: string;
  address: string;
  icon?: string;
}

interface BusinessState {
  selected: BusinessProfile | null;
}

const initialState: BusinessState = {
  selected: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessProfile(state, action: PayloadAction<BusinessProfile>) {
      state.selected = action.payload;
    },
    clearBusinessProfile(state) {
      state.selected = null;
    },
  },
});

export const { setBusinessProfile, clearBusinessProfile } = businessSlice.actions;
export default businessSlice.reducer; 