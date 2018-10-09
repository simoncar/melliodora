import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View, Platform, Slider } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Left, Body, Right } from 'native-base';

import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import HeaderContent from './../headerContent/header/';
import Analytics from '../../lib/analytics';
import { Constants, Notifications } from 'expo';

import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;



class campusMap extends Component {

  static propTypes = {
    navigation: PropTypes.shape({ key: PropTypes.string }),
    username: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      animationType: 'slideInDown',
      open: false,
    };


  }

  render() {

    return (
      <Container>

        <HeaderContent />
        <Content showsVerticalScrollIndicator showsHorizontalScrollIndicator>

            <Text style={styles.heading}>PTA Chatrooms</Text>
            <Text style={styles.text}>** Experimental **</Text>
            <Text style={styles.text}>D={Constants.deviceId}</Text>
            <Text style={styles.text}>I={Constants.installationId}</Text>

            <Button transparent style={styles.roundedButton} onPress={() => { Actions.login();}} >
                <Icon style={styles.icon} name="ios-person" />
                <Text>{this.props.userX.nickname}</Text>
            </Button>
            
            <Button transparent style={styles.roundedButton} onPress={() => { Actions.chat({ chatroom: 'Lost and Found' }); }} >
                <Icon style={styles.icon} name="ios-chatbubbles-outline" />
                <Text>PTA Lost and Found</Text>
            </Button>

            <Button transparent style={styles.roundedButton} onPress={() => { Actions.chat({ chatroom: '3SHMU' }); }} >
                <Icon style={styles.icon} name="ios-chatbubbles-outline" />
                <Text>3SHMU</Text>
            </Button>

            <Button transparent style={styles.roundedButton} onPress={() => { Actions.chat({ chatroom: '5DAYE' }); }} >
                <Icon style={styles.icon} name="ios-chatbubbles-outline" />
                <Text>5DAYE</Text>
            </Button>

            <Button transparent style={styles.roundedButton} onPress={() => { Actions.chat({ chatroom: 'Grade 6' }); }} >
                <Icon style={styles.icon} name="ios-chatbubbles-outline" />
                <Text>Grade 6</Text>
            </Button>
            <Button transparent style={styles.roundedButton} onPress={() => { Actions.chat({ chatroom: 'Grade 7' }); }} >
                <Icon style={styles.icon} name="ios-chatbubbles-outline" />
                <Text>Grade 7</Text>
            </Button>
            <Button transparent style={styles.roundedButton} onPress={() => { Actions.chat({ chatroom: 'Grade 8' }); }} >
                <Icon style={styles.icon} name="ios-chatbubbles-outline" />
                <Text>Grade 8</Text>
            </Button>   

            <Button transparent style={styles.roundedButton} onPress={() => { Actions.chat({ chatroom: 'PTA General' }); }} >
                <Icon style={styles.icon} name="ios-chatbubbles-outline" />
                <Text>PTA General Chat and Questions</Text>
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
  username: state.username,
  userX: state.user,
});

export default connect(mapStateToProps, bindAction)(campusMap);
