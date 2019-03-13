

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {TextInput, View, Switch, Platform,} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions, ActionConst } from 'react-native-router-flux';
import {
  Container, Header, Content, Text, Button, Icon, Thumbnail, Item, Input, Left, Right, Body,
} from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { openDrawer } from '../../actions/drawer';
import HeaderContent from './../headerContent/header/';

import * as ActionCreators from '../../actions';

import styles from './styles';


console.log('ACfromSettings=', ActionCreators);

const primary = require('../../themes/variable').brandPrimary;

class Settings extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      earlyyearsSwitch: false,
      lowerelemSwitch: false,
      upperelemSwitch: false,
      middleSwitch: true,
      highSwitch: true,
      badmintonSwitch: false,
      basketballSwitch: false,
      crosscountrySwitch: false,
      golfSwitch: false,
      rugbySwitch: false,
      soccerSwitch: false,
      softballSwitch: false,
      swimmingSwitch: false,
      tennisSwitch: false,
      trackSwitch: false,
      volleyballSwitch: false,
      musicSwitch: false,
      theaterSwitch: false,
      visualartSwitch: false,
      Username: '',
      email: '',
      password: '',
      offset: {
        x: 0,
        y: 0,
      },
    };
  }

  _placeHolderAdminPassword() {

    if (undefined !== this.props.adminPassword && this.props.adminPassword !== null && this.props.adminPassword.length > 0) {
      //return this.props.adminPassword;
    }
    return 'Enter Admin Password';
  }


  render() {
    return (
      <Container>
        <HeaderContent />

        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.bg}>
            <Text style={styles.signupHeader}>SETTINGS</Text>
          </View>
          <View style={styles.notificationSwitchContainer}>
            <Text style={styles.notificationHeader}>ADMIN PASSWORD</Text>
            <Item rounded style={styles.inputGrp}>
              <Icon name="ios-lock" />
              <TextInput
                ref="AdminPassword"
               // onChangeText={adminPassword => this.props.setAdminPassword(adminPassword)}
                placeholderTextColor="#FFF"
                style={styles.input}
                autoCapitalize="none"
                autoFocus
                selectionColor="#FFF"
                enablesReturnKeyAutomatically
                returnKeyType="return"
              />
            </Item>

          </View>

          <View style={styles.notificationSwitchContainer}>
            <Text style={styles.notificationHeader}>EVENTS I WANT TO FOLLOW</Text>
            <View>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>EARLY YEARS</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ earlyyearsSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.earlyyearsSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>LOWER ELEMENTARY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ lowerelemSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.lowerelemSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>UPPER ELEMENTARY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ upperelemSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.upperelemSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>MIDDLE SCHOOL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ middleSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.middleSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>HIGH SCHOOL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ highSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.highSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>BADMINTON</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ badmintonSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.badmintonSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>BASKETBALL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ basketballSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.basketballSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>CROSS COUNTRY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ crosscountrySwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.crosscountrySwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>GOLF</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ golfSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.golfSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>RUGBY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ rugbySwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.rugbySwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>SOCCER</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ soccerSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.soccerSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>SOFTBALL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ softballSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.softballSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>SWIMMING</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ swimmingSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.swimmingSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>TENNIS</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ tennisSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.tennisSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>TRACK & FIELD</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ trackSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.trackSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>VOLLEYBALL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ volleyballSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.volleyballSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                    <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>MUSIC</Text>
                  </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                    <Switch
                      onValueChange={value => this.setState({ musicSwitch: value })}
                      onTintColor={primary}
                      style={styles.switch}
                      thumbTintColor="#ccc"
                      tintColor="#aaa"
                      value={this.state.musicSwitch}
                    />
                  </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                      <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>THEATRE</Text>
                    </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                      <Switch
                        onValueChange={value => this.setState({ theaterSwitch: value })}
                        onTintColor={primary}
                        style={styles.switch}
                        thumbTintColor="#ccc"
                        tintColor="#aaa"
                        value={this.state.theaterSwitch}
                      />
                    </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                          <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>VISUAL ARTS</Text>
                        </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                          <Switch
                          onValueChange={value => this.setState({ visualartSwitch: value })}
                          onTintColor={primary}
                          style={styles.switch}
                          thumbTintColor="#ccc"
                          tintColor="#aaa"
                          value={this.state.visualartSwitch}
                        />
                        </Col>
              </Grid>
            </View>
          </View>
        </Content>

      </Container>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  adminPassword: state.user.adminPassword,
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
