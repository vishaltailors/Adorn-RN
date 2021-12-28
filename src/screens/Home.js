import React, { useEffect } from 'react';

import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import objectPath from 'object-path';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import LoadingAnim from '../assets/lottie/loading.json';
import CategorySection from '../components/CategorySection';
import ImageSection from '../components/ImageSection';
import { setImages } from '../store/imageSlice';

const Home = () => {
  const isImageLoading = useSelector((state) => objectPath.get(state, 'image.imageLoading', false));
  const isCategoryLoading = useSelector((state) =>
    objectPath.get(state, 'image.categoryLoading', false)
  );
  const images = useSelector((state) => objectPath.get(state, 'image.images', []));

  const sort = (sectionTitle) => {
    const imagesArr = [...images];
    switch (sectionTitle) {
      case 'Popular':
        imagesArr.sort((obj1, obj2) => {
          if (
            Object.keys(objectPath.get(obj1, 'favouriteOf', {})).length >
            Object.keys(objectPath.get(obj2, 'favouriteOf', {})).length
          ) {
            return -1;
          }
          return 1;
        });
        break;
      case 'Newest':
        imagesArr.sort((obj1, obj2) => {
          return obj2.timestamp - obj1.timestamp;
        });
        break;
      default:
        break;
    }
    return imagesArr;
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const subscriber = firestore()
      .collection('images')
      .onSnapshot((snapshot) => {
        let image = {};
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'removed') {
            const data = change.doc.data();
            const timestamp = data.timestamp.toDate().getTime();
            image = {
              ...data,
              id: change.doc.id,
              timestamp,
            };
            const isDuplicate = images.find((obj) => obj.id === image.id);
            if (!isDuplicate) {
              dispatch(setImages({ image, action: change.type }));
            }
          }
        });
      });
    return () => {
      subscriber();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.appTitle}>Adorn Walls</Text>
      {isImageLoading && isCategoryLoading ? (
        <LottieView source={LoadingAnim} autoPlay loop style={{ marginTop: 25 }} />
      ) : (
        <ScrollView>
          <ImageSection sectionTitle="Newest" images={sort('Newest')} />
          <CategorySection />
          <ImageSection sectionTitle="Popular" images={sort('Popular')} />
        </ScrollView>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 35,
    marginTop: 35,
    marginBottom: 10,
    marginHorizontal: 10,
    color: '#FF5353',
  },
});
