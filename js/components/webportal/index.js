
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {  WebView, Image, View, Platform } from 'react-native';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { openDrawer } from '../../actions/drawer';

import * as  ActionCreators  from '../../actions'

import theme from '../../themes/base-theme';
import styles from './styles';
import {getUsername, getPassword} from '../global.js'

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

    injectScript = 'document.getElementById(\"username\").value=\"' + this.props.userX.name+ '\"';
    injectScript = injectScript + ';' +  'document.getElementById(\"password\").value=\"' + this.props.userX.password + '"';
    injectScript = injectScript + ';' +  'document.forms[0].submit()';
    injectScript = injectScript + ';' +  'document.getElementsByClassName(\"ff-login-personalised-logo\")[0].style.visibility = \"hidden\";';
    injectScript = injectScript + ';' +  'document.getElementsByClassName(\"global-logo\")[0].style.visibility = \"hidden\";';
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

          <View style={{
                 flex: 1,
                 flexDirection: 'row',
                 justifyContent: 'space-between',
               }}>

                <View>
                       <Button transparent onPress={this.props.openDrawer} >
                                  <Icon active name="menu" />
                       </Button>
                </View>

                  <Body>
                    <Image source={headerLogo} style={styles.imageHeader} />
                  </Body>
                <View>
                <Button transparent>
                  <Icon active name="ios-restaurant" onPress={this.pressGoButton}/>
                </Button>
                </View>
            </View>

          </Header>





          <WebView

              source={{uri: this.state.url}}
               javaScriptEnabled={true}
               domStorageEnabled={true}
               startInLoadingState={true}
   injectedJavaScript={injectScript}
               ref={WEBVIEW_REF}
             />

        </Image>
      </Container>
    );
  };


 getInjectScript() {

  var injectScript = 'document.getElementById(\"username\").value=\"' + this.props.userX.name + '\"';
  injectScript = injectScript + ';' +  'document.getElementById(\"password\").value=\"aaa"';
  injectScript = injectScript + ';' +  'document.forms[0].submit()';
  //injectedJavaScript={}

console.log(injectScript);
return{
  injectScript
}
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators (ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
  passwordX: state.password
});

export default connect(mapStateToProps, mapDispatchToProps)(Webportal);
