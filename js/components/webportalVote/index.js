
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {TouchableHighlight,Animated, Dimensions, TouchableOpacity, WebView,ScrollView, Image, View, Platform } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import HeaderContent from './../headerContent/';

import { openDrawer } from '../../actions/drawer';

import * as  ActionCreators  from '../../actions'

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;
const timer = require('react-native-timer');


const headerLogo = require('../../../images/Header-Logo-White-0001.png');

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://www.surveymonkey.com/r/ptacoffee17';


var injectScript  = '';

class Webportal extends Component {

  static propTypes = {

    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);

    injectScript = 'document.getElementById(\"username\").value=\"' + this.props.userX.name + '\"';
    injectScript = injectScript + ';' +  'document.getElementById(\"password\").value=\"' + this.props.userX.password + '"';
    injectScript = injectScript + ';' +  'document.forms[0].submit()';
    injectScript = injectScript + ';' +  'document.getElementsByClassName(\"ff-login-personalised-logo\")[0].style.visibility = \"hidden\";';
    injectScript = injectScript + ';' +  'document.getElementsByClassName(\"global-logo\")[0].style.visibility = \"hidden\";';
  //  injectScript = injectScript + ';' +  'window.postMessage(document.cookie)'


  }

  state = {
    url: DEFAULT_URL,
    status: 'No Page Loaded',
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true,
    cookies    : {},
    webViewUrl : '',
    visible: this.props.visible,
      myText: 'My Original Text',
      showMsg: false

  };

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  showMsg() {
  }

  onNavigationStateChange = (navState) => {
      console.log ('webview = onNavigationStateChange=' & navState);
        console.log ( navState);

        if (navState.url != "https://mystamford.edu.sg/parent-dashboard") {
              this.setState({canGoBack: navState.canGoBack});
        } else {
              this.setState({canGoBack: false});
        }

  }

  onBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  componentWillMount() {

    this._visibility = new Animated.Value(this.props.visible ? 1 : 0);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }
    Animated.timing(this._visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 0,
    }).start(() => {
      this.setState({ visible: nextProps.visible });
    });
  }


  _checkNeededCookies = () => {
    console.log ('webview = _checkNeededCookies');
    const { cookies, webViewUrl } = this.state;

    if (webViewUrl === 'SUCCESS_URL') {
      console.log ('webview = _checkNeededCookies', cookies('ASP.NET_SessionId'));
      if (cookies['ASP.NET_SessionId']) {
        alert(cookies['ASP.NET_SessionId']);
        // do your magic...
      }
    }
  }


   getInitialState =  () => {
       return {
           webViewHeight: 100 // default height, can be anything
       }
   }


  _onMessage = (event) => {
        console.log ('webview = _onMessage');
     const { data } = event.nativeEvent;
     const cookies  = data.split(';'); // `csrftoken=...; rur=...; mid=...; somethingelse=...`
    console.log ('webview = _onMessage cookies', cookies);
     cookies.forEach((cookie) => {
       const c = cookie.trim().split('=');

       const new_cookies = this.state.cookies;
       new_cookies[c[0]] = c[1];

       this.setState({ cookies: new_cookies });
       console.log ('     cookie = ', c);

     });

     this._checkNeededCookies();
   }

    toggleCancel () {


        this.setState({
            showCancel: !this.state.showCancel
        });
    }


   _renderSpinner () {
        if (this.state.showMsg) {
           return (
              <TouchableOpacity onPress={() => Actions.login()}>
               <View style={styles.settingsMessage} >
                 <View style={{flex: 1}} />
                 <View style={{flex: 2}}>
                        <Spinner color='#172245' />
                 </View>

                <View style={{flex: 3}} />

              </View>
               </TouchableOpacity>
           );
       } else {
          null;
       }
   }

   updateText = () => {
    this.setState({myText: 'My Changed Text'})
 }

  render() {

    _login =  () => {
       console.log('here');
       Animated.visible=false;
       Animated.height = 0;
       //this.toggleCancel();
       this.state.showCancel = true;
       this.setState({myText: 'My Changed Text'})
    }

    const { visible, style, children, ...rest } = this.props;

    const containerStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: this._visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [1.1, 1],
          }),
        },
      ],
    };

    const combinedStyle = [containerStyle, style];

    return (
      <View style={{ flex:1}}>
        <HeaderContent />

   {this._renderSpinner()}

        <View style={{ flex:2}}>



        <View style={styles.topbar}>
          <TouchableOpacity
            disabled={!this.state.canGoBack}
            onPress={this.onBack.bind(this)}
            >
              <Icon style={styles.navIconLeft} active name="ios-arrow-back" />
          </TouchableOpacity>

              <Icon style={styles.navIconBookmark}  active name="ios-bookmarks-outline" />
              <Icon  style={styles.navIconRight} active name="ios-arrow-forward" />


         </View>



        <WebView
            source={{uri: this.state.url}}
             javaScriptEnabled={true}
             automaticallyAdjustContentInsets={false}
             onNavigationStateChange={this.onNavigationStateChange.bind(this)}
             //onMessage={this._onMessage}
             domStorageEnabled={true}
             startInLoadingState={true}
             injectedJavaScript={injectScript}
             ref={WEBVIEW_REF}
           />

        </View>

  </View>
    );
  };


  reload = () => {
     this.refs[WEBVIEW_REF].reload();
   };

  pressGoButton = () => {
      var url = 'https://mystamford.edu.sg/cafe/cafe-online-ordering#anchor';

      if (url === this.state.url) {
        this.reload();
      } else {
        this.setState({
          url: url,
        });
      }
    };
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators (ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Webportal);
