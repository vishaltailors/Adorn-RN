import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import imageReducer from './imageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    image: imageReducer,
  },
});
