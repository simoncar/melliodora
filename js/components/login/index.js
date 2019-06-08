import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Dimensions, TextInput,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Ionicons } from '@expo/vector-icons';
import {
  Container, Content, Text, Item, Button, Icon,
} from 'native-base';

import HeaderContent from './../headerContent/header/';
import styles from './styles';

import * as ActionCreators from '../../actions';

//console.log('ACfromLogin=', ActionCreators);

const { skipLogin } = require('../../actions');

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

  doLogin(user, password) {
    this.props.navigation.navigate('webportal');
  }

  _placeHolderNickname() {
    if (undefined !== this.props.userX.nickname && this.props.userX.nickname !== null && this.props.userX.nickname.length > 0) {
      return this.props.userX.nickname;
    }

    console.log('bbb', this.props.userX.nickname);
    return 'Your Name  (First and Last)';
  }

  _placeHolderEmail() {
    if (undefined !== this.props.userX.name && this.props.userX.name !== null && this.props.userX.name.length > 0) {
      return this.props.userX.name;
    }

    console.log('bbb', this.props.userX.name);
    return 'myStamford parent email';
  }

  _placeHolderPassword() {
    if (undefined !== this.props.userX.password && this.props.userX.password !== null && this.props.userX.password.length > 0) {
      return '●●●●●●●●●●';
    }
    return 'myStamford password';
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <HeaderContent 
        navigation={this.props.navigation} 
        />

        <Content scrollEnabled bounces={false}>

          <View style={styles.bg}>
            <Text style={styles.textHeader}>myStamford</Text>
            <Item rounded style={styles.inputGrp}>
              <Ionicons style={styles.inputIcon} name="md-person" />
              <TextInput
                ref="NicknameInput"
                selectTextOnFocus
                placeholder={this._placeHolderNickname()}
                onChangeText={user => this.props.setNickname(user)}
                placeholderTextColor="grey"
                style={styles.input}
                autoCapitalize="none"
                autoFocus
                selectionColor="grey"
                enablesReturnKeyAutomatically
                returnKeyType="return"
                onSubmitEditing={() => this.refs.EmailInput.focus()}
              />
            </Item>

            <Item rounded style={styles.inputGrp}>
              <Ionicons style={styles.inputIcon} name="ios-mail" />
              <TextInput
                ref="EmailInput"
                selectTextOnFocus
                placeholder={this._placeHolderEmail()}
                onChangeText={user => this.props.setUsername(user)}
                placeholderTextColor="grey"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                selectionColor="grey"
                enablesReturnKeyAutomatically
                returnKeyType="return"
                onSubmitEditing={() => this.refs.PasswordInput.focus()}
              />
            </Item>

            <Item rounded style={styles.inputGrp}>
              <Ionicons style={styles.inputIcon} name="md-lock" />

              <TextInput
                ref="PasswordInput"
                style={styles.input}
                onChangeText={password => this.props.setPassword(password)}
                secureTextEntry
                placeholder={this._placeHolderPassword()}
                placeholderTextColor="grey"
                autoCapitalize="none"
                selectionColor="grey"
                enablesReturnKeyAutomatically
                returnKeyType="done"
                onSubmitEditing={() => this.doLogin(this.username, this.password)}
              />

            </Item>

            <Button
              rounded
              primary
              block
              large
              style={styles.loginBtn}
              onPress={() =>  this.props.navigation.navigate('homeNav')}
            >
              <Text style={styles.button}>Save</Text>
            </Button>

          </View>

        </Content>

      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  userX: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
