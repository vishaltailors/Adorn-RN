import React from 'react';

import { useNavigation } from '@react-navigation/native';
import objectPath from 'object-path';
import { ScrollView, Text, View, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const CategorySection = () => {
  const categories = useSelector((state) => objectPath.get(state, 'image.categories', []));
  const navigation = useNavigation();

  return (
    <>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView contentContainerStyle={{ marginTop: 7, paddingHorizontal: 12 }} horizontal>
        {categories.map((obj) => (
          <Pressable onPress={() => navigation.navigate('Category', obj)} key={obj.id}>
            <Image
              style={styles.catThumbnail}
              source={{
                uri: obj.thumbnail,
              }}
            />
            <Text style={styles.catTitle}>{obj.name}</Text>
            <View style={styles.overlay} />
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};

export default CategorySection;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    marginHorizontal: 14,
    marginTop: 20,
  },
  catTitle: {
    fontSize: 18,
    color: '#fff',
    position: 'absolute',
    zIndex: 2,
    width: width * 0.4,
    textAlign: 'center',
    top: '40%',
  },
  catThumbnail: {
    position: 'relative',
    height: height * 0.13,
    width: width * 0.4,
    borderRadius: 20,
    marginRight: 15,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    height: height * 0.13,
    width: width * 0.4,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
