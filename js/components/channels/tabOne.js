

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';


import { Container, Content, Text } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import styles from './styles';

class TabOne extends Component {

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
                    <Image source={require('../../../images/NewsIcons/1.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>VISIT CAMPUS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/2.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>APPLICATION PROCESS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/3.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>FEES</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/4.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>GRADE LISTINGS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/5.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>ADMISSIONS INQUIRY</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/6.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>FAQ</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/7.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>APPLY ONLINE</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/8.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>UNIFORMS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/9.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>BUS TRANSPORTATION</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/9.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>EXTRA</Text>
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

export default connect(mapStateToProps)(TabOne);
