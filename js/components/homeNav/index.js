

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, View, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Container, Content, Footer, FooterTab, Text, Thumbnail, Icon, Button } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import HeaderContent from './../headerContent/header';

import { openDrawer } from '../../actions/drawer';
import Sentry from 'sentry-expo';
import Expo from 'expo';

import { MapView } from 'expo';

import theme from '../../themes/base-theme';
import styles from './styles';

import Communications from 'react-native-communications';

class HomeNav extends Component {

  constructor() {
       super()
       this.state = {
          versionText: '' //'Version Aug.1.2017 - Check for an Update'
       }
    }

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  _checkForUpdate() {
    this.setState({versionText: ''})
    Expo.Util.reload();
  }


  render() {
    return (
      <Container>
          <HeaderContent
            showHome='false'
           />
          <Content showsVerticalScrollIndicator={false}>
            <View style={styles.linkTabs}>
              <Grid>

              <Row style={{paddingTop: 40}}>
                <Col>
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.contact(); }} >
                    <Icon style={styles.icon} name="ios-call-outline" />
                  </Button>
                    <Text note style={styles.buttonLabel}>Contact</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.home(); }} >
                    <Icon style={styles.icon} name="ios-calendar-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>Calendar</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.webportal(); }} >
                    <Icon style={styles.icon} name="ios-grid" />
                    </Button>
                      <View style={{flex: 1, flexDirection: 'row',     alignSelf: 'center'}}>

                        <Icon style={styles.iconLabel} name="ios-lock-outline" />
                        <Text note style={styles.buttonLabel}> myStamford</Text>
                  </View>
                </Col>
            </Row>
            <Row style={{paddingTop: 20, paddingBottom: 40}}>
              <Col>
              <Button transparent style={styles.roundedButton}  onPress={() => { Actions.webportalSports(); }} >
                  <Icon style={styles.icon} name="ios-football-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Athletics</Text>
              </Col>

              <Col>
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.ptaHome(); }} >
                  <Icon style={styles.icon} name="ios-people-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>PTA</Text>
              </Col>

              <Col>
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.campusMap(); }} >
                  <Icon style={styles.icon} name="ios-map-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>School Map</Text>
              </Col>

            </Row>
              </Grid>
            </View>
            <View style={styles.newsContentLine}>

              <TouchableOpacity style={{ flexDirection: 'row' }}  onPress={() => { Actions.ptaMovieNight(); }} >
                <Image source={require('../../../images/sais.edu.sg/movie_night_poster.jpg')} style={styles.newsImage} />

              <View style={styles.newsContentNoLine}>
                  <Text numberOfLines={1} style={styles.newsHeader}>
                                    ZOOTOPIA! PTA Family Movie Night
                                    </Text>

                                    <Text style={styles.newsTypeText}>
                                      6pm to 10pm Saturday September 30 on Stamford Field.
                                      The  movie screening will start at 7:30 PM
                                    </Text>

                <View style={{flexDirection: 'column'}}>
                  <Text numberOfLines={1} style={ styles.newsLink}></Text>
                  <Text style={styles.newsLink}></Text>
                </View>
                </View>
              </TouchableOpacity>
            </View>





            <View style={styles.newsContentLine}>


              <TouchableOpacity style={{ flexDirection: 'row' }}  onPress={() => { Actions.ptaHome(); }} >
                <Image source={require('../../../images/sais.edu.sg/pta_page_logo_small.png')} style={styles.newsImage} />
                <View style={styles.newsContentNoLine}>
                  <Text numberOfLines={1} style={styles.newsHeader}>
                                    PTA Parent Connection Groups
                                    </Text>

                                    <Text style={styles.newsTypeText}>
Are you interested in meeting people with similar interests within the Stamford community?
                                    </Text>

                <View style={{flexDirection: 'column'}}>
                  <Text numberOfLines={1} style={ styles.newsLink}></Text>
                  <Text style={styles.newsLink}></Text>
                </View>
                </View>
              </TouchableOpacity>
            </View>

            <View>
            <MapView

                   initialRegion={{
                     latitude: 37.78825,
                     longitude: -122.4324,
                     latitudeDelta: 0.0922,
                     longitudeDelta: 0.0421,
                   }}
                 />
            </View>

            <Button style={styles.betaButton} transparent onPress={() => { this._checkForUpdate(); }}>
              <View style={styles.betaView}>
                  <Text style={styles.beta}>
                    <Icon style={styles.beta} name="md-pulse" />
                  </Text>
              </View>
            </Button>
          </Content>

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(HomeNav);
