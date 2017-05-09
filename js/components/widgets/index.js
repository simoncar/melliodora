
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  WebView, Image, View, Platform } from 'react-native';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLz76NsS1fjNXcaGBUhcp9qA-MFg1Hrg8",
  authDomain: "calendarapp-b7967.firebaseapp.com",
  databaseURL: "https://calendarapp-b7967.firebaseio.com",
  storageBucket: "calendarapp-b7967.appspot.com"
};

//firebase.initializeApp(firebaseConfig);

function storeHighScore(userId, score) {
  firebase.database().ref('users/' + userId).set({
    highscore: score
  });
};

const primary = require('../../themes/variable').brandPrimary;


function aa(myscore){
  alert('gata rhe ');

  firebase.database().ref('usersccc').set({
      highscore: myscore
    });

};

class Widgets extends Component {

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
                <Icon active name="add" onPress={() =>aa(4444)} />
              </Button>
            </Right>
          </Header>





            <WebView
                    source={{uri: 'https://mystamford.edu.sg/login/login.aspx?prelogin=http%3a%2f%2fmystamford.edu.sg%2f&kr=iSAMS:ParentPP'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                              startInLoadingState={true}
                  />


        </Image>
      </Container>
    );
  }
}




function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

export default connect(null, bindAction)(Widgets);
