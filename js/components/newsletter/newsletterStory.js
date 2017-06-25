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

const deviceWidth = Dimensions.get('window').width;
const headerLogo = require('../../../images/Header-Logo-White-0001.png');

const primary = require('../../themes/variable').brandPrimary;


class newsletterStory extends Component {

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
    };
  }

  render() {
    return (



      <Container style={{ backgroundColor: '#fff' }}>


        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <Header>
            <Left>
            <Button transparent style={styles.btnHeader} onPress={this.props.openDrawer} >
                       <Icon active name="menu" />
            </Button>
            </Left>
            <Body>
            <Image source={headerLogo} style={styles.imageHeader} />
            </Body>

            <Right>
            </Right>
          </Header>


          <WebView source={{html: this.props.newsletterContent}}/>

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

export default connect(mapStateToProps, bindAction)(newsletterStory);
