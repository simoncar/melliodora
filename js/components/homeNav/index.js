
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Image, ListView, View, TouchableOpacity } from 'react-native';
import * as  ActionCreators  from '../../actions'

import { Actions } from 'react-native-router-flux';
import { Container, Content, Footer, FooterTab, Text, Thumbnail, Icon, Button } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import HeaderContent from './../headerContent/header';
import Analytics from '../../lib/analytics';

import { openDrawer } from '../../actions/drawer';
import Sentry from 'sentry-expo';
import Expo from 'expo';

import { Constants } from 'expo';

import theme from '../../themes/base-theme';
import styles from './styles';

import Communications from 'react-native-communications';

import * as firebase from 'firebase';

var calendarEvents = [];

const ListItem = require('./ListItem');
var instID = Constants.manifest.extra.instance;

//instID = "0001-sais_edu_sg"
//instID = "0002-singaporepoloclub"

//      "instance": "0001-sais",
//"instanceX": "0002-singaporepoloclub"

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
       
    }

  componentDidMount(){
    this.listenLoadFromFirebase(this.calendarEvents);
    }

  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }


  _checkForUpdate() {
    this.setState({versionText: ''})
    Expo.Util.reload();
  }

  listenLoadFromFirebase(calendarEvents) {

    calendarEvents.on('value', (snap) => {

         var items = [];
         snap.forEach((child) => {
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
             _key: child.key
           });
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

              <Row style={{paddingTop: 20, paddingBottom: 20}}>
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
                        <Text note style={styles.buttonLabel}> {global.switch_portalName}</Text>
                  </View>
                </Col>
            </Row>

       {instID == '0001-sais_edu_sg' &&


            <Row style={{ paddingBottom: 20}}>
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

      }


              </Grid>
            </View>

      <View style={styles.newsContentLine}>
        <ListView
                dataSource={this.state.calendarEvents}
                renderRow={this._renderItem.bind(this)}
                enableEmptySections={true}
                style={styles.listview}/>

      </View>


      {instID == '0001-sais_edu_sg' &&
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
      }

            <Button style={styles.betaButton} transparent onPress={() => { this._checkForUpdate(); }}>
              <View style={styles.betaView}>
                  <Text style={styles.beta}>
                    <Icon style={styles.beta} name="md-pulse" /> Check for Updates <Icon style={styles.beta} name="md-pulse" /> 
                  </Text>
                  
                 
              </View>
            </Button>
                
                <View>
                  <Text style={styles.version}>Release Channel {Constants.manifest.releaseChannel}</Text>
                  <Text style={styles.version}>Version {Constants.manifest.revisionId}</Text>
                   <Text style={styles.version}>SDK {Constants.manifest.sdkVersion}</Text>
                   <Text style={styles.version}>Name {Constants.manifest.name}</Text>
                   <Text style={styles.version}>Instance {Constants.manifest.extra.instance}</Text>
                   <Text style={styles.version}> </Text>
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
  return bindActionCreators (ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
  ffauth_device_idX: state.ffauth_device_id,
  ffauth_secretX: state.ffauth_secret
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeNav);