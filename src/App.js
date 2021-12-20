import 'react-native-gesture-handler';
import React from 'react';

import { setCustomText } from 'react-native-global-props';
import { Provider } from 'react-redux';

import Navigation from './Navigation';
import { store } from './store';

const customTextProps = {
  style: {
    fontFamily: 'Satoshi',
  },
};

setCustomText(customTextProps);

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
