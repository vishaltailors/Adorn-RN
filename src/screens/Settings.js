import React, { useState, useEffect } from 'react';

import { WEBCLIENT_ID } from '@env';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User, Logout, Information, Coffee, TimerStart, TimerPause } from 'iconsax-react-native';
import objectPath from 'object-path';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableHighlight,
  useColorScheme,
  Linking,
  Dimensions,
  TouchableOpacity,
  Switch,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import RadioGroup from 'react-native-radio-buttons-group';
import Toast from 'react-native-simple-toast';
import { useSelector, useDispatch } from 'react-redux';

import { SetWallsPlaylistAndroid } from '../Modules';
import { authenticate } from '../store/authSlice';
import { setPlaylistData } from '../store/playlistSlice';

const { height } = Dimensions.get('window');

const Settings = ({ navigation }) => {
  const user = useSelector((state) => objectPath.get(state, 'auth.user', {}));

  const images = useSelector((state) => objectPath.get(state, 'image.images', []));
  const favImages = images.filter((obj) => objectPath.get(obj, ['favouriteOf', user.id], false));

  const categories = useSelector((state) => objectPath.get(state, 'image.categories', []));

  const playlist = useSelector((state) => state.playlist.playlist);

  const dispatch = useDispatch();
  const scheme = useColorScheme();

  const iconColor = scheme === 'dark' ? '#808080' : '#000000';

  GoogleSignin.configure({
    webClientId: WEBCLIENT_ID,
  });

  const signInWithGoogle = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(idToken);
      const signedInUser = auth().signInWithCredential(credential);
      return signedInUser;
    } catch (error) {
      return null;
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
      dispatch(authenticate({}));
    } catch (error) {
      console.log(error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [options, setOptions] = useState([
    {
      id: 'favorites',
      label: 'Favorites',
      labelStyle: { color: '#000000' },
      value: 'favorites',
      selected: playlist.wallsOf !== undefined ? playlist.wallsOf : true,
      disabled: !favImages.length,
    },
    {
      id: 'category',
      label: 'Category',
      labelStyle: { color: '#000000' },
      value: 'category',
      selected: false,
    },
  ]);

  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [categoryVal, setCategoryVal] = useState(objectPath.get(playlist, 'category', null));

  const [categoryOptions, setCategoryOptions] = useState(
    categories.map((obj) => ({ label: obj.name, value: obj.name }))
  );

  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [durationVal, setDurationVal] = useState(objectPath.get(playlist, 'duration', null));
  const [durationOptions, setDurationOptions] = useState([
    {
      label: 'Every 3 hour',
      value: 3,
    },
    {
      label: 'Every 6 hour',
      value: 6,
    },
    {
      label: 'Every 9 hour',
      value: 9,
    },
    {
      label: 'Every 12 hour',
      value: 12,
    },
  ]);

  const [isPlaylistEnabled, setIsPlaylistEnabled] = useState(
    objectPath.get(playlist, 'running', false)
  );

  const toggleSwitch = () => {
    if (!isPlaylistEnabled) {
      Toast.show('Click on set playlist button to enable it.');
    } else {
      SetWallsPlaylistAndroid.stopWallsPlaylistService();
      const playlistData = { ...playlist, running: false };
      dispatch(setPlaylistData(playlistData));
    }
    setIsPlaylistEnabled((prevState) => !prevState);
  };

  const setPlaylistFn = () => {
    if (durationVal) {
      let imageUrls = [];
      const playlistData = {
        running: true,
      };
      const selectedOption = options.find((obj) => obj.selected);
      playlistData.wallsOf = selectedOption.value;

      if (selectedOption.value === 'category') {
        if (categoryVal) {
          playlistData.category = categoryVal;
          const catImages = images.filter((obj) => obj.categoryName === categoryVal);
          imageUrls = catImages.map((obj) => obj.source);
        } else {
          Toast.show('Please select category');
          return;
        }
      } else {
        playlistData.category = null;
        imageUrls = favImages.map((obj) => obj.source);
      }
      playlistData.duration = durationVal;
      dispatch(setPlaylistData(playlistData));
      SetWallsPlaylistAndroid.setWallsPlaylist(imageUrls, durationVal);
      Toast.show('Service for wallpaper playlist has been started');
    } else {
      Toast.show('Please select duration');
    }
  };

  useEffect(() => {
    setIsPlaylistEnabled(playlist.running);
  }, [playlist.running]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>Settings</Text>
        {Object.keys(user).length ? (
          <>
            <View style={styles.iconTextView}>
              <Image
                source={{ uri: user.photoURL }}
                style={styles.userPhoto}
                borderRadius={50 / 2}
              />
              <View>
                <Text style={{ fontSize: 18 }}>{user.displayName}</Text>
                <Text style={styles.fs16}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.hr} />
            <TouchableHighlight
              activeOpacity={0.2}
              underlayColor={scheme === 'dark' ? '#292929' : '#dddddd'}
              style={styles.touchableOption}
              onPress={logout}
            >
              <>
                <Logout size={30} color={iconColor} />
                <Text style={[styles.fs16, styles.optionText]}>Logout</Text>
              </>
            </TouchableHighlight>
          </>
        ) : (
          <>
            <View style={styles.iconTextView}>
              <View
                borderRadius={50 / 2}
                style={{
                  borderWidth: 2.5,
                  padding: 2,
                  borderColor: iconColor,
                }}
              >
                <User size={40} color={iconColor} />
              </View>
              <Pressable style={styles.optionText} onPress={signInWithGoogle}>
                <Text style={styles.fs16}>Add account</Text>
              </Pressable>
            </View>
            <View style={styles.hr} />
          </>
        )}
        <TouchableHighlight
          activeOpacity={0.2}
          underlayColor={scheme === 'dark' ? '#292929' : '#dddddd'}
          style={styles.touchableOption}
          onPress={() => setModalVisible(true)}
        >
          <>
            {objectPath.get(playlist, 'running', false) ? (
              <TimerPause size={30} color={iconColor} />
            ) : (
              <TimerStart size={30} color={iconColor} />
            )}
            <Text style={[styles.fs16, styles.optionText]}>Walls' playlist</Text>
            <View style={styles.badge}>
              <Text style={{ color: 'white', fontSize: 11 }}>β</Text>
            </View>
          </>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={0.2}
          underlayColor={scheme === 'dark' ? '#292929' : '#dddddd'}
          style={styles.touchableOption}
          onPress={() => {
            Linking.openURL('https://www.buymeacoffee.com/vishaltailor');
          }}
        >
          <>
            <Coffee size={30} color={iconColor} />
            <Text style={[styles.fs16, styles.optionText]}>Buy me a coffee</Text>
          </>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={0.2}
          underlayColor={scheme === 'dark' ? '#292929' : '#dddddd'}
          style={styles.touchableOption}
          onPress={() => navigation.navigate('Credits')}
        >
          <>
            <Information size={30} color={iconColor} />
            <Text style={[styles.fs16, styles.optionText]}>Info & Credits</Text>
          </>
        </TouchableHighlight>
      </View>
      {/* walls' playlist modal  */}
      <View>
        <Modal
          isVisible={modalVisible}
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          backdropOpacity={0}
          style={styles.modal}
        >
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 22,
                paddingRight: 13,
              }}
            >
              <Text style={styles.modalTitle}>Configure playlist</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isPlaylistEnabled ? '#2131EB' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isPlaylistEnabled}
              />
            </View>
            <View style={styles.hr} />
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>Select walls' playlist by</Text>
              <RadioGroup
                radioButtons={options}
                onPress={(optionsArr) => {
                  setOptions([...optionsArr]);
                }}
                layout="row"
                containerStyle={{ marginTop: 5, marginHorizontal: -10 }}
              />
              {!favImages.length && (
                <Text style={styles.modalText}>
                  Favorites option is disabled! (You have no favorites images)
                </Text>
              )}
              {options[1].selected && (
                <DropDownPicker
                  open={catDropdownOpen}
                  setOpen={setCatDropdownOpen}
                  value={categoryVal}
                  setValue={setCategoryVal}
                  items={categoryOptions}
                  setItems={setCategoryOptions}
                  style={{ marginTop: 10 }}
                  placeholder="Select a category"
                  dropDownDirection="BOTTOM"
                  listMode="SCROLLVIEW"
                  maxHeight={150}
                  zIndex={2000}
                  zIndexInverse={1000}
                />
              )}
              <DropDownPicker
                open={durationDropdownOpen}
                setOpen={setDurationDropdownOpen}
                value={durationVal}
                setValue={setDurationVal}
                items={durationOptions}
                setItems={setDurationOptions}
                style={{ marginTop: 10 }}
                placeholder="Change wallpaper around"
                dropDownDirection="BOTTOM"
                listMode="SCROLLVIEW"
                maxHeight={150}
                zIndex={1000}
                zIndexInverse={2000}
              />
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <TouchableOpacity style={styles.setPlaylistBtn} onPress={setPlaylistFn}>
                  <Text style={styles.setPlaylistText}>Set playlist</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  settingTitle: {
    fontSize: 35,
    marginTop: 35,
    marginHorizontal: 10,
    color: '#FF5353',
  },
  iconTextView: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchableOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  optionText: {
    marginLeft: 10,
  },
  userPhoto: {
    height: 50,
    width: 50,
    marginRight: 10,
  },
  hr: {
    borderBottomWidth: 1,
    marginTop: 15,
  },
  fs16: {
    fontSize: 16,
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
    height: height * 0.5,
  },
  modalTitle: {
    fontFamily: 'Satoshi_bold',
    color: '#000000',
    fontSize: 22,
  },
  modalBody: {
    marginHorizontal: 22,
    marginVertical: 10,
    flex: 1,
  },
  modalText: {
    color: '#000000',
    fontSize: 16,
  },
  setPlaylistBtn: {
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '50%',
    backgroundColor: '#FF5353',
  },
  setPlaylistText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  badge: {
    marginTop: 2,
    marginLeft: 5,
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
