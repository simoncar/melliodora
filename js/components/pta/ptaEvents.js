import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Linking, Image, View, TouchableOpacity,  Dimensions,  Platform, Slider  } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
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
          <HeaderContent />

              <Content showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                  <View >
                      <Image source={require('../../../images/sais.edu.sg/ParentsTalkAbout_resource.png')} style={styles.ptaLogo}>
                    </Image>
                  </View>
                  <View style={{ backgroundColor: '#fff' }}>
                    <View style={styles.newsContent}>
                      <Grid style={{ paddingBottom: 20 }}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsLink}>PTA</Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.timeIcon} />
                          <Text style={styles.newsLink}>Tue 10th October 9am-10:30am</Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsTypeView}>
                            <Text style={styles.newsTypeText}>Lincoln iLearn</Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                      <Text style={styles.newsHeader}>
PTA Presents a 3 part talk for parents from Expat Kitchen, International Medical Clinic and T32 Dental Centre covering hawker foods, wet markets and grocery shopping, followed by vaccinations including some new US College admissions vaccinations and preventive dental care for your children.
                      </Text>
                    </View>

                    <View style={{ padding: 20 }}>
                      <View style={styles.newsCommentContainer}>
                        <Text style={styles.newsComment}>
                          Light refreshments will be served
                          </Text>

                      </View>
                    </View>



                                        <TouchableOpacity onPress={() => { this._handleOpenWithLinking('https://mystamford.edu.sg/pta/pta-events/parents-talk-about-/rsvp-parents-talk-about'); }}>
                                           <View style={{ padding: 20 }}>
                                             <View style={styles.connectionCommentContainer}>
                                               <Text style={styles.connectionComment}>
                                                  RSVP Here
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
  navigation: state.cardNavigation,
  username: state.username
});

export default connect(mapStateToProps, bindAction)(ptaEvents);
