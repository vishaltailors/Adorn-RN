import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home2, Heart, Setting } from 'iconsax-react-native';
import { useColorScheme } from 'react-native';

import Favourites from './screens/Favourites';
import Home from './screens/Home';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const scheme = useColorScheme();
  const iconFillColor = '#FF5353';
  const iconDefaultColor = scheme === 'dark' ? '#808080' : '#000000';

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <Home2 size={size} variant="Bold" color={iconFillColor} />
            ) : (
              <Home2 size={size} color={iconDefaultColor} />
            ),
        }}
      />
      <Tab.Screen
        name="favourites"
        component={Favourites}
        options={{
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <Heart size={size} variant="Bold" color={iconFillColor} />
            ) : (
              <Heart size={size} color={iconDefaultColor} />
            ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <Setting size={size} variant="Bold" color={iconFillColor} />
            ) : (
              <Setting size={size} color={iconDefaultColor} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
