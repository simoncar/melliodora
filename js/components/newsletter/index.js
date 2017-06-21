

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Platform } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Text, Left, Right, Body, Button, Icon, View } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { openDrawer } from '../../actions/drawer';
import ProgressBar from './../x_loaders/ProgressBar';

import theme from '../../themes/base-theme';
import styles from './styles';


const headerLogo = require('../../../images/Header-Logo-White-0001.png');

class Newsletter extends Component {

  render() {
    return (
      <Container>
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
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
              <Button transparent style={styles.btnHeader} onPress={() => Actions.pop()}>
                
              </Button>
            </Right>
          </Header>
          <View style={styles.overviewHeaderContainer}>
            <Text style={styles.overviewHeader}>NEWSLETTERS</Text>
            <Text note style={styles.overviewHead}></Text>
          </View>

          <Content showsVerticalScrollIndicator={false}>
            <View style={styles.overviewContent}>
              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}>SUPERINTENDENT</Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}>HIGH SCHOOL</Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}>UPPER ELEMENTARY</Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}>LOWER ELEMENTARY</Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}>EARLY YEARS</Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}></Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}></Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}></Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}></Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>

              <View style={styles.overviewTopicsBox}>
                <Grid style={Platform.OS === 'android' ? { paddingBottom: 0 } : { paddingBottom: 15 }}>
                  <Col>
                    <Text style={styles.overviewInfoHeader}></Text>
                  </Col>
                  <Col>
                    <Text style={styles.overviewInfoPerc}></Text>
                  </Col>
                </Grid>

              </View>
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

export default connect(null, bindAction)(Newsletter);
