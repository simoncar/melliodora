
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  WebView, Image, View, Platform } from 'react-native';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';
import {getUsername, getPassword} from '../global.js'

const primary = require('../../themes/variable').brandPrimary;

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://mystamford.edu.sg/login/login.aspx?prelogin=http%3a%2f%2fmystamford.edu.sg%2f&kr=iSAMS:ParentPP';

  var injectScript = 'document.getElementById(\"username\").value=\"' + getUsername() + '\"';
  injectScript = injectScript + ';' +  'document.getElementById(\"password\").value=\"' + getPassword() + '"';
  injectScript = injectScript + ';' +  'document.forms[0].submit()';
  //injectedJavaScript={injectScript}
class Widgets extends Component {


  state = {
    url: DEFAULT_URL,
    status: 'No Page Loaded',
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true,
  };


  render() {
    return (
      <Container>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <Header>
            <Left>
              <Button transparent onPress={this.props.openDrawer} >
                <Icon active name="menu" />
              </Button>
            </Left>

            <Body>
              <Image source={require('../../../images/Header-Logo-White-0001.png')} style={styles.imageHeader} />
            </Body>

            <Right>
              <Button transparent>
                <Icon active name="ios-restaurant" onPress={this.pressGoButton}/>
              </Button>

            </Right>
          </Header>

          <WebView

              source={{uri: this.state.url}}
               javaScriptEnabled={true}
               domStorageEnabled={true}
               startInLoadingState={true}

               ref={WEBVIEW_REF}
             />

        </Image>
      </Container>
    );
  };

  reload = () => {
     this.refs[WEBVIEW_REF].reload();
   };

  pressGoButton = () => {
      var url = 'http://mystamford.edu.sg/cafe/cafe-online-ordering#anchor';
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

function navigateCafe() {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

export default connect(null, bindAction)(Widgets);
