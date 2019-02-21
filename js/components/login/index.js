import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ImageBackground, View, Platform, Dimensions , TextInput} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { Actions } from 'react-native-router-flux';
import { Container,Content, Text, Item, Button, Icon, Left, Right } from 'native-base';

import HeaderContent from './../headerContent/header/';
import styles from './styles';

import * as ActionCreators from '../../actions';

console.log("ACfromLogin=", ActionCreators);

var { skipLogin } = require('../../actions');

const deviceWidth = Dimensions.get('window').width;



class Login extends Component {

  static propTypes = {

    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    //  this.props.setauthSecret('');
  }

  doLogin(user,password) {
    Actions.webportal();
  }

  _placeHolderNickname() {

    console.log("yy ",this.props.userX.name)
    console.log("yy ",this.props.userX.ffauth_device_id)
    console.log("yy ",this.props.userX.ffauth_secret)
    
      if (undefined !== this.props.userX.nickname && null !== this.props.userX.nickname &&  this.props.userX.nickname.length > 0) {
          return this.props.userX.nickname
        } else {
    
          console.log("bbb",this.props.userX.nickname)
          return "Your nickname"
        }
      }
    

  _placeHolderEmail() {

console.log("yy ",this.props.userX.name)
console.log("yy ",this.props.userX.ffauth_device_id)
console.log("yy ",this.props.userX.ffauth_secret)

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

        <Content scrollEnabled bounces={false}>
           
            <View style={styles.bg}>

              <Item rounded style={styles.inputGrp}>
                <Icon style={styles.inputIcon} name="md-person" />
                <TextInput
                  ref='NicknameInput'
                  selectTextOnFocus
                  placeholder= {this._placeHolderNickname()}
                  onChangeText={(user) => this.props.setNickname(user)}
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  autoCapitalize="none"
                  autoFocus = {true}
                  selectionColor="#FFF"
                  enablesReturnKeyAutomatically
                  returnKeyType="return"
                  onSubmitEditing={() => this.refs.EmailInput.focus() }
                />
              </Item>

              <Item rounded style={styles.inputGrp}>
                <Icon style={styles.inputIcon} name="ios-mail" />
                <TextInput
                  ref='EmailInput'
                  selectTextOnFocus
                  placeholder= {this._placeHolderEmail()}
                  onChangeText={(user) => this.props.setUsername(user)}
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  selectionColor="#FFF"
                  enablesReturnKeyAutomatically
                  returnKeyType="return"
                  onSubmitEditing={() => this.refs.PasswordInput.focus() }
                />
              </Item>

              <Item rounded style={styles.inputGrp}>
                <Icon style={styles.inputIcon} name="md-lock" />

                  <TextInput
                    ref='PasswordInput'
                    style={styles.input}
                    onChangeText={(password) => this.props.setPassword(password)}
                    secureTextEntry
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
                onPress={() => Actions.homeNav()}
              >
                <Text style={Platform.OS === 'android' ? { fontSize: 16, textAlign: 'center', top: -5 } : { fontSize: 16, fontWeight: '900' }}>Done</Text>
              </Button>

             
              <View style={styles.otherLinksContainer}>
                <Left>
                </Left>
                <Right>
                </Right>
              </View>
            </View>

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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
