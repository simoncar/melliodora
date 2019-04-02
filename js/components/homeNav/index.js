import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Image, ListView, FlatList, View, Linking, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  Container, Content, Text, Icon, Button,
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Constants, Notifications } from 'expo';
import moment from 'moment';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { isAdmin } from '../global.js';

import * as ActionCreators from '../../actions';
import HeaderContent from '../headerContent/header';

import { openDrawer } from '../../actions/drawer';

import styles from './styles';

const { width } = Dimensions.get('window');

const ListItem = require('./ListItem');

const instID = Constants.manifest.extra.instance;

const token = Notifications.getExpoPushTokenAsync();
const today = new moment().format();

class HomeNav extends Component {
  constructor(props) {
    super(props);

    this.calendarEvents = firebase.database().ref(`instance/${instID}/feature`);
    
    this.state = {
      user: null,
      loading: true,
      items: {},
    };

    this.loadFromRedux();
  }

  componentDidMount() {
    this.listenLoadFromFirebase(this.calendarEvents);
  }

  _handleOpenWithLinking = (sURL) => {
    Linking.openURL(sURL);
  }

  keyExtractor = item => item._key;

  loadFromRedux() {

    this.state.items = [];

    dataSnapshot = (this.props.calendarEventsX.items);
    key = '';

    console.log ("TTTTTTTTT");
    console.log (dataSnapshot);

    for (var key in dataSnapshot) {
      

      const snapshot = dataSnapshot[key];
      console.log ("LOADED: ", snapshot.summary)
        strtime = snapshot.date_start;
      
        const displayStart = (snapshot.displayStart !== undefined) ? moment().format(snapshot.displayStart) : null;
        const displayEnd = (snapshot.displayEnd !== undefined) ? moment().format(snapshot.displayEnd) : null;
        let hidden = true;

        if (displayStart != null && displayStart <= today) {
          // start is less than End

          if (displayStart != null && displayEnd >= today) {
            // start is less than End
            hidden = false;
          }
        }

        if (!hidden) {
          this.state.items.push({
            title: snapshot.summary,
            description: snapshot.description,
            location: snapshot.location,
            phone: snapshot.phone,
            email: snapshot.email,
            photoSquare: snapshot.photoSquare,
            url: snapshot.htmlLink,
            eventDate: snapshot.date_start,
            eventStartTime: snapshot.time_start_pretty,
            eventEndTime: snapshot.time_end_pretty,
            photo1: snapshot.photo1,
            photo2: snapshot.photo2,
            photo3: snapshot.photo3,
            displayStart: snapshot.displayStart,
            displayEnd: snapshot.displayEnd,
            hidden: false,
        });
      }
    }

  }





  listenLoadFromFirebase(calendarEvents) {
    calendarEvents.on('value', (dataSnapshot2) => {
      this.props.setFeatureItems(dataSnapshot2);
     
      dataSnapshot = dataSnapshot2;
      this.state.items = [];
      this.state.itemsHidden = [];

     

      dataSnapshot.forEach((child) => {
        const displayStart = (child.val().displayStart !== undefined) ? moment().format(child.val().displayStart) : null;
        const displayEnd = (child.val().displayEnd !== undefined) ? moment().format(child.val().displayEnd) : null;
        let hidden = true;

        if (displayStart != null && displayStart <= today) {
          // start is less than End

          if (displayStart != null && displayEnd >= today) {
            // start is less than End
            hidden = false;
          }
        }

        if (!hidden) {
  
          this.state.items.push({
            title:  child.val().summary + ".",
            description: child.val().description,
            location: child.val().location,
            phone: child.val().phone,
            email: child.val().email,
            photoSquare: child.val().photoSquare,
            url: child.val().htmlLink,
            eventDate: child.val().date_start,
            eventStartTime: child.val().time_start_pretty,
            eventEndTime: child.val().time_end_pretty,
            photo1: child.val().photo1,
            photo2: child.val().photo2,
            photo3: child.val().photo3,
            displayStart: child.val().displayStart,
            displayEnd: child.val().displayEnd,
            hidden: false,
            adminPassword: this.props.adminPassword,
            _key: child.key,
          });
        } else {
          this.state.itemsHidden.push({
            title: child.val().summary,
            description: child.val().description,
            location: child.val().location,
            phone: child.val().phone,
            email: child.val().email,
            photoSquare: child.val().photoSquare,
            url: child.val().htmlLink,
            eventDate: child.val().date_start,
            eventStartTime: child.val().time_start_pretty,
            eventEndTime: child.val().time_end_pretty,
            photo1: child.val().photo1,
            photo2: child.val().photo2,
            photo3: child.val().photo3,
            displayStart: child.val().displayStart,
            displayEnd: child.val().displayEnd,
            hidden: true,
            adminPassword: this.props.adminPassword,
            _key: child.key,
          });
        }
      });

      this.setState({
        calendarEvents,
      });


    });
  }

