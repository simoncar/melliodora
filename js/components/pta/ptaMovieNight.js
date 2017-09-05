import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Linking, Image, View, TouchableOpacity,  Dimensions,  Platform, Slider  } from 'react-native';
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

class ptaMovieNight extends Component {

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

      if (Platform.OS === 'android') {
        sURL = 'fb://group/' + sURL
      } else {
        sURL = 'fb://profile/' + sURL
      }

      console.log (sURL);

     Linking.openURL(sURL);
  }



  render() {



    return (

      <Container style={{ backgroundColor: '#fff' }}>
          <HeaderContent />

              <Content showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                  <View >
                      <Image source={require('../../../images/sais.edu.sg/movieNight.jpeg')} style={styles.ptaMovieNight}>
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
                              <Text style={styles.newsLink}>Saturday September 30th from 6pm - 10pm</Text>
                            </Col>
                            <Col>
                              <TouchableOpacity style={styles.newsTypeView}>
                                <Text style={styles.newsTypeText}>STAMFORD FIELD</Text>
                              </TouchableOpacity>
                            </Col>
                          </Grid>
                      <Text style={styles.newsHeader}>
                      Movie screening will start at 7:30 pm.
</Text>

<Text style={styles.newsHeader}>

</Text>

<Text style={styles.newsHeader}>

Please bring a picnic dinner including drinks (no nuts/nut products- see nut policy here & no alcohol please) as there will be no catering on the night. Bring a picnic blanket. Popcorn and cotton candy will be available for purchase (all proceeds to be donated to PTA Charities).
</Text>

                    <View style={{ padding: 20 }}>
                      <View style={styles.newsCommentContainer}>
                        <Text style={styles.newsComment}>
                        In the case of heavy rain, the event will need to be cancelled. An update will be posted to this page and the Stamford PTA Parent Group Facebook page.

                          </Text>

                      </View>
                    </View>


<Text style={styles.newsHeader}>
                    Please use public transport as parking will be very limited on the night.
                    </Text>


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

export default connect(mapStateToProps, bindAction)(ptaMovieNight);
