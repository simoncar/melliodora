
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, View, Platform } from 'react-native';

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

          <Content showsVerticalScrollIndicator={false}>
            <View style={styles.overviewHeaderContainer}>
              <Text style={styles.overviewHeader}>WIDGETS</Text>
            </View>

            <Image source={require('../../../images/Widgets/widget1.png')} style={styles.mainWidget}>
              <Grid style={styles.mainWidgetContainer}>
                <Col>
                  <Icon name="ios-cloud-outline" style={{ fontSize: 40 }} />
                  <Text style={{ fontWeight: '700' }}>Partly Cloudy</Text>
                  <Text style={{ opacity: 0.7, fontWeight: '700' }}>Stamford Field</Text>
                </Col>
                <Col style={{ alignItems: 'flex-end' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.weather}>31</Text>
                    <Icon name="ios-radio-button-off" style={{ fontSize: 16, marginTop: 5 }} />
                  </View>
                </Col>
              </Grid>

              <Grid style={styles.weatherInfoContainer}>
                <Col style={{ alignItems: 'center' }}>
                  <Text style={styles.weatherInfo}>26</Text>
                  <Text style={styles.weatherTime}>8 AM</Text>
                </Col>
                <Col style={{ alignItems: 'center' }}>
                  <Text style={styles.weatherInfo}>28</Text>
                  <Text style={styles.weatherTime}>10 AM</Text>
                </Col>
                <Col style={{ alignItems: 'center' }}>
                  <Text style={styles.weatherInfo}>31</Text>
                  <Text style={styles.weatherTime}>Noon</Text>
                </Col>
                <Col style={{ alignItems: 'center' }}>
                  <Text style={styles.weatherInfo}>32</Text>
                  <Text style={styles.weatherTime}>2 PM</Text>
                </Col>
                <Col style={{ alignItems: 'center' }}>
                  <Text style={styles.weatherInfo}>31</Text>
                  <Text style={styles.weatherTime}>4 PM</Text>
                </Col>
                <Col style={{ alignItems: 'center' }}>
                  <Text style={styles.weatherInfo}>30</Text>
                  <Text style={styles.weatherTime}>6 PM</Text>
                </Col>
              </Grid>
            </Image>

            <Grid>
              <Col>
                <Image source={require('../../../images/Widgets/widget2.png')} style={styles.otherWidget}>
                  <View style={styles.otherWidgetContainer}>
                    <Text style={styles.widgetName}>
                                            KUMAR SANKET
                                        </Text>
                    <Text style={styles.blueRatingPerc}>+0.51%</Text>
                    <Text style={styles.ratingNum}>5,055.55</Text>
                    <Button
                      bordered
                      rounded small
                      style={styles.detailsBtn}
                      textStyle={Platform.OS === 'android' ?
                                                { color: primary, fontSize: 12, fontWeight: '900', textAlign: 'center' } :
                                                { color: primary, fontSize: 12, fontWeight: '900', textAlign: 'center' }}
                    >
                      <Text>Details</Text>
                    </Button>
                  </View>
                </Image>
              </Col>
              <Col>
                <Image source={require('../../../images/Widgets/widget3.png')} style={styles.otherWidget}>
                  <View style={styles.otherWidgetContainer}>
                    <Text style={styles.widgetName}>
                                            KUMAR PRATIK
                                        </Text>
                    <Text style={styles.redRatingPerc}>-0.31%</Text>
                    <Text style={styles.ratingNum}>4,567.00</Text>
                    <Button
                      bordered
                      rounded small
                      style={styles.detailsBtn}
                      textStyle={Platform.OS === 'android' ?
                                                { color: primary, fontSize: 12, fontWeight: '900', textAlign: 'center' } :
                                                { color: primary, fontSize: 12, fontWeight: '900', textAlign: 'center' }}
                    >
                      <Text>Details</Text>
                    </Button>
                  </View>
                </Image>
              </Col>
            </Grid>
          </Content>
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
