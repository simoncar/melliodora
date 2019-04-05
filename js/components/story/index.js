
import React, { Component } from 'react';
import { WebView, Linking, View, TouchableOpacity, TouchableHighlight, Switch, Platform, Dimensions, Share } from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Content, Text, Button, Icon, Body } from 'native-base';
import { Ionicons, EvilIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';

import { Image } from "react-native-expo-image-cache";

import { openDrawer } from '../../actions/drawer';

import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

import styles from './styles';
import call from 'react-native-phone-call'  //TODO migration to communications

import Analytics from '../../lib/analytics';
import { Constants, Notifications } from 'expo';

import { formatTime, formatMonth, getAbbreviations, isAdmin } from '../global.js';

import * as firebase from 'firebase';

var instID = Constants.manifest.extra.instance;

const deviceWidth = Dimensions.get('window').width;
const primary = require('../../themes/variable').brandPrimary;

let WEBVIEW_REF = 'storWebview';
let DEFAULT_URL = '';

class Story extends Component {

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

    // analytics  -----
    const trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username,
      story: `${this.props.navigation.getParam('eventDate')  } - ${  this.props.navigation.getParam('eventTitle')}`,
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.EVENT_STORY, trackingOpts);
    // analytics --------
  }

  _shareMessage() {
  
    Share.share({
      message: '' + this.props.navigation.getParam('eventTitle') + '\n' + formatMonth(this.props.navigation.getParam('eventDate')) + '\n' + formatTime(this.props.navigation.getParam('eventStartTime')) + this.props.navigation.getParam('eventEndTime') + ' \n' + this.props.navigation.getParam('location') + ' \n' + this.props.navigation.getParam('eventDescription'),
      title: this.props.navigation.getParam('eventTitle'),
    })
    
      .then(this._showResult)
      .catch(error => this.setState({ result: `error: ${  error.message}` }));
  }

  _call() {
    const args = {
      number: this.props.navigation.getParam('phone'), // String value with the number to call
      prompt: true, // Optional boolean property. Determines if the user should be prompt prior to the call
    };

    call(args).catch(console.error);
  }

  _email() {
    // TODO: only show email/phone links when there are values
    Communications.email([this.props.navigation.getParam('email')], null, null, null, null);
  }

  _handleOpenWithLinking = (sURL) => {
    let ret;

    if (sURL.indexOf('https://www.facebook.com/groups/') !== -1) {
      ret = sURL.substring(32);

      if (Platform.OS === 'android') {
        sURL = `fb://group/${  ret}`;
      } else {
        sURL = `fb://profile/${  ret}`;
      }
    } else {
      ret = '';
    }


    console.log(sURL);

    Linking.openURL(sURL);
  }

  _formatWeb(sURL) {
    if (sURL.length > 0) {
      return (
        <WebView
          source={{ uri: 'https://github.com/facebook/react-native' }}
          javaScriptEnabled
        />
      );
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
    Communications.email(email, null, null, null, null);
  }

  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    const pattern = /\[(@[^:]+):([^\]]+)\]/i;
    const match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }


  setNotifyPreference() {
    // Get the token that uniquely identifies this device
    const token = Notifications.getExpoPushTokenAsync();

    this.notifyRef = firebase.database().ref(`instance/${  instID  }/feature/${  this.props.navigation.getParam('_key')  }/notify/`);

    this.notifyRef.update({
      token: 'sdvaiushviuasjbnviuasviasviivh',
    });
  }
  
  render() {


    const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=" };
    const uri = this.props.navigation.getParam('photo1');
    
    return (
      <Container style={{ backgroundColor: '#fff' }}>

        <Header style={styles.header}>
          <View style={styles.viewHeader}>
            <View style={styles.btnHeader}>
              <Button transparent style={styles.btnHeader} onPress={() => Actions.pop()}>
                <Icon active name="arrow-back" style={styles.btnHeader} />
              </Button>
            </View>
            <Body>
              <Text style={styles.textHeader}>Stamford</Text>
            </Body>
            <View style={styles.btnHeader}>

              <Button
                transparent
                onPress={() => this._shareMessage()}>

                <EvilIcons
                  name="share-apple"
                  style={styles.headerIcons}
                />
              </Button>
            </View>
          </View>
        </Header>


        <Content showsVerticalScrollIndicator={false}>

          {undefined !== this.props.navigation.getParam('photo1') && this.props.navigation.getParam('photo1') !== null && this.props.navigation.getParam('photo1').length > 0
            && <View>  
              <Image  style={styles.storyPhoto} {...{preview, uri}} />
            </View>
          }

          <View style={{ flex: 1 }}>
            <View style={styles.newsContent}>
              <Text selectable style={styles.eventTitle}>
                {this.props.navigation.state.params.eventTitle}
              </Text>

              {undefined !== this.props.navigation.getParam('eventDate') && this.props.navigation.getParam('eventDate') !== null && this.props.navigation.getParam('eventDate').length > 1
                && <Text selectable style={styles.eventText}>
                  {formatMonth(this.props.navigation.getParam('eventDate'))}
                </Text>
              }

              {undefined !== this.props.navigation.getParam('eventStartTime') && this.props.navigation.getParam('eventStartTime') !== null && this.props.navigation.getParam('eventStartTime').length > 0
                && <Text selectable style={styles.eventText}>{formatTime(this.props.navigation.getParam('eventStartTime'), this.props.navigation.getParam('eventEndTime'))}</Text>
              }

              <ParsedText
                style={styles.eventText}
                parse={
                  [
                    { type: 'url', style: styles.url, onPress: this._handleOpenWithLinking },
                    { type: 'phone', style: styles.phone, onPress: this.handlePhonePress },
                    { type: 'email', style: styles.email, onPress: this.handleEmailPress },
                    { pattern: /Bobbbbb|Davidfffff/, style: styles.name, onPress: this.handleNamePress },
                    {
 pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: this.handleNamePress, renderText: this.renderText 
},
                    { pattern: /433333332/, style: styles.magicNumber },
                    { pattern: /#(\w+)/, style: styles.hashTag },
                  ]
                }
                childrenProps={{ allowFontScaling: false }}
              >
                {this.props.navigation.getParam('eventDescription')}
              </ParsedText>
            </View>

            {undefined !== this.props.navigation.getParam('location') && this.props.navigation.getParam('location') !== null && this.props.navigation.getParam('location').length > 0
                && <View style={{ padding: 20 }}>
                  <View style={styles.eventText}>
                  <Text selectable style={styles.eventText}>
                  {this.props.navigation.state.params.location}
                </Text>
                </View>
                </View>
                }


            {undefined !== this.props.navigation.state.params.phone && this.props.navigation.state.params.phone !== null && this.props.navigation.state.params.phone.length > 0
              && <TouchableOpacity>
                <View style={{ padding: 20 }}>
                <View style={styles.eventText}>
                  <Text style={styles.eventText}>
                    <MaterialIcons name="phone" style={styles.eventIcon} />   
{' '}
{this.props.navigation.state.params.phone}
                  </Text>
                </View>
              </View>
              </TouchableOpacity>
              }


            {undefined !== this.props.navigation.state.params.email && this.props.navigation.state.params.email !== null && this.props.navigation.state.params.email.length > 0
               && <TouchableOpacity>
                 <View style={{ padding: 20 }}>
                 <View style={styles.eventText}>
                   <Text style={styles.eventText}>
                     <MaterialIcons name="email" style={styles.eventIcon} />   
{' '}
{this.props.navigation.state.params.email}
                   </Text>
                 </View>
               </View>
               </TouchableOpacity>
              }
  
            <TouchableOpacity onPress={() => { Actions.chat({ chatroom: this.props.navigation.state.params.eventTitle }); }}>
              <View style={{ padding: 20 }}>
                  <View style={styles.eventText}>
                    <Text style={styles.eventText}>
                      <SimpleLineIcons name="bubble" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
{' '}
Chat
</Text>
                  </View>
                </View>
            </TouchableOpacity>

            {undefined !== this.props.navigation.state.params.url && this.props.navigation.state.params.url !== null && this.props.navigation.state.params.url.length > 0

              && <TouchableOpacity onPress={() => { this._handleOpenWithLinking(this.props.navigation.state.params.url); }}>
                <View style={{ padding: 20 }}>
                  <View style={styles.eventText}>
                    <Text style={styles.eventText}>
                      <Icon name="md-link" style={styles.eventIcon} />
{' '}
More details...
</Text>
                  </View>
                </View>
              </TouchableOpacity>

            }
           

            <Text style={styles.eventText}>
                {this.props.navigation.state.params.eventImage}
              </Text>

            {undefined !== this.props.navigation.state.params.eventDate && this.props.navigation.state.params.eventDate.length > 0


              && <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('phoneCalendar',
                  {
                    eventTitle: this.props.navigation.state.params.eventTitle,
                    eventDescription: this.props.navigation.state.params.eventDescription,
                    eventDate: this.props.navigation.state.params.eventDate,
                    eventStartTime: this.props.navigation.state.params.eventStartTime,
                    eventEndTime: this.props.navigation.state.params.eventEndTime,
                    location: this.props.navigation.state.params.location,
                    eventImage: this.props.navigation.state.params.eventImage,
                    phone: this.props.navigation.state.params.phone,
                    email: this.props.navigation.state.params.email,
                    color: this.props.navigation.state.params.color,
                    photo1: this.props.navigation.state.params.photo1,
                    photo2: this.props.navigation.state.params.photo2,
                    photo3: this.props.navigation.state.params.photo3,
                    url: this.props.navigation.state.params.url,
                  },

                );
              }}
              >
                <View style={{ padding: 20 }}>
                  <View style={styles.eventText}>
                    <Text style={styles.eventText}>
                      <Ionicons name="ios-calendar" style={styles.eventIcon} />
{' '}
Add to Calendar
</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }

            {isAdmin(this.props.navigation.state.params.adminPassword)
              && <TouchableHighlight
style={styles.addButton}
underlayColor='#ff7043'
onPress={() => Actions.storyForm(
                {
                  eventTitle: this.props.navigation.state.params.eventTitle,
                  eventDescription: this.props.navigation.state.params.eventDescription,
                  eventDate: this.props.navigation.state.params.eventDate,
                  eventStartTime: this.props.navigation.state.params.eventStartTime,
                  eventEndTime: this.props.navigation.state.params.eventEndTime,
                  location: this.props.navigation.state.params.location,
                  eventImage: this.props.navigation.state.params.eventImage,
                  phone: this.props.navigation.state.params.phone,
                  email: this.props.navigation.state.params.email,
                  color: this.props.navigation.state.params.color,
                  photo1: this.props.navigation.state.params.photo1,
                  photo2: this.props.navigation.state.params.photo2,
                  photo3: this.props.navigation.state.params.photo3,
                  url: this.props.navigation.state.params.url,
                  displayStart: this.props.navigation.state.params.displayStart,
                  displayEnd: this.props.navigation.state.params.displayEnd,
                  photoSquare: this.props.navigation.state.params.photoSquare,
                  _key: this.props.navigation.state.params._key,
                  edit: true,
                }
              )}
              >
                <MaterialIcons name="edit" style={{ fontSize: 25, color: 'white' }} />
              </TouchableHighlight>
            }

          </View>

          <View style={{ padding: 20 }}>
                <Text selectable style={styles.eventTextAbbreviation}>
                {getAbbreviations(this.props.navigation.getParam('eventTitle'))}
                </Text>
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
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user,
  adminPassword: state.user.adminPassword,
});

export default connect(mapStateToProps, bindAction)(Story);
