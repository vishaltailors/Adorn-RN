import React, { useState, useEffect } from 'react';

import LottieView from 'lottie-react-native';
import objectPath from 'object-path';
import { View, ScrollView, Image, Text, Pressable, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Toast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';

import Favourite from '../assets/images/favourite.png';
import FavouriteAnim from '../assets/lottie/favourite.json';
import LoadingAnim from '../assets/lottie/loading.json';
import { getCategoryImages, addToFavourites, removeFromFavourites } from '../store/imageSlice';

const { width, height } = Dimensions.get('window');

// eslint-disable-next-line react/prop-types
const Category = ({ navigation, route }) => {
  const categoryObj = objectPath.get(route, 'params');
  const categoryImages = useSelector((state) => objectPath.get(state, 'image.categoryImages', []));
  const userId = useSelector((state) => objectPath.get(state, 'auth.user.id'));

  const dispatch = useDispatch();

  const [favAnim, setFavAnim] = useState({ id: null, animate: false });
  const [animSpeed, setAnimSpeed] = useState(1);
  const [showLoader, setShowLoader] = useState(true);

  const addToFav = (imageObj) => {
    if (userId) {
      if (imageObj.favouriteOf && Object.keys(imageObj.favouriteOf).length) {
        dispatch(removeFromFavourites({ userId, imageObj })).then(() => {
          dispatch(getCategoryImages(categoryObj.id));
        });
        setAnimSpeed(-1);
        setFavAnim({ id: imageObj.id, animate: true });
      } else {
        setAnimSpeed(1);
        setFavAnim({ id: imageObj.id, animate: true });
        dispatch(addToFavourites({ userId, imageObj })).then(() => {
          dispatch(getCategoryImages(categoryObj.id));
        });
      }
    } else {
      Toast.show('Sign in to add wallpaper to your favourites.');
    }
  };

  useEffect(() => {
    dispatch(getCategoryImages(categoryObj.id)).then(() => {
      setShowLoader(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryObj.id]);

  const thumbWidthPx = Math.round(PixelRatio.getPixelSizeForLayoutSize(width * 0.42));
  const thumbHeightPx = Math.round(PixelRatio.getPixelSizeForLayoutSize(height * 0.28));

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.catTitle}>{categoryObj.name}</Text>
      <Text style={styles.catDesc}>{categoryObj.description}</Text>
      {showLoader ? (
        <LottieView source={LoadingAnim} autoPlay loop style={{ marginTop: 25 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {categoryImages.map((obj) => { 
            let uri;
            if(obj.source.includes('res.cloudinary.com')){
              uri = obj.source.replace(/upload.*\/Adorn/g, `upload/c_fit,h_${thumbHeightPx},w_${thumbWidthPx}/Adorn`)
            }else if(obj.source.includes('ik.imagekit.io')){
              uri = `${obj.source}/tr:h-${thumbHeightPx},w-${thumbWidthPx}`;
            }else {
              uri = obj.source;
            }
            return (
            <Pressable
              key={obj.id}
              style={styles.wallThumbnail}
              onPress={() => navigation.navigate('SetWall', obj)}
              onLongPress={() => addToFav(obj)}
            >
              <Image
                style={styles.wallThumbnail}
                source={{
                  uri,
                }}
                resizeMode='cover'
                backgroundColor='#797979'
              />
              {objectPath.get(obj, ['favouriteOf', userId], false) && (
                <Image source={Favourite} style={styles.favouriteIcon} />
              )}
              {obj.id === favAnim.id && favAnim.animate && (
                <LottieView
                  source={FavouriteAnim}
                  autoPlay
                  loop={false}
                  speed={animSpeed}
                  style={styles.favouriteAnim}
                  onAnimationFinish={() => {
                    setFavAnim({ id: obj.id, animate: false });
                  }}
                />
              )}
            </Pressable>
          )})}
        </ScrollView>
      )}
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  catTitle: {
    fontSize: 35,
    marginTop: 35,
    marginHorizontal: 10,
    color: '#FF5353',
  },
  catDesc: {
    marginHorizontal: 13,
  },
  scrollView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wallThumbnail: {
    position: 'relative',
    borderRadius: 20,
    marginVertical: 8,
    width: width * 0.42,
    height: height * 0.28,
  },
  favouriteIcon: {
    width: 60,
    height: 60,
    zIndex: 2,
    position: 'absolute',
    alignSelf: 'center',
    bottom: '30%',
  },
  favouriteAnim: {
    width: 123,
    height: 123,
    zIndex: 3,
    position: 'absolute',
    alignSelf: 'center',
    bottom: '10%',
  },
});
