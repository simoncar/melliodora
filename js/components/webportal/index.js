
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {TouchableHighlight,Animated, Dimensions, TouchableOpacity, WebView,ScrollView, Image, View, Platform } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import HeaderContent from './../headerContent/header/';

import { getParameterByName } from '../global.js';

import { openDrawer } from '../../actions/drawer';

import * as  ActionCreators  from '../../actions'

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;
const timer = require('react-native-timer');


const headerLogo = require('../../../images/Header-Logo-White-0001.png');

var WEBVIEW_REF = 'webview';
//var DEFAULT_URL = 'https://saispta.com/app/Authentication.php';
var DEFAULT_URL = 'https://www.google.com';

//var DEFAULT_URL = 'https://mystamford.edu.sg/login/api/getsession?ffauth_device_id=SOME_RANDOM&ffauth_secret=MERGE_AUTH_SECRET&prelogin=https://mystamford.edu.sg/pta/pta-events/christmas-2017';

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
    injectScript = '';

      console.log ('going to this URL (constructor)=' + DEFAULT_URL)

      var authSecret2 = this.props.userX.authSecret

      console.log ('AA=' + authSecret2)

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
    this.setState({showMsg: true}, () => timer.setTimeout(
      this, 'hideMsg', () => this.setState({showMsg: false}), 5000
    ));
  }


  onNavigationStateChange = (navState) => {
        console.log ('webview = onNavigationStateChange=' + navState);
        console.log ( navState);
        console.log ( navState.url);

        if (navState.url != "https://mystamford.edu.sg/parent-dashboard")
        {
              this.setState({canGoBack: navState.canGoBack})
        } else {
            this.setState({canGoBack: false});
        }

        if (navState.url == "https://mystamford.edu.sg/logout.aspx")
        {
            this.props.setauthSecret('')
            console.log("PROCESS LOGOUT - CLEAR SECRET")
        }


        var string = navState.url;

        if ((string.indexOf("ffauth_secret") ) > 1) {
          console.log ('we have ffatah secret - need to grab it')
          var authSecret = getParameterByName('ffauth_secret', string);
          console.log ('foo=' + authSecret)
          this.props.setauthSecret(authSecret)
          console.log ('redux auth =' + this.props.userX.authSecret)
        }  else {
          console.log ('no auth secret in URL')
        }
  }

  onBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  componentWillMount() {


    console.log ('componentWillMount')



        if (this.props.userX.name ) {
          //we have a value, good

        } else {
          //nothing :-(
          //  Actions.login();
        };

        if (this.props.userX.password ) {
          //we have a value, good

        } else {
          //nothing :-(
          //  Actions.login();
        };


  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }

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

          var authSecret = this.props.userX.authSecret

          console.log ('A=' + authSecret)
            if (undefined !== authSecret && null !== authSecret &&  authSecret.length > 5) {

            //we have an auth secret
                console.log ('B')

            this.state.url = 'https://mystamford.edu.sg/login/api/getsession?ffauth_device_id=SAISPTA&ffauth_secret=MERGE_AUTH_SECRET&prelogin=https://mystamford.edu.sg/parent-dashboard';
            this.state.url = this.state.url.replace("MERGE_AUTH_SECRET", authSecret );
//  this.state.url = 'https://mystamford.edu.sg';
          } else {
                console.log ('C')
            this.state.url = 'https://mystamford.edu.sg/login/api/webgettoken?app=SAISPTA&successURL=https://saispta.com/app/success&failURL=https://saispta.com/app/fail';
          }

        //  this.state.url = 'https://mystamford.edu.sg/login/api/webgettoken?app=SAISPTA&successURL=https://saispta.com/app/success&failURL=https://saispta.com/app/fail';


//this.state.url = 'https://saispta.com/app/Authentication.php';

//this.state.url = 'https://mystamford.edu.sg/login/api/getsession?ffauth_device_id=AB305CAC-1373-4C13-AA04-79ADB8C17854&ffauth_secret=89b4f72988148141a6ba2248896610c4&prelogin=https://mystamford.edu.sg/'
       console.log('going here > ' + this.state.url );


    return (
  <Container>
       <HeaderContent />
      <View style={{ flex:1}}>

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
             scalesPageToFit={true}
             //injectedJavaScript={injectScript}
             ref={WEBVIEW_REF}
           />


  </View>



        </Container>
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
