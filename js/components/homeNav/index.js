

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, View, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Thumbnail, Icon } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import HeaderContent from './../headerContent/';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

class HomeNav extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <HeaderContent />

          <Content showsVerticalScrollIndicator={false}>
            <View style={styles.profileInfoContainer}>
              <TouchableOpacity style={{ alignSelf: 'center' }}>
                <Image source={require('../../../images/sais.edu.sg/header_photo_1.jpg')} style={styles.profilePic} />
              </TouchableOpacity>

            </View>

            <View style={styles.linkTabs}>
              <Grid>

              <Row>
                <Col>
                  <TouchableOpacity onPress={() => { Actions.contact(); }}  style={styles.linkTabs_header}>
                    <Icon style={styles.linkTabs_tabCounts} name="ios-call-outline" />
                    <Text note style={styles.linkTabs_tabName}>Contact</Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => { Actions.home(); }} style={styles.linkTabs_header}>
                      <Icon style={styles.linkTabs_tabCounts}  name="ios-calendar-outline" />
                    <Text note style={styles.linkTabs_tabName}>Calendar</Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => { Actions.webportal(); }} style={styles.linkTabs_header}>
                    <Icon style={styles.linkTabs_tabCounts}  name="ios-grid" />
                    <Text note style={styles.linkTabs_tabName}>myStamford</Text>
                  </TouchableOpacity>
                </Col>
            </Row>
            <Row>
                <Col>
                  <TouchableOpacity style={styles.linkTabs_header}>
                    <Icon style={styles.linkTabs_tabCounts} name="ios-book-outline" />
                    <Text note style={styles.linkTabs_tabName}>Directory</Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity  onPress={() => { Actions.newsletter(); }}  style={styles.linkTabs_header}>
                      <Icon style={styles.linkTabs_tabCounts}  name="ios-paper-outline" />
                    <Text note style={styles.linkTabs_tabName}>Newsletters</Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity style={styles.linkTabs_header}>
                    <Icon style={styles.linkTabs_tabCounts}  name="ios-map-outline" />
                    <Text note style={styles.linkTabs_tabName}>School Map</Text>
                  </TouchableOpacity>
                </Col>
            </Row>
            <Row>
                <Col>
                  <TouchableOpacity style={styles.linkTabs_header}>
                    <Icon style={styles.linkTabs_tabCounts} name="ios-people-outline" />
                    <Text note style={styles.linkTabs_tabName}>PTA Home</Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity style={styles.linkTabs_header}>
                      <Icon style={styles.linkTabs_tabCounts}  name="ios-basket-outline" />
                    <Text note style={styles.linkTabs_tabName}>Lions Den</Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity style={styles.linkTabs_header}>
                    <Icon style={styles.linkTabs_tabCounts}  name="ios-bonfire-outline" />
                    <Text note style={styles.linkTabs_tabName}>PTA Events</Text>
                  </TouchableOpacity>
                </Col>
            </Row>


              </Grid>
            </View>
            <View style={{ backgroundColor: '#fff' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.home()}>
                <Image source={require('../../../images/NewsIcons/1.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                      An event that is on today
                                    </Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>CDC</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>ENVIRONMENT</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.home()}>
                <Image source={require('../../../images/NewsIcons/3.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                        Something else happeng that is big this week
                                    </Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>SPACE.com</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>SCIENCE</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.home()}>
                <Image source={require('../../../images/NewsIcons/4.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>But still look sharp on high-definition screens.</Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>SKY.com</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>WORLD</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.home()}>
                <Image source={require('../../../images/NewsIcons/10.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                        Highly customizable widgets are part of our never ending mission.
                                    </Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>ANI.com</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>ANIMATION</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.home()}>
                <Image source={require('../../../images/NewsIcons/9.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                        Ready to use components built using NativeBase.
                                    </Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>STYLE.com</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>FASHION</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.home()}>
                <Image source={require('../../../images/NewsIcons/12.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>Theme your app with one single file.</Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>ART.com</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>ART</Text>
                      </TouchableOpacity>
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

export default connect(mapStateToProps, bindAction)(HomeNav);
