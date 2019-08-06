import React, { Component } from "react";
import Constants from "expo-constants";
import { Animated, TextInput, TouchableOpacity, View, Text } from "react-native";
import { WebView } from "react-native-webview";

import { Container, Spinner } from "native-base";

import { getParameterByName } from "../global.js";

import styles from "./styles";
import { MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import AuthParser from "./authParser";

const timer = require("react-native-timer");

var WEBVIEW_REF = "webview";

var injectScript = "";

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

class authPortal extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerBackTitle: null,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Entypo name="chevron-left" style={styles.Heading} />
      </TouchableOpacity>
    ),

    headerTitle: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._showActionSheet();
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "600" }}>myStamford</Text>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._showActionSheet();
        }}
      >
        <View style={styles.Heading}>
          <Entypo name="cog" style={styles.Heading} />
        </View>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    DEFAULT_URL = global.switch_portalURL;
    DEFAULT_URL = "https://mystamford.edu.sg/parent-dashboard";
  }

  state = {
    url: "https://mystamford.edu.sg/parent-dashboard",
    status: "No Page Loaded",
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true,
    cookies: {},
    webViewUrl: "",
    visible: this.props.visible,
    myText: "My Original Text",
    showMsg: false,
  };

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      _showActionSheet: this._showActionSheet,
    });
  }

  showMsg() {
    if (Constants.manifest.extra.instance == "0001-sais_edu_sg") {
      this.setState({ showMsg: true }, () =>
        timer.setTimeout(this, "hideMsg", () => this.setState({ showMsg: false }), 5000),
      );
    }
  }

  _showActionSheet() {
    const BUTTONS = ["Mute conversation", "Unmute conversation", "Cancel"];
    const CANCEL_INDEX = 2;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: "Options",
      },

      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Backend.setMute(true);
            break;
          case 1:
            Backend.setMute(false);
            break;
        }
      },
    );
  }

  onNavigationStateChange = navState => {
    console.log(navState.url);
    this.setState({ url: navState.url });

    //https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2fparent-dashboard

    if (navState.url == "https://mystamford.edu.sg/parent-dashboard") {
      const jsCode = "window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)";

      console.log("Injecting script");
      setTimeout(() => {
        this.webref.injectJavaScript(jsCode);
      }, 5000);
      this.setState({ canGoBack: false });
    } else {
      this.setState({ canGoBack: navState.canGoBack });
    }

    if (navState.url == "https://mystamford.edu.sg/logout.aspx") {
      this.props.setauthSecret("");
      console.log("PROCESS LOGOUT - CLEAR SECRET");
    }

    var string = navState.url;

    if (string.indexOf("ffauth_secret") > 1) {
      //var authSecret = getParameterByName("ffauth_secret", string);
      //this.props.setauthSecret(authSecret);
    } else {
    }
  };

  onBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  componentWillMount() {
    if (Constants.manifest.extra.instance == "0001-sais_edu_sg") {
      this._visibility = new Animated.Value(this.props.visible ? 1 : 0);

      this.setState({ showMsg: true }, () =>
        timer.setTimeout(this, "hideMsg", () => this.setState({ showMsg: false }), 10000),
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }
  }

  getInitialState = () => {
    return {
      webViewHeight: 100, // default height, can be anything
    };
  };

  toggleCancel() {
    this.setState({
      showCancel: !this.state.showCancel,
    });
  }

  _renderSpinner() {
    if (this.state.showMsg) {
      return (
        <View style={styles.settingsMessage}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 2 }}>
            <Spinner color="#172245" />
          </View>

          <View style={{ flex: 3 }} />
        </View>
      );
    } else {
      null;
    }
  }

  handleMessage(message) {
    var authName = AuthParser.extractLoginUsername(message.nativeEvent.data);
    var authEmail = AuthParser.extractLoginEmail(message.nativeEvent.data);
    console.log("authName=", authName);
    AuthParser.saveDetails(authName, authEmail);
  }

  render() {
    const _login = () => {
      Animated.visible = false;
      Animated.height = 0;
      this.state.showCancel = true;
    };

    const { visible, style, children, ...rest } = this.props;

    return (
      <Container>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2 }}>
            <View style={styles.topbar}>
              <TouchableOpacity disabled={!this.state.canGoBack} onPress={this.onBack.bind(this)}>
                <Ionicons style={styles.navIcon} name="ios-arrow-back" />
              </TouchableOpacity>

              <TextInput
                ref="pageURL"
                value={this.state.url}
                placeholderTextColor="#FFF"
                style={styles.url}
                autoCapitalize="none"
                autoFocus={false}
                selectionColor="#FFF"
              />

              <Ionicons style={styles.navIcon} name="ios-arrow-forward" />
            </View>

            <WebView
              source={{ uri: this.state.url }}
              javaScriptEnabled={true}
              //injectedJavaScript={jsCode}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              //onMessage={this._onMessage}
              domStorageEnabled={true}
              startInLoadingState={true}
              ref={r => (this.webref = r)}
              keyboardDisplayRequiresUserAction={true}
              sharedCookiesEnabled={true}
              // onMessage={this._onMessage}
              //injectedJavaScript={yourAlert}
              //injectedJavaScript="window.postMessage(document.title) , true"
              onMessage={this.handleMessage}
            />
          </View>
        </View>
      </Container>
    );
  }

  reload = () => {
    this.refs[WEBVIEW_REF].reload();
  };
}

export default authPortal;
