import React, { useState } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const WallsPlaylistSelect = () => {
  const [options, setOptions] = useState([
    {
      id: 'favorites',
      label: 'Favorites',
      value: 'favorites',
      selected: true,
    },
    {
      id: 'category',
      label: 'Category',
      value: 'category',
    },
  ]);

  return (
    <View>
      <Text style={styles.playlistTitle}>Configure playlist</Text>
      <Text style={styles.desc}>Change the wallpaper at certain interval !</Text>
      <Text style={styles.label}>Wallpaper playlist by</Text>
      <RadioGroup
        radioButtons={options}
        onPress={(optionsArr) => {
          setOptions(optionsArr);
        }}
        layout="row"
        containerStyle={{ marginTop: 5, marginLeft: 3 }}
      />
    </View>
  );
};

export default WallsPlaylistSelect;

const styles = StyleSheet.create({
  playlistTitle: {
    fontSize: 35,
    marginTop: 35,
    marginHorizontal: 10,
    color: '#FF5353',
  },
  desc: {
    marginHorizontal: 13,
  },
  label: {
    marginHorizontal: 13,
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Satoshi_bold',
  },
});
