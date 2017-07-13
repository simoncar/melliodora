
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {Dimensions, TouchableOpacity, WebView,ScrollView, Image, View, Platform } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import HeaderContent from './../headerContent/';

import { openDrawer } from '../../actions/drawer';

import * as  ActionCreators  from '../../actions'

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;

const headerLogo = require('../../../images/Header-Logo-White-0001.png');


var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://mystamford.edu.sg/login/login.aspx?prelogin=http%3a%2f%2fmystamford.edu.sg%2f&kr=iSAMS:ParentPP';

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


    if (this.props.userX.name ) {
      //we have a value, good

    } else {
      //nothing :-(
        Actions.login();
    };

    if (this.props.userX.password ) {
      //we have a value, good

    } else {
      //nothing :-(
        Actions.login();
    };

  }

  state = {
    url: DEFAULT_URL,
    status: 'No Page Loaded',
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true,
    cookies    : {},
    webViewUrl : ''

  };

  onNavigationStateChange = (webViewState: { url: string }) => {
console.log ('webview = onNavigationStateChange');
    //const { url } = webViewState;

    // when WebView.onMessage called, there is not-http(s) url
  //  if(url.includes('http')) {
//      this.setState({ webViewUrl: url })
  //  }
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




  render() {
    return (
      <ScrollView>
        <HeaderContent />

 <TouchableOpacity onPress={() => Actions.login()}>
        <View style={styles.settingsMessage} >
          <Grid>
          <Row>
            <Col style={{ width: 80 }}>
              <Button transparent style={styles.roundedButton}  onPress={() => Actions.login()} >
                <Icon name="settings" style={styles.settingsMessageIcon} />
              </Button>
            </Col>
            <Col>
                <Text style={styles.settingsMessageText}>Setup Username and Password</Text>
                <Text style={styles.settingsMessageText}>on settings page</Text>
            </Col>
         </Row>
         </Grid>

</View>
</TouchableOpacity>

         <View  style={{height: 800}}>
        <Text>This is above the WebView.</Text>
        <WebView
            source={{uri: this.state.url}}
             javaScriptEnabled={true}
             automaticallyAdjustContentInsets={false}
             //onNavigationStateChange={this.onNavigationStateChange}
             //onMessage={this._onMessage}
             domStorageEnabled={true}
             startInLoadingState={true}
             injectedJavaScript={injectScript}
             ref={WEBVIEW_REF}
           />
           <Text>This is below the WebView.</Text>
        </View>

  </ScrollView>
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
