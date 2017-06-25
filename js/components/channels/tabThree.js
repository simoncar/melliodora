

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { openDrawer } from '../../actions/drawer';

import { Container, Content, Text } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import styles from './styles';

class TabThree extends Component {

  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
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
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>NEWS & EVENTS</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/12.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>CALENDAR</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/8.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>CO-CURRICULAR ACTIVITIES</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/7.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>STUDENT CAFE</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/6.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>PARENT CARE</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/1.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>EDUCATIONUSA</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/9.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>CAMP ASIA</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/2.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>EXTRA 1</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/10.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>EXTRA 2</Text>
                    </Image>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => Actions.channel()}>
                    <Image source={require('../../../images/NewsIcons/13.jpg')} style={styles.channelImg}>
                      <Text style={Platform.OS === 'android' ? styles.achannelImgText : styles.ioschannelImgText}>EXTRA 3</Text>
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

export default connect(mapStateToProps)(TabThree);
