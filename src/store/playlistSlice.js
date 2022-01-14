import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlist: {},
};

export const getPlaylistData = createAsyncThunk('playlist/getPlaylistData', async () => {
  const jsonVal = await AsyncStorage.getItem('@playlist');
  return jsonVal ? JSON.parse(jsonVal) : {};
});

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylistData: (state, action) => {
      const jsonPayload = JSON.stringify(action.payload);
      AsyncStorage.setItem('@playlist', jsonPayload);
      state.playlist = action.payload;
    },
  },
  extraReducers: {
    [getPlaylistData.fulfilled]: (state, action) => {
      state.playlist = action.payload;
    },
  },
});

export const { setPlaylistData } = playlistSlice.actions;

export default playlistSlice.reducer;
