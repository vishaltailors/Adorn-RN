import React from 'react';

import { Text, StyleSheet, SafeAreaView, View, Linking, Image, Dimensions } from 'react-native';

import Contact from '../assets/images/contact.png';

const { width } = Dimensions.get('window');
const Credits = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.main}>
      <Text style={styles.quote}>
        &#8220;Appreciate the creation,{'\n'}respect the creator of it,{'\n'}and admire the source
        of{'\n'}
        all creativity.&#8221;
      </Text>
      <Text style={styles.info}>
        The wallpapers in this app are not my creations. As a developer, I admire every artist and
        photographer whose artwork/photographs are displayed in this app as wallpapers. Users of
        this app do not have the option to download wallpapers. This app is just for their personal
        use and doesn't contain any kind of monetization. Please feel free to reach out if, by any
        means, you as a creator don't agree that your artwork or photograph should be displayed
        here.
      </Text>
      <View style={styles.hr} />
      <Text style={{ marginTop: 10 }}>
        Any query or feedback ?{' '}
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('mailto: weinvincibletech@gmail.com?subject=Query/Feedback for Adorn')
          }
        >
          Drop a mail
        </Text>
      </Text>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Image
          source={Contact}
          style={{
            position: 'absolute',
            width: width > 700 ? '70%' : '100%',
            height: width > 700 ? '70%' : '100%',
            alignSelf: 'center',
          }}
        />
      </View>
    </View>
  </SafeAreaView>
);

export default Credits;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 30,
    paddingVertical: 50,
    flex: 1,
  },
  quote: {
    fontSize: 25,
    fontFamily: 'Satoshi_bold',
    textAlign: 'center',
    marginTop: 15,
  },
  info: {
    marginTop: 20,
    textAlign: 'justify',
  },
  link: {
    color: '#ff5353',
    textDecorationLine: 'underline',
  },
  hr: {
    borderBottomWidth: 1,
    marginTop: 15,
  },
});
