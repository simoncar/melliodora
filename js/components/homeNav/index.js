
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, ListView, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Icon, Button } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Expo, Constants, Notifications } from 'expo';
import moment from 'moment';

import * as ActionCreators from '../../actions';
import HeaderContent from './../headerContent/header';

import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

import Communications from 'react-native-communications';

import * as firebase from 'firebase';

var calendarEvents = [];

const ListItem = require('./ListItem');
var instID = Constants.manifest.extra.instance;

const token =  Notifications.getExpoPushTokenAsync();
console.log (token);

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


    console.log("D= ",Constants.installationId)
  }

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
      var today = new moment().format(); ;

      snap.forEach((child) => {

        var displayStart = moment().format(child.val().displayStart);
        var displayEnd = moment().format(child.val().displayEnd);
  
        if (displayStart <= today) {
          //start is less than End 
        
          if (displayEnd >= today) {
            //start is less than End 
            
              items.push({
                title: child.val().summary,
                description: child.val().description,
                photoSquare: child.val().photoSquare,
                url: child.val().htmlLink,
                eventDate: child.val().date_start,
                eventStartTime: child.val().time_start_pretty,
                eventEndTime: child.val().time_end_pretty,
                photo1: child.val().photo1,
                photo2: child.val().photo2,
                photo3: child.val().photo3,
                _key: child.key,
              });
         }  
        
        }
  
      });

      this.setState({
        calendarEvents: this.state.calendarEvents.cloneWithRows(items)
      });

    });

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

              <Row style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.contact(); }} >
                    <Icon style={styles.icon} name="ios-call-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Contact</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.home(); }} >
                    <Icon style={styles.icon} name="ios-calendar-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Calendar</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton} onPress={() => { Actions.webportal(); }} >
                    <Icon style={styles.icon} name="ios-grid" />
                  </Button>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>

                    <Icon style={styles.iconLabel} name="ios-lock-outline" />
                    <Text note style={styles.buttonLabel}> {global.switch_portalName}</Text>
                  </View>
                </Col>
              </Row>
              {instID == '0001-sais_edu_sg' &&
                <Row style={{ paddingBottom: 20 }}>
                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.webportalSports(); }} >
                      <Icon style={styles.icon} name="ios-football-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>Athletics</Text>
                  </Col>
                  <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.ptaHome(); }} >
                      <Icon style={styles.icon} name="ios-people-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>PTA</Text>
                  </Col>

                    <Col>
                    <Button transparent style={styles.roundedButton} onPress={() => { Actions.campusMap(); }} >
                      <Icon style={styles.icon} name="ios-map-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>School Map</Text>
                  </Col>
                </Row>
              }




            </Grid>
          </View>

    {( 
        Constants.installationId == '3C57D89E-B681-48D0-B5A9-B2C2E5530F3B' || 
        Constants.installationId == '7C62DC60-A3B6-41F1-BC09-0A2C9147C1BD' || 
        Constants.installationId == '439F507C-8227-4594-92B3-1779E6ED69D0' || 
        Constants.installationId == '5DDB6D11-46F0-4B6D-8530-8AA29F1C9B2C' || 
        Constants.installationId == '4a7cc323-62af-403c-82cb-a82c4a56325a' || 
        Constants.installationId == '68855F63-EB66-4D78-A2C9-BCC042712EE7' || 
        Constants.deviceId == '3C57D89E-B681-48D0-B5A9-B2C2E5530F3B' || 
        Constants.deviceId == '7C62DC60-A3B6-41F1-BC09-0A2C9147C1BD' || 
        Constants.deviceId == '439F507C-8227-4594-92B3-1779E6ED69D0' || 
        Constants.deviceId == '5DDB6D11-46F0-4B6D-8530-8AA29F1C9B2C' || 
        Constants.deviceId == '68855F63-EB66-4D78-A2C9-BCC042712EE7' || 
        Constants.deviceId == '4a7cc323-62af-403c-82cb-a82c4a56325a'  
        ) &&
            <View style={styles.newsContentLine}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { Actions.chat({ chatroom: 'CXS' }); }} >
                <Image source={require('../../../images/sais.edu.sg/chatBubble.png')} style={styles.newsImage} />
                <View style={styles.newsContentNoLine}>
                  <Text numberOfLines={1} style={styles.newsHeader}>
                    Chat Test
                    </Text>
                  <Text style={styles.newsTypeText}>
                    This panel only shows for a few select people
                    </Text>
                  <View style={{ flexDirection: 'column' }}>
                    <Text numberOfLines={1} style={styles.newsLink}></Text>
                    <Text style={styles.newsLink}></Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          }




          <View style={styles.newsContentLine}>
            <ListView
              dataSource={this.state.calendarEvents}
              renderRow={this._renderItem.bind(this)}
              enableEmptySections={true}
              style={styles.listview} />

          </View>

          {instID == '0001-sais_edu_sg' &&
            <View style={styles.newsContentLine}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { Actions.ptaHome(); }} >
                <Image source={require('../../../images/sais.edu.sg/pta_page_logo_small.png')} style={styles.newsImage} />
                <View style={styles.newsContentNoLine}>
                  <Text numberOfLines={1} style={styles.newsHeader}>
                    PTA Parent Connection Groups
                    </Text>
                  <Text style={styles.newsTypeText}>
                    Are you interested in meeting people with similar interests within the Stamford community?
                    </Text>
                  <View style={{ flexDirection: 'column' }}>
                    <Text numberOfLines={1} style={styles.newsLink}></Text>
                    <Text style={styles.newsLink}></Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          }

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


  _renderItem(item) {
    return (
      <ListItem item={item} onPress={() => { Actions.ptaHome(); }} />
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