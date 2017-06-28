import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View, TouchableOpacity,  Dimensions,  Platform, Slider  } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Grid, Col, Row, Container, Header, Content, Text, Button, Icon, Left, Body, Right } from 'native-base';

import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import HeaderContent from './../headerContent/';

import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;
const deviceWidth = Dimensions.get('window').width;


class ptaLionsDen extends Component {

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

      <Container style={{ backgroundColor: '#fff' }}>
          <HeaderContent />

              <Content showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                  <View >
                    <Image source={require('../../../images/sais.edu.sg/lionsDen.jpg')} style={styles.newsPoster}>
                    </Image>
                  </View>
                  <View style={{ backgroundColor: '#fff' }}>
                    <View style={styles.newsContent}>
                      <Grid style={{ paddingBottom: 20 }}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsLink}>SHOP</Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.timeIcon} />
                          <Text style={styles.newsLink}>3:00pm - 4:30pm</Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsTypeView}>
                            <Text style={styles.newsTypeText}>LION'S DEN</Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                      <Text style={styles.newsHeader}>

The Stamford PTA Lion's Den Store affirms the importance of promoting school spirit and supporting the Stamford parent community. Toward that end, the store serves as the preferred vendor of Stamford branded merchandise and spirit wear, and provides services and products that promote school spirit in a manner that is fiscally responsible and maximizes the overall financial contribution to the Stamford PTA. With the approval of the Stamford PTA Board, the Lion's Den may from time to time provide financial assistance to school organizations that are in alignment with the goal of promoting school spirit.
                      </Text>
                    </View>

                    <View style={{ padding: 20 }}>
                      <View style={styles.newsCommentContainer}>
                        <Text style={styles.newsComment}>
                            The Lion's Den Store is open Monday, Wednesday and Friday:  3:00 pm - 4:30 pm.

                          </Text>

                      </View>
                    </View>

                    <View style={styles.wrapper}>
                      <Swiper
                        height={230}
                        width={deviceWidth + 5}
                        loop
                        dot={<View style={styles.swiperDot} />}
                        activeDot={<View
                          style={styles.swiperActiveDot}
                          showsButtons
                        />}
                      >
                        <View style={styles.slide}>
                          <Image style={styles.newsPoster} source={require('../../../images/sais.edu.sg/lionsDen_product1.jpg')} />
                        </View>
                        <View style={styles.slide}>
                          <Image style={styles.newsPoster} source={require('../../../images/sais.edu.sg/lionsDen_product2.jpg')} />
                        </View>
                        <View style={styles.slide}>
                          <Image style={styles.newsPoster} source={require('../../../images/sais.edu.sg/lionsDen_product3.jpg')} />
                        </View>
                        <View style={styles.slide}>
                          <Image style={styles.newsPoster} source={require('../../../images/sais.edu.sg/lionsDen_product4.jpg')} />
                        </View>
                      </Swiper>
                    </View>

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

export default connect(mapStateToProps, bindAction)(ptaLionsDen);
