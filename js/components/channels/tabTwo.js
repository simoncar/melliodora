

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { openDrawer } from '../../actions/drawer';

import { Container, Content, Text } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import styles from './styles';

class TabTwo extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Content showsVerticalScrollIndicator={false}>
          <View>
            <Grid>

              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/11.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>EARLY YEARS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/12.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>ELEMENTARY</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/13.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>SECONDARY</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/14.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>LANGUAGES</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/15.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>GLOBAL MENTOR</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/16.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>INNOVATION CENTER</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/17.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>SPORTS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/18.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>MUSIC</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/9.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>ARTS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/20.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>COLLEGE COUNSELING</Text>
                    </Image>
                  </TouchableOpacity>
                 </Col>
                </Row>
                <Row>
                  <Col>
                    <TouchableOpacity onPress={() => Actions.channel()}>
                      <Image source={require('../../../images/NewsIcons/21.jpg')} style={styles.channelImg}>
                        <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>INNOVATION CENTER</Text>
                      </Image>
                    </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity onPress={() => Actions.channel()}>
                        <Image source={require('../../../images/NewsIcons/22.jpg')} style={styles.channelImg}>
                          <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>TECHNOLOGY</Text>
                        </Image>
                      </TouchableOpacity>
                      </Col>
                      </Row>
                      <Row>
                      <Col>
                        <TouchableOpacity onPress={() => Actions.channel()}>
                          <Image source={require('../../../images/NewsIcons/23.jpg')} style={styles.channelImg}>
                            <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>SOCIAL PROGRAM</Text>
                          </Image>
                        </TouchableOpacity>
                        </Col>
                        <Col>
                          <TouchableOpacity onPress={() => Actions.channel()}>
                            <Image source={require('../../../images/NewsIcons/24.jpg')} style={styles.channelImg}>
                              <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>TECHNOLOGY</Text>
                            </Image>
                          </TouchableOpacity>
                </Col>
              </Row>
            </Grid>
          </View>
        </Content>
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps)(TabTwo);
