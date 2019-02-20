import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { WebView, Linking, Image, View, TouchableOpacity, TouchableHighlight, Switch, Platform, Dimensions, Share } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Body } from 'native-base';
import { Ionicons, EvilIcons, MaterialIcons } from '@expo/vector-icons';


import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';
import Abbreviations from './abbreviations';
import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

import theme from '../../themes/base-theme';
import styles from './styles';
import call from 'react-native-phone-call'  //TODO migration to communications
import { Grid, Col } from 'react-native-easy-grid';

import Analytics from '../../lib/analytics';
import { Constants, Notifications } from 'expo';

import { formatTime, formatMonth, getAbbreviations, isAdmin } from '../global.js';

import * as firebase from 'firebase';

var instID = Constants.manifest.extra.instance;

import HeaderContent from './../headerContent/header/';

const deviceWidth = Dimensions.get('window').width;
const primary = require('../../themes/variable').brandPrimary;

var WEBVIEW_REF = 'storWebview';
var DEFAULT_URL = '';

class Story extends Component {

  static propTypes = {
    navigation: PropTypes.shape({ key: PropTypes.string }),
    username: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      animationType: 'slideInDown',
      open: false,
      value: 0,
      url: DEFAULT_URL,
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
      notifyUpdates: true,
    };

