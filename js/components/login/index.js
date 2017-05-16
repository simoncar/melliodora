import React, { Component } from 'react';
import { Image, Platform, StatusBar } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Item, Input, Button, Icon, View, Left, Right } from 'native-base';

import styles from './styles';
import commonColor from '../../../native-base-theme/variables/commonColor';

import { ActionCreators } from '../../actions'

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
      username: 'simoncar@gmail.com',
      password: 's9monh9ll,s',
    };
    this.constructor.childContextTypes = {
      theme: React.PropTypes.object,
    };
  }


  incrementRecipeCount() {
      this.setState({recipeCount: this.state.recipeCount+1});
  }
  addRecipe(username) {
    this.props.setLoginDetails(username);
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
                  placeholder="MyStamford Login"
                  onChangeText={username => {this.addRecipe(username) }}
                  placeholderTextColor="#FFF"
                  style={styles.input}
                />
              </Item>

              <Item rounded style={styles.inputGrp}>
                <Icon name="unlock" />
                <Input
                  placeholder="My Stamford Password"
                  secureTextEntry
                  placeholderTextColor="#FFF"
                  onChangeText={password => this.setState({ password })}
                  style={styles.input}
                />
              </Item>

              <Button
                rounded primary block large
                style={styles.loginBtn}
                onPress={() => Actions.calendar2({ username: this.state.username, password: this.state.password })}
              >
                <Text style={Platform.OS === 'android' ? { fontSize: 16, textAlign: 'center', top: -5 } : { fontSize: 16, fontWeight: '900' }}>Get Started</Text>
              </Button>

              <View style={styles.otherLinksContainer}>
                <Left>
                  <Button transparent style={{ alignSelf: 'flex-start' }} onPress={() => Actions.channels()}>
                    <Text style={styles.helpBtns}>GUEST</Text>
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


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
