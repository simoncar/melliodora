

import React, { Component } from 'react';
import { Image, View, Switch, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';

import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Thumbnail, Item, Input, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { openDrawer } from '../../actions/drawer';

import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;
const headerLogo = require('../../../images/Header-Logo-White-0001.png');

class Settings extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      monSwitch: false,
      tueSwitch: false,
      wedSwitch: true,
      thuSwitch: true,
      friSwitch: false,
      satSwitch: false,
      sunSwitch: false,
      Username: '',
      email: '',
      password: '',
      offset: {
        x: 0,
        y: 0,
      },
    };

    this.constructor.childContextTypes = {
      theme: React.PropTypes.object,
    };
  }


  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.props.openDrawer} >
              <Icon active name="menu" />
            </Button>
          </Left>

          <Body>
            <Image source={headerLogo} style={styles.imageHeader} />
          </Body>
          <Right>
            <Button transparent style={styles.btnHeader} onPress={() => Actions.popTo('home')}>
              <Icon active name="arrow-back" />
            </Button>
          </Right>
        </Header>

        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.bg}>
            <Text style={styles.signupHeader}>EVENT SELECTION</Text>
            <View style={{ marginTop: 10 }}>
              <Grid>
                <Col>
                  <Button transparent style={styles.roundedButton}>
                    <Icon name="cloud-upload" style={Platform.OS === 'android' ? { color: '#FFF', width: 23 } : { color: '#FFF', width: 22 }} />
                  </Button>
                </Col>
                <Col>
                  <TouchableOpacity style={{ alignSelf: 'center' }}>
                    <Thumbnail source={require('../../../images/contacts/sanket.png')} style={styles.profilePic} />
                  </TouchableOpacity>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}>
                    <Icon name="cloud-download" style={Platform.OS === 'android' ? { color: '#FFF', width: 23 } : { lineHeight: 0, color: '#FFF', width: 22 }} />
                  </Button>
                </Col>
              </Grid>
            </View>
          </View>
          <View style={styles.notificationSwitchContainer}>
            <Text style={styles.notificationHeader}>EVENTS I WANT TO FOLLOW</Text>
            <View>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>LOWER ELEMENTARY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ monSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.monSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>UPPER ELEMENTARY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ tueSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.tueSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>MIDDLE SCHOOL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ wedSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.wedSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>HIGH SCHOOL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ thuSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.thuSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>DRAMA</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ friSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.friSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>SWIMMING</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>MUSIC</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ sunSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.sunSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>RUGBY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>FOOTBALL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>TENNIS</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>VOLLEYBALL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>CROSS COUNTRY</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>BADMINTON</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>GOLF</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>GYMNASTICS</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
                  />
                </Col>
              </Grid>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text style={Platform.OS === 'android' ? styles.aswitchText : styles.switchText}>SOFTBALL</Text>
                </Col>
                <Col style={Platform.OS === 'android' ? styles.aswitchContainer : styles.switchContainer}>
                  <Switch
                    onValueChange={value => this.setState({ satSwitch: value })}
                    onTintColor={primary}
                    style={styles.switch}
                    thumbTintColor="#ccc"
                    tintColor="#aaa"
                    value={this.state.satSwitch}
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

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Settings);
