import { createSlice } from '@reduxjs/toolkit';

const consultationSlice = createSlice({
  name: 'consultation',
  initialState: {
    appointments: [],
    loading: false,
    currentMeeting: null
  },
  reducers: {
    setCurrentMeeting: (state, action) => {
      state.currentMeeting = action.payload;
    }
  }
});

export const { setCurrentMeeting } = consultationSlice.actions;
export default consultationSlice.reducer;

