import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  TouchableHighlight,
  Button,
  Linking,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  WebView,
  ScrollView,
  Image,
  View,
  Platform
} from "react-native";

import { Container } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { WebBrowser } from "expo";
import Constants from "expo-constants";
import HeaderContent from "./../headerContent/header/";
import { openDrawer } from "../../actions/drawer";
import * as ActionCreators from "../../actions";
import styles from "./styles";
import qs from "qs";

const timer = require("react-native-timer");

var WEBVIEW_REF = "webview";
var DEFAULT_URL = "";

class WebportalAuth extends Component {
  static propTypes = {
    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string
    })
  };
  constructor(props) {
    DEFAULT_URL = "https://saispta.com/app/Authentication.php";
    super(props);
  }

  state = {
    url: DEFAULT_URL,
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
    result: null
  };

  showMsg() {
    //this.setState({showMsg: true}, () => timer.setTimeout(
    //  this, 'hideMsg', () => this.setState({showMsg: false}), 5000
    //));
  }

  onNavigationStateChange = navState => {
    console.log("webview = onNavigationStateChange=" & navState);
    console.log(navState);

    if (navState.url != "https://mystamford.edu.sg/parent-dashboard") {
      this.setState({ canGoBack: navState.canGoBack });
    } else {
      this.setState({ canGoBack: false });
    }
  };

  onBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  componentWillMount() {
    if (this.props.userX.ffauth_device_id) {
      //we have a value, good
    } else {
      //nothing :-(
      //Actions.login();
    }

    if (this.props.userX.ffauth_secret) {
      //we have a value, good
    } else {
      //nothing :-(
      //Actions.login();
    }

    this._visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }
    Animated.timing(this._visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 1200
    }).start(() => {
      this.setState({ visible: nextProps.visible });
    });
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  _checkNeededCookies = () => {
    console.log("webview = _checkNeededCookies");
    const { cookies, webViewUrl } = this.state;

    if (webViewUrl === "SUCCESS_URL") {
      console.log(
        "webview = _checkNeededCookies",
        cookies("ASP.NET_SessionId")
      );
      if (cookies["ASP.NET_SessionId"]) {
        alert(cookies["ASP.NET_SessionId"]);
        // do your magic...
      }
    }
  };

  getInitialState = () => {
    return {
      webViewHeight: 100 // default height, can be anything
    };
  };

  _onMessage = event => {
    console.log("webview = _onMessage");
    const { data } = event.nativeEvent;
    const cookies = data.split(";"); // `csrftoken=...; rur=...; mid=...; somethingelse=...`
    console.log("webview = _onMessage cookies", cookies);
    cookies.forEach(cookie => {
      const c = cookie.trim().split("=");

      const new_cookies = this.state.cookies;
      new_cookies[c[0]] = c[1];

      this.setState({ cookies: new_cookies });
      console.log("     cookie = ", c);
    });

    this._checkNeededCookies();
  };

  toggleCancel() {
    this.setState({
      showCancel: !this.state.showCancel
    });
  }

  updateText = () => {
    this.setState({ myText: "My Changed Text" });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Redirect Example</Text>

        <Button
          onPress={this._openWebBrowserAsync}
          title="Tap here to try it out"
        />
        <Text>{Constants.linkingUri}</Text>

        <Text>
          https://mystamford.edu.sg/login/api/webgettoken?app=SAISPTA&successURL=https://saispta.com/app/Authentication.php?linkingUri=
          {Constants.linkingUri}&failURL=https://saispta.com/app/fail
        </Text>

        <Button
          onPress={this._openWebBrowserAsync2}
          title="Tap here to try it out"
        />
        {this._maybeRenderRedirectData()}
      </View>
    );
  }

  _handleRedirect = event => {
    WebBrowser.dismissBrowser();

    let query = event.url.replace(Constants.linkingUri, "");
    let data;
    if (query) {
      data = qs.parse(query);
    } else {
      data = null;
    }

    this.setState({ redirectData: data });
  };

  _openWebBrowserAsync = async () => {
    this._addLinkingListener();
    /*
    let result2 = await WebBrowser.openBrowserAsync(
      `https://backend-xxswjknyfi.now.sh/?linkingUri=${Constants.linkingUri}`
    );
    'https://mystamford.edu.sg/logout'
`https://saispta.com/app/Authentication.php`
'exp://localhost:19002/+authToken=ffff23xbdbb21b3'
    */

    console.log(
      "https://mystamford.edu.sg/login/api/webgettoken?app=SAISPTA&successURL=https://saispta.com/app/Authentication.php?linkingUri=" +
        Constants.linkingUri +
        "&failURL=https://saispta.com/app/fail"
    );

    let result = await WebBrowser.openBrowserAsync(
      "https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2flogin%2fapi%2fwebgettoken%3fapp%3dSAISPTA%26successURL%3dhttps%3a%2f%2fsaispta.com%2fapp%2fAuthentication.php%3flinkingUri%3d" +
        Constants.linkingUri +
        "%26failURL%3dhttps%3a%2f%2fsaispta.com%2fapp%2ffail"
    );

    this._removeLinkingListener();
    this.setState({ result });
  };

  _openWebBrowserAsync2 = async () => {
    this._addLinkingListener();
    /*
    let result2 = await WebBrowser.openBrowserAsync(
      `https://backend-xxswjknyfi.now.sh/?linkingUri=${Constants.linkingUri}`
    );
    'https://mystamford.edu.sg/logout'
`https://saispta.com/app/Authentication.php`
'exp://localhost:19002/+authToken=ffff23xbdbb21b3'
    */
    let result = await WebBrowser.openBrowserAsync(
      "https://mystamford.edu.sg/"
    );
    this._removeLinkingListener();
    this.setState({ result });
  };

  _addLinkingListener = () => {
    Linking.addEventListener("url", this._handleRedirect);
  };

  _removeLinkingListener = () => {
    Linking.removeEventListener("url", this._handleRedirect);
  };

  _maybeRenderRedirectData = () => {
    if (!this.state.redirectData) {
      return;
    }

    return <Text>{JSON.stringify(this.state.redirectData)}</Text>;
  };

  render2() {
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
                <Ionicons
                  style={styles.navIconLeft}
                  active
                  name="ios-arrow-back"
                />
              </TouchableOpacity>
              <Ionicons
                style={styles.navIconRight}
                active
                name="ios-arrow-forward"
              />
            </View>
            <WebView
              source={{ uri: this.state.url }}
              javaScriptEnabled={true}
              automaticallyAdjustContentInsets={false}
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              //onMessage={this._onMessage}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              //injectedJavaScript={injectScript}
              ref={WEBVIEW_REF}
            />
          </View>
        </View>
      </Container>
    );
  }

  _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openAuthSessionAsync(
      "https://mystamford.edu.sg/login/api/webgettoken?app=SAISPTA&successURL=https://saispta.com/app/Authentication.php",
      "https://saispta.com/app/Authentication.php"
    );
    this.setState({ result });
  };

  reload = () => {
    this.refs[WEBVIEW_REF].reload();
  };

  pressGoButton = () => {
    var url = "https://mystamford.edu.sg/cafe/cafe-online-ordering#anchor";

    if (url === this.state.url) {
      this.reload();
    } else {
      this.setState({
        url: url
      });
    }
  };
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer())
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  userX: state.user,
  ffauth_device_idX: state.ffauth_device_id,
  ffauth_secretX: state.ffauth_secret
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebportalAuth);
