import React, { Component } from "react";
import { TextInput, TouchableOpacity, WebView, View } from "react-native";
import { Actions, ActionConst } from "react-navigation";

import { Container } from "native-base";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Analytics from "../../lib/analytics";
import Constants from "expo-constants";
import HeaderContent from "../headerContent/header";
import styles from "./styles";

var WEBVIEW_REF = "webview";

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialCommunityIcons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

class WebportalSports extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    headerBackTitle: null
  });

  constructor(props) {
    super(props);

    injectScript = "";

    //analytics  -----
    let trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.PAGE_ATHLETICS, trackingOpts);
    //analytics --------

    let pageTitle = this.props.navigation.getParam("title");
  }

  state = {
    url: this.props.navigation.getParam("url"),
    status: "No Page Loaded",
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true,
    cookies: {},
    webViewUrl: ""
  };

  onNavigationStateChange = navState => {
    this.setState({ url: navState.url });

    if (navState.url != "https://mystamford.edu.sg/parent-dashboard") {
      this.setState({ canGoBack: navState.canGoBack });
    } else {
      this.setState({ canGoBack: false });
    }

    this.setState({ updateFirebaseText: navState.url });

    var string = navState.url;
  };

  onBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }
  }

  reload = () => {
    this.refs[WEBVIEW_REF].reload();
  };

  render() {
    return (
      <Container>
        <HeaderContent navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2 }}>
            <View style={styles.topbar}>
              <TouchableOpacity
                disabled={!this.state.canGoBack}
                onPress={this.onBack.bind(this)}
              >
                <Ionicons style={styles.navIcon} name="ios-arrow-back" />
              </TouchableOpacity>

              <TextInput
                ref="pageURL"
                value={this.state.url}
                placeholderTextColor="#FFF"
                style={styles.url}
                autoCapitalize="none"
                selectionColor="#FFF"
              />

              <Ionicons style={styles.navIcon} name="ios-arrow-forward" />
            </View>

            <WebView
              source={{ uri: this.state.url }}
              javaScriptEnabled={true}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              injectedJavaScript={injectScript}
              ref={WEBVIEW_REF}
              useWebKit={true}
            />
          </View>
        </View>
      </Container>
    );
  }
}

export default WebportalSports;
