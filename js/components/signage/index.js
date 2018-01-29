import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {  WebView, Image, View, Platform } from 'react-native';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { openDrawer } from '../../actions/drawer';

import { ActionCreators } from '../../actions'

import theme from '../../themes/base-theme';
import styles from './styles';
import {getUsername, getPassword} from '../global.js'

const primary = require('../../themes/variable').brandPrimary;

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

  }

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
              <Image source={require('../../../images/Header-Logo-White-0002.png')} style={styles.imageHeader} />
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



return{

}
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
