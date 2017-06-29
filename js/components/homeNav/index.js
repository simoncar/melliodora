

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

Raven.captureMessage('Broken!')

    return (
      <Container>
          <HeaderContent />

          <Content showsVerticalScrollIndicator={false}>


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
                <Button transparent style={styles.roundedButton}  onPress={() => {  }} >
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
                <Button transparent style={styles.roundedButton}  onPress={() => { Actions.campusMap(); }} >
                  <Icon style={styles.icon} name="ios-map-outline" />
                  </Button>
                  <Text note style={styles.buttonLabel}>School Map</Text>
              </Col>

            </Row>
            <Row style={{paddingTop: 20, paddingBottom: 20}}>

                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.ptaHome(); }} >
                    <Icon style={styles.icon} name="ios-people-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>PTA</Text>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}  onPress={() => { Actions.ptaLionsDen(); }} >
                    <Icon style={styles.icon} name="ios-basket-outline" />
                    </Button>
                    <Text note style={styles.buttonLabel}>Lions Den</Text>
                </Col>
                <Col>

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
