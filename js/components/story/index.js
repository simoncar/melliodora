import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { WebView, Linking, Image, View, TouchableOpacity, Platform, Slider, Dimensions, Share  } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, ListItem, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';


import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';
import Abbreviations from './abbreviations';
import ParsedText from 'react-native-parsed-text';

import theme from '../../themes/base-theme';
import styles from './styles';
import call from 'react-native-phone-call'  //TODO migration to communications

import Communications from 'react-native-communications';
import Analytics from '../../lib/analytics';
import { Constants } from 'expo';

import { formatTime, formatMonth,getAbbreviations } from '../global.js';

import HeaderContent from './../headerContent/header/';


const deviceWidth = Dimensions.get('window').width;
const primary = require('../../themes/variable').brandPrimary;

var WEBVIEW_REF = 'storWebview';
var DEFAULT_URL = '';

class Story extends Component {

  static propTypes = {
    navigation: PropTypes.shape({key: PropTypes.string}),
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
   console.log (formatMonth(this.props.eventDate));

    Share.share({
      message: "" + this.props.eventTitle +  "\n" + formatMonth(this.props.eventDate) + "\n" +  formatTime(this.props.eventStartTime, this.props.eventEndTime)  + ' \n' + this.props.location + ' \n' + this.props.eventDescription,
      title: '' + this.props.eventTitle
    })
    .then(this._showResult)
    .catch((error) => this.setState({result: 'error: ' + error.message}));
  };


_call() {
  const args = {
    number:  this.props.phone, // String value with the number to call
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


      console.log (sURL);

     Linking.openURL(sURL);
  }

_formatWeb(sURL) {

  if (sURL.length > 0) {
return(
      <WebView
             source={{uri: 'https://github.com/facebook/react-native'}}
              javaScriptEnabled={true}
            />
    )
  }
}


 
handleUrlPress(url) {
  LinkingIOS.openURL(url);
}

handlePhonePress(phone) {
  AlertIOS.alert(`${phone} has been pressed!`);
}

handleNamePress(name) {
  AlertIOS.alert(`Hello ${name}`);
}

handleEmailPress(email) {
  AlertIOS.alert(`send email to ${email}`);
}

renderText(matchingString, matches) {
  // matches => ["[@michel:5455345]", "@michel", "5455345"]
  let pattern = /\[(@[^:]+):([^\]]+)\]/i;
  let match = matchingString.match(pattern);
  return `^^${match[1]}^^`;
}

  render() {

    return (
      <Container style={{ backgroundColor: '#fff' }}>

      <Header style={styles.header}>
        <View style={styles.viewHeader}>       
          <View>
          <Button transparent onPress={() => Actions.pop()}>
          <Icon
            active
            name="arrow-back"
            style={styles.headerIcons} />
        </Button>
          </View>
          <Body>
            <Image source={global.header_logoID} style={styles.imageHeader} />
          </Body>
          <View>
             
          <Button
                transparent
                onPress={() => this._shareMessage()} >

                <Icon
                  name="ios-share-outline"
                  style={styles.headerIcons} />
              </Button>
          </View>
        </View>
      </Header>



          <Content showsVerticalScrollIndicator={false}>

          {undefined !== this.props.photo1 && null !== this.props.photo1 &&  this.props.photo1.length > 0 &&
            <View >
                <Image source={{uri: this.props.photo1}} style={styles.storyPhoto} />
            </View>
          }


            <View style={{ flex: 1 }}>
              <View style={styles.newsContent}>
                  <Text selectable={true} style={styles.eventTitle}>
                    {this.props.eventTitle}
                  </Text>

                  {undefined !== this.props.phone && null !== this.props.phone &&  this.props.phone.length > 0 &&
                    <View>
                      <Grid>
                      <Row>
                        <Col style={{ width: 80 }}>
                          <Button transparent style={styles.roundedButton}  onPress={() => this._call()} >
                            <Icon name="ios-call-outline" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                          </Button>
                        </Col>
                        <Col>
                            <Text selectable={true} style={styles.eventText}>{this.props.phone}</Text>
                        </Col>
                     </Row>
                   </Grid>
                 </View>
                  }

                  {undefined !== this.props.email && null !== this.props.email &&  this.props.email.length > 0 &&
                    <View>
                    <Grid>
                    <Row>
                      <Col style={{ width: 80 }}>
                        <Button transparent style={styles.roundedButton}  onPress={() => this._call()} >
                          <Icon name="ios-call-outline" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                        </Button>
                      </Col>
                      <Col>
                          <Text selectable={true} style={styles.eventText}>  {this.props.email}</Text>
                      </Col>
                   </Row>
                  </Grid>
                </View>
                  }

                    {undefined !== this.props.eventDate && null !== this.props.eventDate &&  this.props.eventDate.length > 1 &&
                      <Text selectable={true} style={styles.eventText}>
                       {formatMonth(this.props.eventDate)}
                      </Text>
                    }

                      {undefined !== this.props.eventStartTime && null !== this.props.eventStartTime &&  this.props.eventStartTime.length > 0 &&
                      <Text selectable={true} style={styles.eventText}>{formatTime(this.props.eventStartTime, this.props.eventEndTime)}</Text>
                      }

                      {undefined !== this.props.location && null !== this.props.location &&  this.props.location.length > 0 &&

                          <Text selectable={true}  style={styles.eventText}>
                            Location: {this.props.location}
                          </Text>
                      }


    
                  <ParsedText
                  style={styles.eventText}
                  parse={
                    [
                      {type: 'url',                       style: styles.url, onPress: this._handleOpenWithLinking},
                      {type: 'phone',                     style: styles.phone, onPress: this.handlePhonePress},
                      {type: 'email',                     style: styles.email, onPress: this.handleEmailPress},
                      {pattern: /Bobbbbb|Davidfffff/,              style: styles.name, onPress: this.handleNamePress},
                      {pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: this.handleNamePress, renderText: this.renderText},
                      {pattern: /433333332/,                     style: styles.magicNumber},
                      {pattern: /#(\w+)/,                 style: styles.hashTag},
                    ]
                  }
                  childrenProps={{allowFontScaling: false}}
                  >
                  {this.props.eventDescription}
                  </ParsedText>
  
                      <Text selectable={true}  style={styles.abbreviations}>
                        {getAbbreviations(this.props.eventTitle)}
                      </Text>


                    <Text style={styles.eventText}>
                      {this.props.eventImage}
                    </Text>

              </View>

              {undefined !== this.props.url && null !== this.props.url &&  this.props.url.length > 0 &&

              <TouchableOpacity onPress={() => { this._handleOpenWithLinking(this.props.url); }}>
                 <View style={{ padding: 20 }}>
                   <View style={styles.eventText}>
                     <Text style={styles.eventText}>
                       <Icon name="md-link" style={styles.eventIcon} />   More details...
                          <Text style={styles.eventText}></Text>
                       </Text>
                   </View>
                 </View>
              </TouchableOpacity>

                }

            
                {undefined !== this.props.eventDate &&  this.props.eventDate.length > 0 &&

                <View style={styles.calendarButton}>
                    <Button 
                                transparent
                                onPress={() => { Actions.phoneCalendar(
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

                                );}} >
                            <Icon
                                  name="ios-calendar-outline"
                                  style={styles.headerIcons} />
                            
                            <Text style={styles.calendarText} > Add to My Calendar</Text>
                      </Button>
                </View>

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
  username: state.username
});

export default connect(mapStateToProps, bindAction)(Story);
