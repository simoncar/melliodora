
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { TouchableHighlight, Animated, TextInput, Dimensions, TouchableOpacity, WebView, ScrollView, Image, View, Platform } from 'react-native';
import { Actions, ActionConst } from 'react-navigation';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Grid, Col, Row } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Analytics from '../../lib/analytics';
import { Constants } from 'expo';

import HeaderContent from './../headerContent/header';

import { openDrawer } from '../../actions/drawer';

import * as  ActionCreators from '../../actions'

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'http://www.stamfordlionsathletics.com/';


const tabBarIcon = name => ({ tintColor }) => (
  <MaterialCommunityIcons
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

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

    //analytics  -----
    let trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username,
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.PAGE_ATHLETICS, trackingOpts);
    //analytics --------
  }

  state = {
    url: DEFAULT_URL,
    status: 'No Page Loaded',
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true, 
    cookies: {},
    webViewUrl: '',
  };

  static navigationOptions = {
    title: 'Athletics',
    tabBarColor: '#C10F2F',
    tabBarIcon: tabBarIcon('soccer'),
  };


  onNavigationStateChange = (navState) => {

    this.setState({ url: navState.url })

    if (navState.url != "https://mystamford.edu.sg/parent-dashboard") {
      this.setState({ canGoBack: navState.canGoBack })
    } else {
      this.setState({ canGoBack: false });
    }

    this.setState({ updateFirebaseText: navState.url })

    var string = navState.url;
  }

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
  }

  render() {
    var source = { uri: 'http://google.com' };
    return (
      <Container>
        <HeaderContent 
        navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2 }}>
            <View style={styles.topbar}>
              <TouchableOpacity
                disabled={!this.state.canGoBack}
                onPress={this.onBack.bind(this)}
              >
                <Icon style={styles.navIconLeft} active name="ios-arrow-back" />
              </TouchableOpacity>

              <TextInput
                ref='pageURL'
                //placeholder= {this.state.url}
                value={this.state.url}
                //  onChangeText={(user) => this.props.setUsername(user)}
                placeholderTextColor="#FFF"
                style={styles.input}
                autoCapitalize="none"
                //  keyboardType="email-address"
                selectionColor="#FFF"
                enablesReturnKeyAutomatically
                returnKeyType="return"
              //  onSubmitEditing={() => this.refs.PasswordInput.focus() }
              />

              <Icon style={styles.navIconRight} active name="ios-arrow-forward" />
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
              injectedJavaScript={injectScript}
              ref={WEBVIEW_REF}

            />
          </View>
        </View>


      </Container>
    );
  };




}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  userX: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(WebportalSports);
