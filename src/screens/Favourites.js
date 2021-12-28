import React from 'react';

import { Transition, animated } from '@react-spring/native';
import objectPath from 'object-path';
import { View, ScrollView, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import LoginWarn from '../assets/images/login-warn-fav.png';
import NoFavourites from '../assets/images/no-favourites.png';
import { removeFromFavourites } from '../store/imageSlice';

const { width, height } = Dimensions.get('window');

const Favourites = ({ navigation }) => {
  const userId = useSelector((state) => objectPath.get(state, 'auth.user.id'));
  const images = useSelector((state) => objectPath.get(state, 'image.images', []));
  const favImages = images.filter((obj) => objectPath.get(obj, ['favouriteOf', userId], false));

  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.favTitle}>Favourites</Text>
      <Text style={styles.favDesc}>
        Theses are the walls that is regarded by you with special favor or liking.
      </Text>
      {!userId ? (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={LoginWarn} />
          <Text style={{ textAlign: 'center', marginHorizontal: 10 }}>
            In order to save your favourites images, Please signin first from settings.
          </Text>
        </View>
      ) : !favImages.length ? (
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={NoFavourites} />
          <Text style={{ textAlign: 'center', marginHorizontal: 10 }}>
            No favourite wallpapers. You can add it to favourites by long pressing on the wallpaper.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Transition
            items={favImages}
            key={(item) => item.id}
            from={{ opacity: 0 }}
            leave={{ opacity: 0 }}
            enter={{ opacity: 1 }}
          >
            {(style, obj) => (
              <animated.View style={style}>
                <Pressable
                  style={styles.wallThumbnail}
                  onPress={() => navigation.navigate('SetWall', obj)}
                  onLongPress={() => dispatch(removeFromFavourites({ userId, imageObj: obj }))}
                >
                  <Image
                    style={styles.wallThumbnail}
                    source={{
                      uri: obj.source,
                    }}
                  />
                </Pressable>
              </animated.View>
            )}
          </Transition>
        </ScrollView>
      )}
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  favTitle: {
    fontSize: 35,
    marginTop: 35,
    marginHorizontal: 10,
    color: '#FF5353',
  },
  favDesc: {
    marginHorizontal: 13,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: width > 700 ? width * 0.7 : width,
    height: undefined,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  scrollView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wallThumbnail: {
    borderRadius: 20,
    resizeMode: 'cover',
    marginVertical: 8,
    width: width * 0.42,
    height: height * 0.28,
  },
});
