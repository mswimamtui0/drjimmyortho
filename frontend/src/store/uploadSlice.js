import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://drjimmy-backend.onrender.com/api';

export const uploadScan = createAsyncThunk(
  'upload/scan',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/uploads/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    scans: [],
    loading: false,
    error: null,
    uploadProgress: 0
  },
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadScan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadScan.fulfilled, (state, action) => {
        state.loading = false;
        state.scans.unshift(action.payload);
      })
      .addCase(uploadScan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setUploadProgress } = uploadSlice.actions;
export default uploadSlice.reducer;

