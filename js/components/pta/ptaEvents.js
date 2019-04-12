import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Linking, Image, View, TouchableOpacity,  Dimensions,  Platform, Slider  } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-navigation';
import { Grid, Col, Row, Container, Header, Content, Text, Button, Icon, Left, Body, Right } from 'native-base';

import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import HeaderContent from './../headerContent/header/';

import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;
const deviceWidth = Dimensions.get('window').width;

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


  _handleOpenWithLinking = (sURL) => {
     Linking.openURL(sURL);
  }

  render() {
    return (

      <Container style={{ backgroundColor: '#fff' }}>
          <HeaderContent
          navigation={this.props.navigation} 
           />

              <Content showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                  <View >
                      <Image source={require('../../../images/sais.edu.sg/diwali.jpg')} style={styles.storyPhoto}>
                    </Image>




                                        <TouchableOpacity onPress={() => { this._handleOpenWithLinking('https://mystamford.edu.sg/events-1/deepavali-celebrations'); }}>
                                           <View style={{ padding: 20 }}>
                                             <View style={styles.connectionCommentContainer}>
                                               <Text style={styles.connectionComment}>
                                                  More Details on myStamford
                                                 </Text>
                                             </View>
                                           </View>
                                        </TouchableOpacity>



                  </View>
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
  username: state.username
});

export default connect(mapStateToProps, bindAction)(ptaEvents);
