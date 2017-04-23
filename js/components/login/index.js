import React, { Component } from 'react';
import { Image, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Item, Input, Button, Icon, View, Left, Right } from 'native-base';

import styles from './styles';
import commonColor from '../../../native-base-theme/variables/commonColor';

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
    this.state = {
      username: '',
      password: '',
    };
    this.constructor.childContextTypes = {
      theme: React.PropTypes.object,
    };
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
            <Image source={logo} style={Platform.OS === 'android' ? styles.aShadow : styles.iosShadow} />

            <View style={styles.bg}>
              <Item rounded style={styles.inputGrp}>
                <Icon name="person" />
                <Input
                  placeholder="Username"
                  onChangeText={username => this.setState({ username })}
                  placeholderTextColor="#FFF"
                  style={styles.input}
                />
              </Item>

              <Item rounded style={styles.inputGrp}>
                <Icon name="unlock" />
                <Input
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor="#FFF"
                  onChangeText={password => this.setState({ password })}
                  style={styles.input}
                />
              </Item>

              <Button
                rounded primary block large
                style={styles.loginBtn}
                onPress={() => Actions.walkthrough({ username: this.state.username, password: this.state.password })}
              >
                <Text style={Platform.OS === 'android' ? { fontSize: 16, textAlign: 'center', top: -5 } : { fontSize: 16, fontWeight: '900' }}>Get Started</Text>
              </Button>

              <View style={styles.otherLinksContainer}>
                <Left>
                  <Button transparent style={{ alignSelf: 'flex-start' }} onPress={() => Actions.signUp()}>
                    <Text style={styles.helpBtns}>
                          Create Account
                      </Text>
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


function bindActions(dispatch) {
  return {
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(Login);
