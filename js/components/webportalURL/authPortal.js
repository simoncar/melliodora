import React, { Component } from "react";
import Constants from "expo-constants";
import { Animated, TextInput, TouchableOpacity, View, Text } from "react-native";
import { WebView } from "react-native-webview";

import { Container, Spinner } from "native-base";
import { connectActionSheet, ActionSheetProvider, ActionSheetOptions } from "@expo/react-native-action-sheet";
import { getParameterByName } from "../global.js";
import { withNavigation } from "react-navigation";
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
  constructor(props) {
    super(props);
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
      _onOpenActionSheet: this._onOpenActionSheet,
      reload: this.reload,
    });
  }

  _onOpenActionSheet = () => {
    const options = ["Home", "Cafe Top-Up", "Events", "Forms", "PTA", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 5;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.setState({ url: "https://mystamford.edu.sg/parent-dashboard" });
            break;
          case 1:
            this.setState({ url: "https://mystamford.edu.sg/cafe/cafe-online-ordering" });
            break;
          case 2:
            this.setState({ url: "https://mystamford.edu.sg/events-1" });
            break;
          case 3:
            this.setState({ url: "https://mystamford.edu.sg/forms-1" });
            break;
          case 4:
            this.setState({ url: "https://mystamford.edu.sg/pta" });
            break;
        }
      },
    );
  };

  showMsg() {
    if (Constants.manifest.extra.instance == "0001-sais_edu_sg") {
      this.setState({ showMsg: true }, () =>
        timer.setTimeout(this, "hideMsg", () => this.setState({ showMsg: false }), 5000),
      );
    }
  }

  onNavigationStateChange = navState => {
    console.log(navState.url);
    this.setState({ url: navState.url });

    //https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2fparent-dashboard

    if (navState.url == "https://mystamford.edu.sg/parent-dashboard") {
      var jsCode = "window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);";

      console.log("Injecting script");
      setTimeout(() => {
        var jsCode = "window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);";
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

    if (
      navState.url ==
      "https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2fparent-dashboard"
    ) {
      this.setState({
        url:
          "https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2fparent-dashboard&kr=iSAMS:ParentPP",
      });
      console.log("Overrule Login", global.email);
    }

    var string = navState.url;

    if (string.indexOf("ffauth_secret") > 1) {
      //var authSecret = getParameterByName("ffauth_secret", string);
      //this.props.setauthSecret(authSecret);
    } else {
    }
  };

  onBack() {
    this.webref.goBack();
  }

  reload = () => {
    this.webref.reload();
  };

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

  handleMessage(message) {
    var authName = AuthParser.extractLoginUsername(message.nativeEvent.data);
    var authEmail = AuthParser.extractLoginEmail(message.nativeEvent.data);
    console.log("authName=", authName);
    AuthParser.saveDetails(authName, authEmail);
  }

  _onLoadEnd() {
    if (
      this.state.url ==
      "https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2fparent-dashboard&kr=iSAMS:ParentPP"
    ) {
      //this.webref.injectJavaScript(jsCode);
      setTimeout(() => {
        // var jsCode = "document.getElementById('username').value='" + global.email + "';true;";
        var jsCode =
          "document.getElementsByClassName('ff-login-personalised-background')[0].style.display = 'none';true;";

        this.webref.injectJavaScript(jsCode);
      }, 500);
    } else {
      var jsCodeNoLogo = "document.getElementById('userbar-react-component').style.display = 'none';";
      jsCodeNoLogo = jsCodeNoLogo + "document.getElementsByClassName('school-logo')[0].style.display = 'none';";
      jsCodeNoLogo = jsCodeNoLogo + "document.getElementById('school-header').style.margin = '0px';";
      jsCodeNoLogo = jsCodeNoLogo + "document.getElementsByClassName('search-container')[0].style.display = 'none';";
      setTimeout(() => {
        this.webref.injectJavaScript(jsCodeNoLogo);
      }, 500);
    }
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
            </View>

            <WebView
              source={{ uri: this.state.url }}
              javaScriptEnabled={true}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              domStorageEnabled={true}
              startInLoadingState={true}
              ref={r => (this.webref = r)}
              keyboardDisplayRequiresUserAction={true}
              sharedCookiesEnabled={true}
              onMessage={this.handleMessage}
              onLoadEnd={this._onLoadEnd.bind(this)}
            />
          </View>
        </View>
      </Container>
    );
  }
}

const ConnectedApp = connectActionSheet(withNavigation(authPortal));

export default class AppContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerBackTitle: null,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.reload();
        }}
      >
        <Ionicons name="md-refresh" style={styles.Leftheading} />
      </TouchableOpacity>
    ),

    headerTitle: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._onOpenActionSheet();
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "600" }}>myStamford</Text>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._onOpenActionSheet();
        }}
      >
        <View style={styles.chatHeading}>
          <Ionicons name="ios-bookmarks" style={styles.heading} />
        </View>
      </TouchableOpacity>
    ),
  });
  render() {
    return (
      <ActionSheetProvider>
        <ConnectedApp />
      </ActionSheetProvider>
    );
  }
}
