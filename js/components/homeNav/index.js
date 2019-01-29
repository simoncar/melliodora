import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, ListView, FlatList, View, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Icon, Button } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Expo, Constants, Notifications } from 'expo';
import moment from 'moment';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isAdmin } from '../global.js';


import * as ActionCreators from '../../actions';
import HeaderContent from './../headerContent/header';

import { openDrawer } from '../../actions/drawer';

import styles from './styles';

import * as firebase from 'firebase';


const { width } = Dimensions.get('window');

var calendarEvents = [];

const ListItem = require('./ListItem');
var instID = Constants.manifest.extra.instance;

const token = Notifications.getExpoPushTokenAsync();
console.log(token);

class HomeNav extends Component {

  static propTypes = {

    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),

  }

  constructor(props) {
    super(props)

    this.calendarEvents = firebase.database().ref('instance/' + instID + '/feature');
    this.state = {
      versionText: '', //'Version Aug.1.2017 - Check for an Update'
      calendarEvents: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }


    console.log("D= ", Constants.installationId)
  }

  keyExtractor = (item) => item._key;

  componentDidMount() {
    this.listenLoadFromFirebase(this.calendarEvents);
  }
  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  listenLoadFromFirebase(calendarEvents) {

    calendarEvents.on('value', (snap) => {

      var items = [];
      var today = new moment().format();;


      snap.forEach((child) => {
        console.log (child.key);

        var displayStart = moment().format(child.val().displayStart);
        var displayEnd = moment().format(child.val().displayEnd);

        if (displayStart <= today) {
          //start is less than End 

          if (displayEnd >= today) {
            //start is less than End 

            items.push({
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
              _key: child.key,
            });
          }

        }

      });

      this.setState({
        calendarEvents: items,
      });

    });

  }

  _renderItem(item) {
    return (
      <ListItem item={item} />
    );
  }


  _renderItem23 = ({item}) =>
  <View >
    <Text style={{color: 'blue'}}>{item.title}</Text>   
  </View>;


  render() {
    return (
      <Container>
        <HeaderContent
          showHome='false'
        />
        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.linkTabs}>
            <Grid>

              <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.contact(); }} >
                    <Ionicons name="ios-call" style={styles.icon} />
                  </Button>
                  <Text note style={styles.buttonLabel}>Contact</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.home(); }} >
                    <Icon style={styles.icon} name="ios-calendar" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Calendar</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.webportal(); }} >
                    <Icon style={styles.icon} name="ios-grid" />
                  </Button>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>

                    <Icon style={styles.iconLabel} name="ios-lock" />
                    <Text note style={styles.buttonLabel}> {global.switch_portalName}</Text>
                  </View>
                </Col>
              </Row>
              {instID == '0001-sais_edu_sg' &&
                <Row style={{ paddingBottom: 20 }}>
                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.webportalSports(); }} >
                      <MaterialCommunityIcons style={styles.icon} name="soccer" />
                    </Button>
                    <Text note style={styles.buttonLabel}>Athletics</Text>
                  </Col>
                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.ptaHome(); }} >
                      <Icon style={styles.icon} name="ios-people" />
                    </Button>
                    <Text note style={styles.buttonLabel}>PTA</Text>
                  </Col>

                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.campusMap(); }} >
                      <Icon style={styles.icon} name="ios-map" />
                    </Button>
                    <Text note style={styles.buttonLabel}>School Map</Text>
                  </Col>
                </Row>
              }

            </Grid>
          </View>

          {isAdmin() &&


            <View style={styles.newsContentLine}>


              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { Actions.chatmain({ chatroom: 'CXS' }); }} >

                <View>
                  <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
                    <Image
                      style={{ width: 36, height: 36, margin: 12, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray' }}
                      source={require('../../../images/sais.edu.sg/chatBubble.png')}
                    />
                    <Text style={{ fontWeight: 'bold', height: 60, lineHeight: 60, flex: 1 }}>Chat Test</Text>
                    <Ionicons name="ios-more" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
                  </View>

                  <View>

                  </View>

                </View>

              </TouchableOpacity>

            </View >

          }
          <View style={styles.newsContentLine}>


          <FlatList
              data={this.state.calendarEvents}
              keyExtractor={this.keyExtractor}
              renderItem={this._renderItem}
            />

           
          </View>

          {instID == '0001-sais_edu_sg' &&


            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { Actions.ptaHome(); }} >

              <View>
                <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
                  <Image
                    style={{ width: 36, height: 36, margin: 12, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray' }}
                    source={{ uri: `https://saispta.com/wp-content/uploads/2018/12/Screenshot-2018-12-10-15.49.39.png` }}
                  />
                  <Text style={{ fontWeight: 'bold', height: 60, lineHeight: 60, color: "black" }}>Parent Connections </Text>

                </View>


                <View>
                  <Image
                    source={{ uri: `https://saispta.com/wp-content/uploads/2018/12/ISASAIS-2017-2018-0032-e1544427990824.jpg` }}
                    style={{ width, height: 200 }}
                    resizeMode={'contain'}
                  />
                </View>
              </View>
            </TouchableOpacity>


          }

          {isAdmin() &&
            <TouchableHighlight style={styles.addButton} underlayColor='#ff7043' onPress={() => Actions.new_quote()}>
              <Text style={{ fontSize: 25, color: 'white' }}>+</Text>
            </TouchableHighlight>
          }

          <View>
            <Text style={styles.version}> </Text>
            <Text style={styles.version}> </Text>

            <Text style={styles.version}> </Text>
          </View>
          <Image source={require('../../../images/sais.edu.sg/10yearLogo.png')} style={styles.tenYearLogo} />

          <View>
            <Text style={styles.version}> </Text>
            <Text style={styles.version}> </Text>
            <Text style={styles.version}>Version {Constants.manifest.revisionId}</Text>
            <Text style={styles.version}> </Text>
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
  ffauth_device_idX: state.ffauth_device_id,
  ffauth_secretX: state.ffauth_secret
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeNav);