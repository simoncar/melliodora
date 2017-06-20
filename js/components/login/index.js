import React, { Component } from 'react';
import { Image, View, Platform,TouchableOpacity,Dimensions } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { Actions, ActionConst } from 'react-native-router-flux';
import { Container,Content, Text, Item, Input, Button, Icon, Left, Right, Body, Header } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

import { ActionCreators } from '../../actions'

var { skipLogin } = require('../../actions');

const deviceWidth = Dimensions.get('window').width;
const bg = require('../../../images/BG.png');
const headerLogo = require('../../../images/Header-Logo-White-0001.png');

class Login extends Component {

  static propTypes = {

    openDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);

    this.constructor.childContextTypes = {
      theme: React.PropTypes.object,
    };
  }

  setUsername(user) {
    //this.props.logIn();
    //this.props.setLoginDetails( {username: 'simon'} );
    //Actions.home();

  }

  doLogin(user,password) {
    //this.props.logIn();
    //this.props.setLoginDetails( {user: user} );
    //this.props.setLoginDetails( {password: password} );
    Actions.home();
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>

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
         <Button transparent onPress={() => Actions.login({ type: ActionConst.RESET  })}>
                    <Icon active name="power" />
         </Button>
      </Right>
      </Header>


        <Content scrollEnabled={true} bounces={false}>
            <Image source={bg} style={styles.background} >
            <Image style={Platform.OS === 'android' ? styles.aShadow : styles.iosShadow} />

            <View style={styles.bg}>


              <Item rounded style={styles.inputGrp}>
                <Icon name="person" />
                <Input
                  placeholder={this.props.userX.name}
                  onChangeText={(user) => this.props.setUsername(user)}
                  placeholderTextColor="#FFF"
                  style={styles.input}
                />
              </Item>

              <Item rounded style={styles.inputGrp}>
                <Icon name="unlock" />
                <Input
                  placeholder={this.props.userX.password}    //"My Stamford Password"
                  secureTextEntry
                  placeholderTextColor="#FFF"
                  onChangeText={(password) => this.props.setPassword(password)}
                  style={styles.input}
                />
              </Item>

              <Button
                rounded primary block large
                style={styles.loginBtn}
                onPress={() => this.doLogin(this.username,this.password)}
              >
                <Text style={Platform.OS === 'android' ? { fontSize: 16, textAlign: 'center', top: -5 } : { fontSize: 16, fontWeight: '900' }}>Get Started</Text>
              </Button>

              <View style={styles.otherLinksContainer}>
                <Left>
                  <Button transparent style={{ alignSelf: 'flex-start' }} onPress={() => Actions.channels()}>
                    <Text style={styles.helpBtns}>Guest</Text>
                  </Button>
                </Left>
                <Left>
                  <Button transparent style={{ alignSelf: 'flex-start' }} onPress={() => this.props.skipLogin()}>
                    <Text style={styles.helpBtns}>Skip Login</Text>
                  </Button>
                </Left>

                <Right>
                  <Button transparent style={{ alignSelf: 'flex-end' }} onPress={() => Actions.needhelp()}>
                    <Text style={styles.helpBtns}>
                          Need Help?
                      </Text>
                  </Button>
                </Right>
              </View>
            </View>

          </Image>

        </Content>
      </Container>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
    return {
      openDrawer: () => dispatch(openDrawer()),
    };
  }

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
  passwordX: state.password
});

export default connect(mapStateToProps,mapDispatchToProps)(Login);
