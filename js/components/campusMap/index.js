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
import { Constants } from 'expo';

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

    // analytics  -----
    const trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username,
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.PAGE_MAP, trackingOpts);
    // analytics --------
  }

  render() {
    return (
      <Container>

        <HeaderContent />
        <Content showsVerticalScrollIndicator showsHorizontalScrollIndicator>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text style={styles.heading}>Woodleigh Campus</Text>
            <Text style={styles.text}>1 Woodleigh Lane, 357684</Text>

            <Image source={require('../../../images/sais.edu.sg/map1.png')} style={styles.mapImage} />
            <Image source={require('../../../images/sais.edu.sg/map2.png')} style={styles.mapImageLegend} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text style={styles.heading}>Early Learning Village</Text>
            <Text style={styles.text}>3 Chuan Lane (off Lorong Chuan)</Text>
            <Text style={styles.text2}>Singapore 554350</Text>

            <Image source={require('../../../images/sais.edu.sg/map3.png')} style={styles.mapImageELV} />
            <Image source={require('../../../images/sais.edu.sg/map4.png')} style={styles.mapImageLegendELV} />

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
});

export default connect(mapStateToProps, bindAction)(campusMap);
