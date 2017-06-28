

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, View, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Thumbnail, Icon, Button } from 'native-base';
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

              <Row style={{paddingTop: 20}}>
                <Col>
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.contact(); }} >
                    <Icon style={styles.icon} name="ios-call-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>Contact</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.home(); }} >
                    <Icon style={styles.icon} name="ios-calendar-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>Calendar</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.webportal(); }} >
                    <Icon style={styles.icon} name="ios-grid" />
                    </Button>
                    <Text note style={styles.buttonLabel}>myStamford</Text>
                </Col>
            </Row>
            <Row style={{paddingTop: 20}}>
              <Col>
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.webportal(); }} >
                  <Icon style={styles.icon} name="ios-book-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Directory</Text>
              </Col>

              <Col>
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.newsletter(); }} >
                  <Icon style={styles.icon} name="ios-paper-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>Newsletters</Text>
              </Col>

              <Col>
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.newsletter(); }} >
                  <Icon style={styles.icon} name="ios-map-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>School Map</Text>
              </Col>

            </Row>
            <Row style={{paddingTop: 20, paddingBottom: 20}}>

                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.newsletter(); }} >
                    <Icon style={styles.icon} name="ios-people-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>PTA Home</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.newsletter(); }} >
                    <Icon style={styles.icon} name="ios-basket-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>Lions Den</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.newsletter(); }} >
                    <Icon style={styles.icon} name="ios-bonfire-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>PTA Events</Text>
                </Col>

            </Row>


              </Grid>

            </View>
            <View style={{ backgroundColor: '#fff' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} >
                <Image source={require('../../../images/sais.edu.sg/village.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                    Early Learning Village - Open Day
                                    </Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>July 29</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>VILLAGE</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }}>
                <Image source={require('../../../images/sais.edu.sg/orientation.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>
                                      Welcome Orientation
                                    </Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>Aug 10-11</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>WOODLEIGH CAMPUS</Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} >
                <Image source={require('../../../images/sais.edu.sg/village_window.jpg')} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text numberOfLines={2} style={styles.newsHeader}>Welcome Orientation - Elarly Learning Village</Text>
                  <Grid style={{ marginTop: 25 }}>
                    <Col>
                      <TouchableOpacity>
                        <Text style={styles.newsLink}>Aug 12</Text>
                      </TouchableOpacity>
                    </Col>
                    <Col>
                      <TouchableOpacity style={styles.newsTypeView}>
                        <Text style={styles.newsTypeText}>VILLAGE</Text>
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
