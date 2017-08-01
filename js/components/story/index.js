import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { WebView, Image, View, TouchableOpacity, Platform, Slider, Dimensions, Share  } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import Lightbox from 'react-native-lightbox';
import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';
import call from 'react-native-phone-call'  //TODO migration to communications

import Communications from 'react-native-communications';

import { formatTime } from '../global.js';

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

  }

 _shareMessage() {
    Share.share({
      message: "" + this.props.eventTitle + "\nWhen: " +  formatTime(this.props.eventStartTime, this.props.eventEndTime) + ' ' + this.props.eventDate,
      title: '' + this.props.eventImage
    })
    .then(this._showResult)
    .catch((error) => this.setState({result: 'error: ' + error.message}));
  };


_callPhone() {
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


  render() {



    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <Header>

            <Left>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon
                  active
                  name="arrow-back"
                  style={styles.headerIcons} />
              </Button>
            </Left>

            <Right>

              <Button
                transparent
                onPress={() => this._shareMessage()} >

                <Icon
                  name="md-share"
                  style={styles.headerIcons} />
              </Button>

            </Right>

          </Header>

          <Content showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={styles.newsContent}>
                  <Text style={styles.eventTitle}>
                    {this.props.eventTitle}
                  </Text>


                  {undefined !== this.props.phone && null !== this.props.phone &&  this.props.phone.length > 0 &&
                    <View>
                    <Text style={styles.eventIcon}>
                      <Icon
                        active
                        name="ios-call"
                        style={styles.eventIcon}  />
                    </Text>
                    <Text style={styles.eventTitle}>
                        {this.props.phone}
                    </Text>
                  </View>

                  }

                  {undefined !== this.props.email && null !== this.props.email &&  this.props.email.length > 0 &&
                    <Text style={styles.eventTitle}>
                      <Icon
                        active
                        name="md-mail"
                        style={styles.eventIcon} />
                      {this.props.email}
                    </Text>
                  }



                    <Text style={styles.eventTitle}>
                      {this.props.eventDate}
                    </Text>
                    <Text style={styles.eventTitle}>
                      {this.props.eventStartTime}
                    </Text>
                    <Text style={styles.eventTitle}>
                      {this.props.eventEndTime}
                    </Text>
                    <Text style={styles.eventTitle}>
                      {this.props.location}
                    </Text>
                    <Text style={styles.eventTitle}>
                      {this.props.eventImage}
                    </Text>
                    <Text style={styles.eventTitle}>
                      {this.props.color}
                    </Text>

              </View>
            </View>
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

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  username: state.username
});

export default connect(mapStateToProps, bindAction)(Story);
