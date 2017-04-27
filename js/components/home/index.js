
import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Card, Left, Body, Right } from 'native-base';

import { Grid, Col } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';


import styles from './styles';

const deviceWidth = Dimensions.get('window').width;
const headerLogo = require('../../../images/Header-Logo-White-0001.png');


class Home extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
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
            <Button transparent onPress={() => Actions.login({ type: ActionConst.RESET  })}>
              <Icon active name="power" />
            </Button>
          </Right>
        </Header>

        <Content showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <Swiper
                height={1}
                width={deviceWidth + 3}
                loop
                dot={<View style={styles.swiperDot} />}
                activeDot={<View
                  style={styles.swiperActiveDot}
                  showsButtons
                />}
              >
                <TouchableOpacity activeOpacity={1} onPress={() => Actions.story()} style={styles.slide}>
                  <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/Stamford Title pic.png')} >
                    <View style={styles.swiperTextContent} >

                      <Grid style={styles.swiperContentBox}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsPosterLink}></Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.headertimeIcon} />
                          <Text style={styles.newsPosterLink}></Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsPosterTypeView}>
                            <Text style={styles.newsPosterTypeText}></Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                    </View>
                  </Image>
                </TouchableOpacity>

                <TouchableOpacity  activeOpacity={1} onPress={() => Actions.story()} style={styles.slide}>
                  <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/3.jpg')}>
                    <View style={styles.swiperTextContent}>
                      <Text numberOfLines={2} style={styles.newsPosterHeader}>
                            So that the applications are able to load faster and resize easily.
                        </Text>
                      <Grid style={styles.swiperContentBox}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsPosterLink}>CDC</Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.headertimeIcon} />
                          <Text style={styles.newsPosterLink}>2hr ago</Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsPosterTypeView}>
                            <Text style={styles.newsPosterTypeText}>ENVIRONMENT</Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                    </View>
                  </Image>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => Actions.story()} style={styles.slide}>
                  <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/4.jpg')}>
                    <View style={styles.swiperTextContent}>
                      <Text numberOfLines={2} style={styles.newsPosterHeader}>
                            But still look sharp on high-definition screens.
                        </Text>
                      <Grid style={styles.swiperContentBox}>
                        <Col style={{ flexDirection: 'row' }}>
                          <TouchableOpacity>
                            <Text style={styles.newsPosterLink}>SKY.com</Text>
                          </TouchableOpacity>
                          <Icon name="ios-time-outline" style={styles.headertimeIcon} />
                          <Text style={styles.newsPosterLink}>1day ago</Text>
                        </Col>
                        <Col>
                          <TouchableOpacity style={styles.newsPosterTypeView}>
                            <Text style={styles.newsPosterTypeText}>WORLD</Text>
                          </TouchableOpacity>
                        </Col>
                      </Grid>
                    </View>
                  </Image>
                </TouchableOpacity>
              </Swiper>
            </View>
          </View>

          <Card style={{ backgroundColor: '#fff', marginTop: 0, marginRight: 0 }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      U12 Rugby Game
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>April 28, 2017</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>5:30 pm</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>Stamford Field</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      Charlie and the Chocolate Factory
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>May 5, 2017</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>7:00 pm</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>Reagan Theater</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      Senior Graduation
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>June 3, 2017</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>7:00 pm</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>Reagan Theater</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      Friday Drama Class
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>May 5, 2017</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>3:45</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>Drama</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>


            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      8th Grade Graduation
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>June 14, 2017</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>10:00 am</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>Stamford Gym</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      Senior Field Studies Trip - Nepal
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>May 20, 2017</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>6:00 am</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>Changi Airport</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>
          </Card>
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
});

export default connect(mapStateToProps, bindAction)(Home);
