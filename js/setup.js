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
      store: configureStore(() => this.setState({ isLoading: false })),
    };
  }

  render() {
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
