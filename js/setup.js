import React, { Component } from "react";
import { Provider } from "react-redux";
import { StyleProvider, Root } from "native-base";

import App from "./App";
import configureStore from "./configureStore";
import variables from "../native-base-theme/variables/commonColor";
import getTheme from "../native-base-theme/components";
import { Font, AppLoading } from "expo";

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
    Font.loadAsync({
      "Material Icons": require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      MaterialIcons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      Ionicons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
      //Ionicons: require('/@expo/vector-icons/fonts/Ionicons.ttf'),
      //'Material Icons': require('/@expo/vector-icons/fonts/MaterialIcons.ttf'),
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
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