    //analytics  -----
    let trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username,
      story: this.props.eventDate + ' - ' + this.props.eventTitle
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.EVENT_STORY, trackingOpts);
    //analytics --------
  }

  _shareMessage() {
    console.log(formatMonth(this.props.eventDate));

    Share.share({
      message: "" + this.props.eventTitle + "\n" + formatMonth(this.props.eventDate) + "\n" + formatTime(this.props.eventStartTime, this.props.eventEndTime) + ' \n' + this.props.location + ' \n' + this.props.eventDescription,
      title: '' + this.props.eventTitle
    })
      .then(this._showResult)
      .catch((error) => this.setState({ result: 'error: ' + error.message }));
  };

  _call() {
    const args = {
      number: this.props.phone, // String value with the number to call
      prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
    }

    call(args).catch(console.error)
  }

  _email() {
    //TODO: only show email/phone links when there are values
    Communications.email([this.props.email], null, null, null, null)
  }

  _handleOpenWithLinking = (sURL) => {
    var ret

    if (sURL.indexOf('https://www.facebook.com/groups/') !== -1) {

      ret = sURL.substring(32);

      if (Platform.OS === 'android') {
        sURL = 'fb://group/' + ret
      } else {
        sURL = 'fb://profile/' + ret
      }


    } else {
      ret = ''
    }


    console.log(sURL);

    Linking.openURL(sURL);
  }

  _formatWeb(sURL) {

    if (sURL.length > 0) {
      return (
        <WebView
          source={{ uri: 'https://github.com/facebook/react-native' }}
          javaScriptEnabled={true}
        />
      )
    }
  }



  handleUrlPress(url) {
    LinkingIOS.openURL(url);
  }

  handlePhonePress(phone) {
    // AlertIOS.alert(`${phone} has been pressed!`);
  }

  handleNamePress(name) {
    // AlertIOS.alert(`Hello ${name}`);
  }

  handleEmailPress(email) {
    Communications.email(email, null, null, null, null)
  }

  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }


  setNotifyPreference() {

  // Get the token that uniquely identifies this device
  let token = Notifications.getExpoPushTokenAsync();

    this.notifyRef = firebase.database().ref('instance/' + instID + '/feature/' + this.props._key + '/notify/');

      this.notifyRef.update({
        token: 'sdvaiushviuasjbnviuasviasviivh',
      });
    };
  



  render() {

    return (
      <Container style={{ backgroundColor: '#fff' }}>

        <Header style={styles.header}>
          <View style={styles.viewHeader}>
            <View style={styles.btnHeader}>
              <Button transparent style={styles.btnHeader}  onPress={() => Actions.pop()}>
                <Icon active name="arrow-back" style={styles.btnHeader} />
              </Button>
            </View>
            <Body>
              <Text style={styles.textHeader}>Stamford</Text>
            </Body>
            <View style={styles.btnHeader}>

              <Button
                transparent
                onPress={() => this._shareMessage()} >

                <EvilIcons
                  name="share-apple"
                  style={styles.headerIcons} />
              </Button>
            </View>
          </View>
        </Header>



        <Content showsVerticalScrollIndicator={false}>

          {undefined !== this.props.photo1 && null !== this.props.photo1 && this.props.photo1.length > 0 &&
            <View >
              <Image source={{ uri: this.props.photo1 }} style={styles.storyPhoto} />
            </View>
          }


          <View style={{ flex: 1 }}>
            <View style={styles.newsContent}>
              <Text selectable={true} style={styles.eventTitle}>
                {this.props.eventTitle}
              </Text>



              {undefined !== this.props.eventDate && null !== this.props.eventDate && this.props.eventDate.length > 1 &&
                <Text selectable={true} style={styles.eventText}>
                  {formatMonth(this.props.eventDate)}
                </Text>
              }

              {undefined !== this.props.eventStartTime && null !== this.props.eventStartTime && this.props.eventStartTime.length > 0 &&
                <Text selectable={true} style={styles.eventText}>{formatTime(this.props.eventStartTime, this.props.eventEndTime)}</Text>
              }

             
              <ParsedText
                style={styles.eventText}
                parse={
                  [
                    { type: 'url', style: styles.url, onPress: this._handleOpenWithLinking },
                    { type: 'phone', style: styles.phone, onPress: this.handlePhonePress },
                    { type: 'email', style: styles.email, onPress: this.handleEmailPress },
                    { pattern: /Bobbbbb|Davidfffff/, style: styles.name, onPress: this.handleNamePress },
                    { pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: this.handleNamePress, renderText: this.renderText },
                    { pattern: /433333332/, style: styles.magicNumber },
                    { pattern: /#(\w+)/, style: styles.hashTag },
                  ]
                }
                childrenProps={{ allowFontScaling: false }}
              >
                {this.props.eventDescription}
              </ParsedText>



            </View>


            {undefined !== this.props.location && null !== this.props.location && this.props.location.length > 0 &&

                <View style={{ padding: 20 }}>
                <View style={styles.eventText}>
                <Text selectable={true} style={styles.eventText}>
                  {this.props.location}
                </Text>
                </View>
                </View>
                }


            {undefined !== this.props.phone && null !== this.props.phone && this.props.phone.length > 0 &&
              <TouchableOpacity>
              <View style={{ padding: 20 }}>
                <View style={styles.eventText}>
                  <Text style={styles.eventText}>
                    <MaterialIcons name="phone" style={styles.eventIcon} />   {this.props.phone}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
              }


            {undefined !== this.props.email && null !== this.props.email && this.props.email.length > 0 &&
               <TouchableOpacity>
               <View style={{ padding: 20 }}>
                 <View style={styles.eventText}>
                   <Text style={styles.eventText}>
                     <MaterialIcons name="email" style={styles.eventIcon} />   {this.props.email}
                   </Text>
                 </View>
               </View>
             </TouchableOpacity>
              }
 {isAdmin(this.props.adminPassword) &&
              <Grid style={{ padding: 20 }}>
                <Col>
                  <Text style={styles.eventText}>Notify Me of Updates</Text>
                </Col>
                <Col style={styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setNotifyPreference({ notifyUpdates: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.lowerelemSwitch}
                  />
                </Col>
              </Grid>
 }

            {undefined !== this.props.url && null !== this.props.url && this.props.url.length > 0 &&

              <TouchableOpacity onPress={() => { this._handleOpenWithLinking(this.props.url); }}>
                <View style={{ padding: 20 }}>
                  <View style={styles.eventText}>
                    <Text style={styles.eventText}>
                      <Icon name="md-link" style={styles.eventIcon} />   More details...
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

            }
              <View style={{ padding: 20 }}>
                <Text selectable={true} style={styles.eventTextAbbreviation}>
                  {getAbbreviations(this.props.eventTitle)}
                </Text>
              </View>

              <Text style={styles.eventText}>
                {this.props.eventImage}
              </Text>

            {undefined !== this.props.eventDate && this.props.eventDate.length > 0 &&


              <TouchableOpacity onPress={() => {
                Actions.phoneCalendar(
                  {
                    eventTitle: this.props.eventTitle,
                    eventDescription: this.props.eventDescription,
                    eventDate: this.props.eventDate,
                    eventStartTime: this.props.eventStartTime,
                    eventEndTime: this.props.eventEndTime,
                    location: this.props.location,
                    eventImage: this.props.eventImage,
                    phone: this.props.phone,
                    email: this.props.email,
                    color: this.props.color,
                    photo1: this.props.photo1,
                    photo2: this.props.photo2,
                    photo3: this.props.photo3,
                    url: this.props.url
                  }

                );
              }}>
                <View style={{ padding: 20 }}>
                  <View style={styles.eventText}>
                    <Text style={styles.eventText}>
                      <Ionicons name="ios-calendar" style={styles.eventIcon} />   Add to Calendar
                  </Text>
                  </View>
                </View>
              </TouchableOpacity>
            }

            {isAdmin(this.props.adminPassword) &&
              <TouchableHighlight style={styles.addButton} underlayColor='#ff7043' onPress={() => Actions.storyForm(
                {
                  eventTitle: this.props.eventTitle,
                  eventDescription: this.props.eventDescription,
                  eventDate: this.props.eventDate,
                  eventStartTime: this.props.eventStartTime,
                  eventEndTime: this.props.eventEndTime,
                  location: this.props.location,
                  eventImage: this.props.eventImage,
                  phone: this.props.phone,
                  email: this.props.email,
                  color: this.props.color,
                  photo1: this.props.photo1,
                  photo2: this.props.photo2,
                  photo3: this.props.photo3,
                  url: this.props.url,
                  displayStart: this.props.displayStart,
                  displayEnd: this.props.displayEnd,
                  _key: this.props._key,
                  edit: true,
                }
              )}>
                <MaterialIcons name="edit" style={{ fontSize: 25, color: 'white' }} />
              </TouchableHighlight>
            }

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

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  username: state.username,
  adminPassword: state.user.adminPassword,
});

export default connect(mapStateToProps, bindAction)(Story);