  _renderItem(item) {
    return (
      <ListItem item={item} />
    );
  }

  render() {
    return (
      <Container>

        <HeaderContent
          showHome="false"
        />

        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.linkTabs}>
            <Grid>

              <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.webportalSports(); }}>
                    <MaterialCommunityIcons style={styles.icon} name="soccer" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Athletics</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.home(); }}>
                    <Icon style={styles.icon} name="ios-calendar" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Calendar</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.webportal(); }}>
                    <Icon style={styles.icon} name="ios-grid" />
                  </Button>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>

                    <Icon style={styles.iconLabel} name="ios-lock" />
                    <Text note style={styles.buttonLabel}>
                      {' '}
                      {global.switch_portalName}
                    </Text>
                  </View>
                </Col>
              </Row>


            </Grid>
          </View>


          <View style={styles.newsContentLine}>
            <FlatList
              data={this.state.items}
              keyExtractor={this.keyExtractor}
              renderItem={this._renderItem.bind(this)}
            />
            {isAdmin(this.props.adminPassword)
            && (
            <FlatList
              data={this.state.calendarEventsHidden}
              keyExtractor={this.keyExtractor}
              renderItem={this._renderItem}
            />
            )
   }

          </View>

          {instID == '0001-sais_edu_sg'


            && (
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { Actions.ptaHome(); }}>

              <View>
                <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
                  <Image
                    style={{
  width: 36, height: 36, margin: 12, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray',
}}
                    source={{ uri: 'https://saispta.com/wp-content/uploads/2018/12/Screenshot-2018-12-10-15.49.39.png' }}
                  />
                  <Text style={{
 fontWeight: 'bold', height: 60, lineHeight: 60, color: 'black' 
}}>
                    Parent Connections
                    {' '}
{' '}
 
                  </Text>
                </View>
                <View>
                  <Image
                    source={{ uri: 'https://saispta.com/wp-content/uploads/2018/12/ISASAIS-2017-2018-0032-e1544427990824.jpg' }}
                    style={{ width, height: 200 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>
            )
          }

          <View>
            <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }} />
          </View>


          {instID == '0001-sais_edu_sg'
                && (
                <Row style={{ paddingBottom: 20 }}>
                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.contact(); }}>
                      <Ionicons name="ios-call" style={styles.icon} />
                    </Button>
                    <Text note style={styles.buttonLabel}>Contact</Text>
                  </Col>

                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.ptaHome(); }}>
                      <Icon style={styles.icon} name="ios-people" />
                    </Button>
                    <Text note style={styles.buttonLabel}>PTA</Text>
                  </Col>

                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.campusMap(); }}>
                      <Icon style={styles.icon} name="ios-map" />
                    </Button>
                    <Text note style={styles.buttonLabel}>School Map</Text>
                  </Col>
                </Row>
                )
              }

          {isAdmin(this.props.adminPassword)
            && (
            <TouchableHighlight
              style={styles.addButton}
              underlayColor="#ff7043"
              onPress={() => Actions.storyForm(

              )}
            >
              <Text style={{ fontSize: 25, color: 'white' }}>+</Text>
            </TouchableHighlight>
            )
          }

          <View>
            <Text style={styles.version} />
            <Text style={styles.version} />

            <Text style={styles.version} />
          </View>
          <Image source={require('../../../images/sais.edu.sg/10yearLogo.png')} style={styles.tenYearLogo} />

          <TouchableOpacity onPress={() => { this._handleOpenWithLinking('https://smartcookies.io'); }}>
            <Image source={require('../../../images/sais.edu.sg/SCLogo.png')} style={styles.sclogo} />
          </TouchableOpacity>

          <View>
            <Text style={styles.version} />
            <Text style={styles.version}>
              {' '}
            </Text>
            <Text style={styles.version}>
              Version:
              {' '}
              {Constants.manifest.revisionId}
            </Text>
            <Text style={styles.version}>
              {' '}
            </Text>
            <Text style={styles.version} />
          </View>
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

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
  adminPassword: state.user.adminPassword,
  ffauth_device_idX: state.ffauth_device_id,
  ffauth_secretX: state.ffauth_secret,
  calendarEventsX: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeNav);
