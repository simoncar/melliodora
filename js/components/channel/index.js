

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { openDrawer } from '../../actions/drawer';

import styles from './styles';

const headerLogo = require('../../../images/Header-Logo-White-0001.png');
const primary = require('../../themes/variable').brandPrimary;

class Channel extends Component {

  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <Header>
          <Left>
            <Button transparent onPress={this.props.openDrawer} >
              <Icon active name="menu" />
            </Button>
          </Left>
            <Right>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon active name="arrow-back" />
              </Button>
            </Right>
            <Body>
              <Image source={headerLogo} style={styles.imageHeader} />
            </Body>
          </Header>

          <Content showsVerticalScrollIndicator={false}>
            <View>
              <Image source={require('../../../images/NewsIcons/2.jpg')} style={styles.newsPoster}>
                <View>
                  <Text style={Platform.OS === 'android' ? styles.achannelHeader : styles.ioschannelHeader}>WELCOME TO STAMFORD</Text>

                  <TouchableOpacity style={{ padding: 0 }}>
                    <Text style={styles.noOfFollowers}>FROM Dr ERIC SANDS</Text>
                  </TouchableOpacity>
                </View>
              </Image>
            </View>

            <View foregroundColor={'white'} style={{ backgroundColor: '#fff' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={10} style={styles.newsHeader}>
                                        Our school environment provides daily opportunities for students to increase their knowledge and skill base in order to acquire the attributes necessary for meaningful lives.
                                    </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}></Text>
                      </TouchableOpacity>

                      <Text style={styles.newsLink}></Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={10} style={styles.newsHeader}> Stamford American International School (SAIS) is the only school in Singapore to offer the full International Baccalaureate (IB) Programme integrated with US Standards...</Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}></Text>
                      </TouchableOpacity><Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}></Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={10} style={styles.newsHeader}>
                                        With more than 65 nationalities represented on campus, each of us has an exceptional opportunity to develop an understanding of, and appreciation for, the philosophies of people from many different cultures.
                                    </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}></Text>
                      </TouchableOpacity>

                      <Text style={styles.newsLink}></Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={10} style={styles.newsHeader}>Stamford American International School is committed to recruiting faculty who are dedicated, passionate about their subject area and excited by the prospect of working within a diverse community. </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}></Text>
                      </TouchableOpacity>

                      <Text style={styles.newsLink}></Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={10} style={styles.newsHeader}>Our $300 million campus facility features state-of-the-art technology and facilities that established it as the new benchmark for international schools in Singapore and around the world. </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}></Text>
                      </TouchableOpacity>

                      <Text style={styles.newsLink}></Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={10} style={styles.newsHeader}>
                                        In Stamford American’s Global Mentor Program, we invite some of the world’s most inspirational minds, industry leaders, artists and athletes to engage with our students across our Stamford American campus, invigorating and motivating beyond the classroom.
                                    </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}></Text>
                      </TouchableOpacity>

                      <Text style={styles.newsLink}></Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={10} style={styles.newsHeader}></Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}></Text>
                      </TouchableOpacity>

                      <Text style={styles.newsLink}></Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
            </View>
          </Content>
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

export default connect(mapStateToProps, bindAction)(Channel);
