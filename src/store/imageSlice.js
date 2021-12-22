import firestore from '@react-native-firebase/firestore';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import objectPath from 'object-path';

const initialState = {
  imageLoading: false,
  categoryLoading: false,
  images: [],
  categories: [],
  categoryImages: [],
};

export const getImages = createAsyncThunk('image/getImages', async () => {
  const images = [];
  try {
    const snapshot = await firestore().collection('images').get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp.toDate().getTime();
      images.push({
        ...data,
        id: doc.id,
        timestamp,
      });
    });
  } catch (error) {
    console.log(error);
  }
  return images;
});

export const getCategories = createAsyncThunk('image/getCategories', async () => {
  const categories = [];
  try {
    const snapshot = await firestore().collection('categories').get();
    snapshot.forEach((doc) => categories.push({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.log(error);
  }
  return categories;
});

export const getCategoryImages = createAsyncThunk('image/getCategoryImages', async (categoryId) => {
  const images = [];
  try {
    const snapshot = await firestore()
      .collection('images')
      .where('categoryId', '==', categoryId)
      .get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp.toDate().getTime();
      images.push({
        ...data,
        id: doc.id,
        timestamp,
      });
    });
  } catch (error) {
    console.log(error);
  }
  return images;
});

export const addToFavourites = createAsyncThunk(
  'images/addToFavourites',
  async ({ userId, imageObj }) => {
    try {
      const snapshot = await firestore().collection('images').doc(imageObj.id).get();
      const obj = objectPath.get(snapshot.data(), 'favouriteOf', {});
      obj[userId] = true;
      await firestore().collection('images').doc(imageObj.id).update({ favouriteOf: obj });
      return { imageObj, favouriteOf: obj };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);

export const removeFromFavourites = createAsyncThunk(
  'images/removeFromFavourites',
  async ({ userId, imageObj }) => {
    try {
      await firestore()
        .collection('images')
        .doc(imageObj.id)
        .update({ [`favouriteOf.${userId}`]: firestore.FieldValue.delete() });
      return imageObj.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImages: (state, action) => {
      if (action.payload.action === 'added') {
        state.images.push(action.payload.image);
      } else {
        state.images = state.images.filter((obj) => obj.id !== action.payload.image.id);
      }
    },
  },
  extraReducers: {
    [getImages.pending]: (state) => {
      state.imageLoading = true;
    },
    [getImages.fulfilled]: (state, action) => {
      state.images = action.payload;
      state.imageLoading = false;
    },
    [getCategories.pending]: (state) => {
      state.categoryLoading = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.categories = action.payload;
      state.categoryLoading = false;
    },
    [getCategoryImages.fulfilled]: (state, action) => {
      state.categoryImages = action.payload;
    },
    [addToFavourites.fulfilled]: (state, action) => {
      const objIndex = state.images.findIndex((obj) => obj.id === action.payload.imageObj.id);
      state.images[objIndex].favouriteOf = action.payload.favouriteOf;
    },
    [removeFromFavourites.fulfilled]: (state, action) => {
      const objIndex = state.images.findIndex((obj) => obj.id === action.payload);
      state.images[objIndex].favouriteOf = undefined;
    },
  },
});

export const { setImages } = imageSlice.actions;
export default imageSlice.reducer;
