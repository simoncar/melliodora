import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View,  Platform, Slider  } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Left, Body, Right } from 'native-base';

import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import HeaderContent from './../headerContent/';

import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;


class ptaEvents extends Component {

  static propTypes = {
    navigation: PropTypes.shape({key: PropTypes.string}),
      username: PropTypes.string
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

                <Content showsVerticalScrollIndicator={true}>
                  <View>
                      <Image source={require('../../../images/sais.edu.sg/map1.png')} style={styles.mapImage} />
                  </View>
                  <View>

                  <Image source={require('../../../images/sais.edu.sg/map2.png')} style={styles.mapImageLegend}/>
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

export default connect(mapStateToProps, bindAction)(ptaEvents);
