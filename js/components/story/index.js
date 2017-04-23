import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Slider, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import Lightbox from 'react-native-lightbox';
import Modal from 'react-native-simple-modal';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

const deviceWidth = Dimensions.get('window').width;
const primary = require('../../themes/variable').brandPrimary;

const renderPagination = (index, total, context) => (
  <View style={{ position: 'absolute', bottom: -25, right: 10 }}>
    <Text>
      <Text style={{ color: '#007aff', fontSize: 20 }}>
        {index + 1}
      </Text>
                /{total}
    </Text>
  </View>
    );

class Story extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'slideInDown',
      open: false,
      value: 0,
    };
  }

  modalO() {
    this.setState({ open: true });
  }

  modalX() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <Header>
            <Body style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon active name="arrow-back" style={styles.headerIcons} />
              </Button>
              <Button transparent onPress={() => Actions.comments()}>
                <Icon name="chatboxes" style={styles.headerIcons} />
              </Button>
              <Button transparent onPress={() => this.modalO()}>
                <Text style={styles.headerTextIcon}>Aa</Text>
              </Button>
              <Button transparent>
                <Icon name="bookmarks" style={styles.headerIcons} />
              </Button>
              <Button transparent>
                <Icon name="download" style={styles.headerIcons} />
              </Button>
            </Body>
          </Header>

          <Content showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View >
                <Image source={require('../../../images/NewsIcons/5.jpg')} style={styles.newsPoster}>
                  <TouchableOpacity>
                    <View style={styles.newsPosterContent}>
                      <Text numberOfLines={2} style={styles.newsPosterHeader}>
                          Flat App Theme
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Image>
              </View>
              <View style={{ backgroundColor: '#fff' }}>
                <View style={styles.newsContent}>
                  <Grid style={{ paddingBottom: 20 }}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>CDC</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>1h ago</Text>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>ENVIRONMENT</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                  <Text style={styles.newsHeader}>
                      React Native Flat App Theme, a fascinating React Native starter kit with flat UI design, Redux and NativeBase components for your application.
                  </Text>
                </View>

                <View style={{ padding: 20 }}>
                  <View style={styles.newsCommentContainer}>
                    <Text style={styles.newsComment}>
                        It’s a responsive theme with clean and modern look highly focussed on efficiency. The flat design enables resizing the contents easily to fit various screen devices. Eye soothing color makes the React Native Flat app theme simple yet eye catchy and smooth running.
                    </Text>
                    <Text style={styles.newsComment}>- StrapMobile</Text>
                  </View>
                  <Text style={styles.newsHeader}>
                      The flat UI design adds an aesthetic touch to the native look and feel of React Native apps.
                  </Text>
                  <View style={{ paddingBottom: 20 }}>
                    <Text style={styles.newsHeader}>
                      NativeBase is a free and open source framework that enables developers to build high-quality mobile apps using React Native iOS and Android apps with a fusion of ES6.
                  </Text>
                  </View>
                  <View style={{ paddingBottom: 20, paddingTop: 10 }}>
                    <Text style={styles.newsHeader}>
                        NativeBase builds a layer on top of React Native that provides you with basic set of components for mobile application development. This helps you to build world-class application experiences on native platforms.
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
                      <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/1.jpg')} />
                    </View>
                    <View style={styles.slide}>
                      <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/3.jpg')} />
                    </View>
                    <View style={styles.slide}>
                      <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/4.jpg')} />
                    </View>
                    <View style={styles.slide}>
                      <Image style={styles.newsPoster} source={require('../../../images/NewsIcons/5.jpg')} />
                    </View>
                  </Swiper>
                </View>

                <View style={{ alignSelf: 'center' }}>
                  <Button transparent iconRight onPress={() => Actions.popTo('home')} textStyle={{ color: '#222', fontWeight: '700' }}>
                    <Text>NEXT STORY</Text>
                    <Icon name="ios-arrow-forward" style={styles.forwardBtn} />
                  </Button>
                </View>
              </View>
            </View>
          </Content>

          <Modal
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({ open: false })}
            onRequestClose={() => this.setState({ open: false })}
            style={styles.modal}
          >

            <View>
              <View style={styles.modalContentBox}>
                <Grid style={{ flex: 10, padding: 20 }}>
                  <Col style={{ paddingLeft: 30 }}>
                    <Button transparent style={styles.dayButton}>
                      <Icon
                        name="ios-sunny-outline"
                        style={{ color: primary, fontSize: 26 }}
                      />
                    </Button>
                  </Col>
                  <Col style={{ paddingLeft: 80 }}>
                    <Button transparent style={styles.nightButton}>
                      <Icon
                        name="ios-moon-outline"
                        style={{ fontSize: 26, color: '#fff' }}
                      />
                    </Button>
                  </Col>
                </Grid>
              </View>
              <View style={styles.modalContentBox}>
                <Grid style={{ padding: 20, paddingBottom: 15, justifyContent: 'center' }}>
                  <Col>
                    <Text
                      style={Platform.OS === 'android' ?
                                                { fontSize: 12, marginTop: 8 } :
                                                { fontSize: 12, marginTop: 8 }}
                    >
                                            CHOOSE TYPESPACE
                                        </Text>
                  </Col>
                  <Col>
                    <Button transparent iconRight style={{ marginTop: -5 }}>
                      <Text style={{ color: '#FFF' }}>SANS SERIF</Text>
                      <Icon name="ios-arrow-forward" style={{ fontSize: 28 }} />
                    </Button>
                  </Col>
                </Grid>
              </View>
              <View>
                <Grid style={{ flexDirection: 'row', paddingTop: 20 }}>
                  <Col>
                    <Text style={styles.modalSmallText}>A</Text>
                  </Col>
                  <Col style={{ alignSelf: 'flex-end' }}>
                    <Text style={styles.modalLargeText}>A</Text>
                  </Col>
                </Grid>
                <Slider
                  {...this.props} minimumTrackTintColor="#fff"
                  onValueChange={value => this.setState({ value })}
                />
              </View>
            </View>
          </Modal>
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
});

export default connect(mapStateToProps, bindAction)(Story);
