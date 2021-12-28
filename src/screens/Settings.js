import React from 'react';

import { WEBCLIENT_ID } from '@env';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User, Logout, Information } from 'iconsax-react-native';
import objectPath from 'object-path';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableHighlight,
  useColorScheme,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { authenticate } from '../store/authSlice';

const Settings = ({ navigation }) => {
  const user = useSelector((state) => objectPath.get(state, 'auth.user', {}));
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

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.settingTitle}>Settings</Text>
      {Object.keys(user).length ? (
        <>
          <View style={styles.iconTextView}>
            <Image source={{ uri: user.photoURL }} style={styles.userPhoto} borderRadius={50 / 2} />
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
        onPress={() => navigation.navigate('Credits')}
      >
        <>
          <Information size={30} color={iconColor} />
          <Text style={[styles.fs16, styles.optionText]}>Info & Credits</Text>
        </>
      </TouchableHighlight>
    </View>
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
});
