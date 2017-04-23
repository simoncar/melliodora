

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { openDrawer } from '../../actions/drawer';

import styles from './styles';

const headerLogo = require('../../../images/Header-Logo.png');
const primary = require('../../themes/variable').brandPrimary;

class Channel extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <Header>
            <Left>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon active name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Image source={headerLogo} style={styles.imageHeader} />
            </Body>
            <Right>
              <Button transparent onPress={this.props.openDrawer} >
                <Icon active name="menu" />
              </Button>
            </Right>
          </Header>

          <Content showsVerticalScrollIndicator={false}>
            <View>
              <Image source={require('../../../images/NewsIcons/2.jpg')} style={styles.newsPoster}>
                <View>
                  <Text style={Platform.OS === 'android' ? styles.achannelHeader : styles.ioschannelHeader}>SCIENCE CHANNEL</Text>
                  <Button
                    rounded
                    style={styles.followBtn}
                  >
                    <Text
                      style={Platform.OS === 'android' ?
                      { color: primary, fontSize: 13, fontWeight: '900', textAlign: 'center' } :
                      { color: primary, fontSize: 13, fontWeight: '900' }}
                    >Following</Text>
                  </Button>
                  <TouchableOpacity style={{ padding: 0 }}>
                    <Text style={styles.noOfFollowers}>234K Followers</Text>
                  </TouchableOpacity>
                </View>
              </Image>
            </View>

            <View foregroundColor={'white'} style={{ backgroundColor: '#fff' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                        Earth formed around 4.54 billion years ago by accretion from the solar nebula.
                                    </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>CNN</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>May 24, 2016</Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={2} style={styles.newsHeader}> A "giant impact" collision is thought to have been responsible for forming the Moon.</Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>SPACE.com</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>Apr 17, 2016</Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                        Living forms derived from photosynthesis appeared between 3.2 and 2.4 billion years ago.
                                    </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>CNN</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>Feb 03, 2016</Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={2} style={styles.newsHeader}>Life remained mostly small and microscopic until about 580 million years ago.</Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>SKY.com</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>Dec 17, 2015</Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={2} style={styles.newsHeader}>The history of Earth is divided into four great eons.</Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>SPACE.com</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>Apr 17, 2016</Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                        The Earth and Moon have the same oxygen isotopic signature.
                                    </Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>CNN</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>Feb 03, 2016</Text>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
                <View style={styles.newsContentWrap}>
                  <Text numberOfLines={2} style={styles.newsHeader}>Ice might have covered the oceans 3 billion years ago.</Text>
                  <Grid style={styles.newsContent}>
                    <Col style={{ flexDirection: 'row' }}>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>SKY.com</Text>
                      </TouchableOpacity>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.newsLink}>Dec 17, 2015</Text>
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
