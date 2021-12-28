import React, { useState } from 'react';

import { InfoCircle } from 'iconsax-react-native';
import objectPath from 'object-path';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';

import { SetWallpaperAndroid } from '../Modules';

// eslint-disable-next-line react/prop-types
const SetWall = ({ route }) => {
  const imageObj = objectPath.get(route, 'params');

  const [modalVisible, setModalVisible] = useState(false);
  const [creatorModalVisible, setCreatorModalVisible] = useState(false);
  const [loader, setLoader] = useState({ flag: null, loading: false });

  const setWallOptions = [
    {
      title: 'Home Screen',
      name: 'homeScreen',
      flag: 1,
    },
    {
      title: 'Lock Screen',
      name: 'lockScreen',
      flag: 2,
    },
    {
      title: 'Both Screen',
      name: 'bothScreen',
      flag: 0,
    },
  ];

  const setWallpaper = (obj) => {
    setLoader({ flag: obj.flag, loading: true });
    if (Platform.OS === 'android') {
      SetWallpaperAndroid.setWallpaper(imageObj.source, obj.flag, (isWallpaperSet) => {
        setLoader({ flag: obj.flag, loading: false });
        if (isWallpaperSet) {
          setModalVisible(false);
        }
      });
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <Image style={styles.image} source={{ uri: imageObj.source }} />
      </View>
      <View style={styles.wallInfo}>
        {imageObj.creator && imageObj.creator.name ? (
          <Pressable style={styles.infoIcon} onPress={() => setCreatorModalVisible(true)}>
            <InfoCircle color="#fff" />
          </Pressable>
        ) : null}
        <Text style={styles.wallTitle}>{imageObj.name}</Text>
        {imageObj.description ? <Text style={styles.wallDesc}>{imageObj.description}</Text> : null}
        <TouchableOpacity style={styles.setWallBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.setWallText}>Set Wallpaper</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Modal
          isVisible={modalVisible}
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          backdropOpacity={0}
          style={styles.modal}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Set Wallpaper</Text>
            <View style={styles.hr} />
            {setWallOptions.map((obj) => (
              <TouchableHighlight
                activeOpacity={0.2}
                underlayColor="#DDDDDD"
                style={styles.touchableOption}
                onPress={() => setWallpaper(obj)}
                key={obj.name}
              >
                <View style={styles.option}>
                  <Text style={styles.modalText}>{obj.title}</Text>
                  <ActivityIndicator
                    size="large"
                    color="#FF5353"
                    animating={obj.flag === loader.flag && loader.loading}
                  />
                </View>
              </TouchableHighlight>
            ))}
          </View>
        </Modal>
      </View>
      {/* Author modal  */}
      <View>
        <Modal
          isVisible={creatorModalVisible}
          onBackButtonPress={() => setCreatorModalVisible(false)}
          onBackdropPress={() => setCreatorModalVisible(false)}
          backdropOpacity={0}
          style={styles.modal}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Attribution</Text>
            <View style={styles.hr} />
            <View style={styles.creatorInfo}>
              <Text style={styles.modalText}>
                This wallpaper is an creation of{' '}
                <Text
                  style={styles.link}
                  onPress={() => Linking.openURL(objectPath.get(imageObj, 'creator.link', ''))}
                >
                  {objectPath.get(imageObj, 'creator.name', '')}
                </Text>
                .
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default SetWall;

const styles = StyleSheet.create({
  infoIcon: {
    position: 'absolute',
    right: 20,
    top: 10.5,
    zIndex: 2,
  },
  wallInfo: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wallTitle: {
    color: '#ffffff',
    fontSize: 25,
    marginVertical: 5,
  },
  wallDesc: {
    color: '#ffffff',
  },
  setWallBtn: {
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#FF5353',
  },
  setWallText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: '#fff',
    paddingVertical: 17,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: {
    fontFamily: 'Satoshi_bold',
    color: '#000000',
    fontSize: 22,
    paddingHorizontal: 22,
  },
  hr: {
    borderBottomWidth: 1,
    marginTop: 17,
  },
  touchableOption: {
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  modalText: {
    color: '#000000',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  creatorInfo: {
    margin: 24,
  },
  link: {
    color: '#ff5353',
    textDecorationLine: 'underline',
  },
});
