import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View, Platform,TouchableOpacity,Dimensions , TextInput} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { Actions, ActionConst } from 'react-native-router-flux';
import { Container,Content, Text, Item, Button, Icon, Left, Right, Body, Header } from 'native-base';

import HeaderContent from './../headerContent/header/';


import styles from './styles';

import * as ActionCreators  from '../../actions';

console.log("ACfromLogin=", ActionCreators);

var { skipLogin } = require('../../actions');

const deviceWidth = Dimensions.get('window').width;
const bg = require('../../../images/BG.png');
const headerLogo = require('../../../images/Header-Logo-White-0002.png');

class Login extends Component {

  static propTypes = {

    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);

  }

  doLogin(user,password) {
    Actions.webportal();
  }


  _placeHolderEmail() {

console.log("yy",this.props.userX.name)

  if (undefined !== this.props.userX.name && null !== this.props.userX.name &&  this.props.userX.name.length > 0) {
      return this.props.userX.name
    } else {

      console.log("bbb",this.props.userX.name)
      return "myStamford parent email"
    }
  }

  _placeHolderPassword() {
    if (undefined !== this.props.userX.password && null !== this.props.userX.password &&  this.props.userX.password.length > 0) {
      return "●●●●●●●●●●"
    } else {
      return "myStamford password"
    }
  }


  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
         <HeaderContent />

        <Content scrollEnabled={true} bounces={false}>
            <Image source={bg} style={styles.background} >

            <View style={styles.bg}>


              <Item rounded style={styles.inputGrp}>
                <Icon name="person" />
                <TextInput
                  ref='EmailInput'
                  selectTextOnFocus
                  placeholder= {this._placeHolderEmail()}
                  onChangeText={(user) => this.props.setUsername(user)}
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  autoCapitalize="none"
                  autoFocus = {true}
                  keyboardType="email-address"
                  selectionColor="#FFF"
                  enablesReturnKeyAutomatically
                  returnKeyType="return"
                  onSubmitEditing={() => this.refs.PasswordInput.focus() }
                />
              </Item>

              <Item rounded style={styles.inputGrp}>
                <Icon name="unlock" />

                  <TextInput
                    ref='PasswordInput'
                    style={styles.input}
                    onChangeText={(password) => this.props.setPassword(password)}
                    secureTextEntry={true}
                    placeholder={this._placeHolderPassword()}
                    placeholderTextColor="#FFF"
                    autoCapitalize="none"
                    enablesReturnKeyAutomatically
                    returnKeyType="done"
                    onSubmitEditing={() => this.doLogin(this.username,this.password)}
                  />


              </Item>

              <Button
                rounded primary block large
                style={styles.loginBtn}
                onPress={() => this.doLogin(this.username,this.password)}
              >
                <Text style={Platform.OS === 'android' ? { fontSize: 16, textAlign: 'center', top: -5 } : { fontSize: 16, fontWeight: '900' }}>LOGIN</Text>
              </Button>

              <Text>
                AS= {this.props.userX.authSecret}
              </Text>

              <View style={styles.otherLinksContainer}>
                <Left>
                </Left>
                <Right>
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
  return bindActionCreators (ActionCreators, dispatch)
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,

});

export default connect(mapStateToProps,mapDispatchToProps)(Login);
