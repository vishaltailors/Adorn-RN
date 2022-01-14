import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import imageReducer from './imageSlice';
import playlistReducer from './playlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    image: imageReducer,
    playlist: playlistReducer,
  },
});
