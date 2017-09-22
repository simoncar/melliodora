
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {TouchableHighlight,Animated, Dimensions, TouchableOpacity, WebView,ScrollView, Image, View, Platform } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import FooterContent from './../headerContent/footer';
import HeaderContent from './../headerContent/header';

import { openDrawer } from '../../actions/drawer';

import * as  ActionCreators  from '../../actions'

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;
const timer = require('react-native-timer');


const headerLogo = require('../../../images/Header-Logo-White-0002.png');

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'http://www.stamfordlionsathletics.com/';


var injectScript  = '';

class WebportalSports extends Component {

  static propTypes = {

    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);

    injectScript = '';

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
  };


  render() {
    var source =  {uri: 'http://google.com'};
    return (
  <Container>
      <View style={{ flex:1}}>




               <View style={{flex:1}}>

               <WebView
                   source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    automaticallyAdjustContentInsets={false}
                    //onNavigationStateChange={this.onNavigationStateChange}
                    //onMessage={this._onMessage}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    injectedJavaScript={injectScript}
                    ref={WEBVIEW_REF}
                    style={{}}
                  />


               </View>



  </View>

    <FooterContent/>
      </Container>
    );
  };


  reload = () => {
     this.refs[WEBVIEW_REF].reload();
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

export default connect(mapStateToProps, mapDispatchToProps)(WebportalSports);
