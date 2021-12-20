import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { authenticate } = authSlice.actions;

export default authSlice.reducer;
