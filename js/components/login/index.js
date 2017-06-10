import React, { Component } from 'react';
import { Image, Platform, StatusBar,TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Item, Input, Button, Icon, View, Left, Right } from 'native-base';

import styles from './styles';
import commonColor from '../../../native-base-theme/variables/commonColor';

import { ActionCreators } from '../../actions'

var { skipLogin } = require('../../actions');

const bg = require('../../../images/BG.png');
const logo = require('../../../images/logo.png');

class Login extends Component {

  static propTypes = {
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
      <Container>
        <StatusBar
          backgroundColor={commonColor.statusBarColor}
          barStyle="light-content"
        />
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

return bindActionCreators (ActionCreators, dispatch);
    //bindActionCreators(ActionCreators, dispatch);

  /*  return
    {
      setName: (name) => {
        dispatch({
          type: "SET_NAME",
          payload: name
        })
      }*/
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
  passwordX: state.password
});

export default connect(mapStateToProps,mapDispatchToProps)(Login);
