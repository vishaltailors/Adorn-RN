import React, { useState, useEffect } from 'react';

import { WEBCLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Google } from 'iconsax-react-native';
import { View, Text, Image, StyleSheet, useColorScheme, Pressable } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import Toast from 'react-native-simple-toast';

import OnboardingStepOne from '../assets/images/onboarding-step1.png';
import OnboardingStepTwo from '../assets/images/onboarding-step2.png';

const GetStarted = ({ navigation }) => {
  const scheme = useColorScheme();
  const color = scheme === 'dark' ? '#1f1f1f' : '#fff';

  useEffect(() => {
    AsyncStorage.getItem('@isOnboardingDone').then((value) => {
      if (value) {
        navigation.replace('AppHome');
      } else {
        AsyncStorage.setItem('@isOnboardingDone', 'yes');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  GoogleSignin.configure({
    webClientId: WEBCLIENT_ID,
  });

  const signInWithGoogle = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(idToken);
      const signedInUser = auth().signInWithCredential(credential);
      Toast.show('Successfully signed in.');
      setShowNext(true);
      return signedInUser;
    } catch (error) {
      return null;
    }
  };

  const [showNext, setShowNext] = useState(false);

  return (
    <Onboarding
      onDone={() => {
        navigation.replace('AppHome');
      }}
      showNext={showNext}
      showSkip={!showNext}
      skipToPage={1}
      pages={[
        {
          backgroundColor: color,
          image: <Image source={OnboardingStepOne} style={styles.image} />,
          title: '',
          subtitle: (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ textAlign: 'center' }}>
                Hello, I am Marvi. I will guide you through the app. Start by signing in with
                Google.
              </Text>
              <Pressable onPress={signInWithGoogle}>
                <View style={styles.signInBtn}>
                  <Google color="#fff" size={24} />
                  <Text style={{ marginLeft: 7, fontSize: 20, color: '#fff', marginBottom: 1 }}>
                    Sign in
                  </Text>
                </View>
              </Pressable>
            </View>
          ),
        },
        {
          backgroundColor: color,
          image: <Image source={OnboardingStepTwo} style={[styles.image, { height: 350 }]} />,
          title: '',
          subtitle: '"Press and hold" on any wallpaper thumbnail to add it to favourites section.',
        },
      ]}
    />
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
    marginBottom: -100,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 12,
    borderWidth: 3,
    borderRadius: 30,
    backgroundColor: '#ff5353',
  },
});
