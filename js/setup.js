
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StyleProvider, Root } from 'native-base';

import App from './App';
import configureStore from './configureStore';
import getTheme from '../native-base-theme/components';
import variables from '../native-base-theme/variables/commonColor';


export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      store: configureStore(() => this.setState({ isLoading: false })),
      isReady: false,
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      
      //Ionicons: require('/@expo/vector-icons/fonts/Ionicons.ttf'),
      //'Material Icons': require('/@expo/vector-icons/fonts/MaterialIcons.ttf'),
      SFProTextBold: require('../fonts/SF-Pro-Text-Bold.otf'),
      SFProTextSemiBold: require('../fonts/SF-Pro-Text-Semibold.otf'),
      SFProTextRegular: require('../fonts/SF-Pro-Text-Regular.otf'),
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(variables)}>
        <Root>
            <Provider store={this.state.store}>
              <App />
            </Provider>
         </Root>
      </StyleProvider>
    );
  }
}
