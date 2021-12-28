import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTransition, animated } from '@react-spring/native';
import LottieView from 'lottie-react-native';
import objectPath from 'object-path';
import PropTypes from 'prop-types';
import { ScrollView, Text, Image, TouchableHighlight, StyleSheet, Dimensions } from 'react-native';
import Toast from 'react-native-simple-toast';
import { useSelector, useDispatch } from 'react-redux';

import Favourite from '../assets/images/favourite.png';
import FavouriteAnim from '../assets/lottie/favourite.json';
import { addToFavourites, removeFromFavourites } from '../store/imageSlice';

const { width, height } = Dimensions.get('window');

const ImageSection = ({ sectionTitle, images }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userId = useSelector((state) => objectPath.get(state, 'auth.user.id'));

  const [favAnim, setFavAnim] = useState({ id: null, animate: false });
  const [animSpeed, setAnimSpeed] = useState(1);

  const addToFav = (imageObj) => {
    if (userId) {
      if (imageObj.favouriteOf && Object.keys(imageObj.favouriteOf).length) {
        dispatch(removeFromFavourites({ userId, imageObj }));
        setAnimSpeed(-1);
        setFavAnim({ id: imageObj.id, animate: true });
      } else {
        setAnimSpeed(1);
        setFavAnim({ id: imageObj.id, animate: true });
        dispatch(addToFavourites({ userId, imageObj }));
      }
    } else {
      Toast.show('Sign in to add wallpaper to your favourites.');
    }
  };

  const cardWidth = width * 0.36 + 15; // cardWidth + horizontal-margin
  let totalWidth = 0;

  const transitions = useTransition(
    // eslint-disable-next-line no-return-assign
    images.map((obj) => ({ ...obj, x: (totalWidth += cardWidth) - cardWidth })),
    {
      key: (item) => item.id,
      from: { opacity: 0 },
      leave: { opacity: 0 },
      enter: (item) => ({ x: item.x, opacity: 1 }),
      update: (item) => ({ x: item.x }),
    }
  );

  return (
    <>
      <Text style={[styles.sectionTitle, { marginTop: sectionTitle === 'Newest' ? 0 : 20 }]}>
        {sectionTitle}
      </Text>
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 12,
          width: images.length * cardWidth + 12,
        }}
        style={styles.scrollView}
        horizontal
      >
        {transitions((style, item) => {
          return (
            <animated.View
              style={{
                position: 'absolute',
                left: style.x,
                opacity: style.opacity,
              }}
            >
              <TouchableHighlight
                style={styles.wallThumbnail}
                onPress={() => navigation.navigate('SetWall', item)}
                onLongPress={() => addToFav(item)}
              >
                <>
                  <Image
                    style={styles.wallThumbnail}
                    source={{
                      uri: item.source,
                    }}
                  />
                  {objectPath.get(item, ['favouriteOf', userId], false) && (
                    <Image source={Favourite} style={styles.favouriteIcon} />
                  )}
                  {item.id === favAnim.id && favAnim.animate && (
                    <LottieView
                      source={FavouriteAnim}
                      autoPlay
                      loop={false}
                      speed={animSpeed}
                      style={styles.favouriteAnim}
                      onAnimationFinish={() => {
                        setFavAnim({ id: item.id, animate: false });
                      }}
                    />
                  )}
                </>
              </TouchableHighlight>
            </animated.View>
          );
        })}
      </ScrollView>
    </>
  );
};

ImageSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ImageSection;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    marginHorizontal: 14,
  },
  scrollView: {
    position: 'relative',
    marginTop: 7,
    height: height * 0.24,
  },
  wallThumbnail: {
    position: 'relative',
    borderRadius: 20,
    resizeMode: 'cover',
    width: width * 0.36,
    height: height * 0.24,
    backgroundColor: '#797979',
  },
  favouriteIcon: {
    width: 60,
    height: 60,
    zIndex: 2,
    position: 'absolute',
    alignSelf: 'center',
    bottom: '33%',
  },
  favouriteAnim: {
    width: 123,
    height: 123,
    zIndex: 3,
    position: 'absolute',
    alignSelf: 'center',
    bottom: '9.5%',
  },
});
