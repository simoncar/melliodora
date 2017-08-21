

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, View, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Thumbnail, Icon, Button } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import HeaderContent from './../headerContent/';
import { openDrawer } from '../../actions/drawer';
import Sentry from 'sentry-expo';
import Expo from 'expo';

import theme from '../../themes/base-theme';
import styles from './styles';

class HomeNav extends Component {

  constructor() {
       super()
       this.state = {
          versionText: 'Check your on the latest version' //'Version Aug.1.2017 - Check for an Update'
       }
    }

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  _checkForUpdate() {
    this.setState({versionText: 'Up to date - Check again soon'})
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


              <TouchableOpacity style={{ flexDirection: 'row' }}   onPress={() => { Actions.webportalVote()}}>
                <Image source={require('../../../images/sais.edu.sg/coffee2.jpg')} style={styles.newsImage} />
                <View style={styles.newsContentNoLine}>
                  <Text numberOfLines={1} style={styles.newsHeader}>
                                      Welcome Orientation
                                    </Text>

                                    <Text style={styles.newsTypeText}>
                                      Meet new and returning parents,
                                      explore the Stamford events,
                                      Parent Connections, volunteering opportunitie and more!
                                    </Text>

                <View style={{flexDirection: 'column'}}>
                  <Text numberOfLines={1} style={ styles.newsLink}>Aug 22nd, 9am - 11am</Text>
                  <Text style={styles.newsLink}>REAGAN THEATRE</Text>
                </View>
                </View>
              </TouchableOpacity>
            </View>


            <Button style={styles.betaButton} transparent onPress={() => { this._checkForUpdate(); }}>

                        <View style={styles.betaView}>
                            <Text numberOfLines={2} style={styles.beta}>
                                {this.state.versionText}
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
