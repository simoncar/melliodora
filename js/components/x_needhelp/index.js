import React, { Component } from 'react';
import { Image, TouchableOpacity, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Button, Icon, Item, Input, View } from 'native-base';

import styles from './styles';
import commonColor from '../../../native-base-theme/variables/commonColor';

class NeedHelp extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
        <StatusBar
          backgroundColor={commonColor.statusBarColor}
          barStyle="light-content"
        />
        <Content contentOffset={this.state.offset}>
          <View>
            <Image source={require('../../../images/BG-signUp.png')} style={styles.background} >

              <Content padder scrollEnabled={false}>
                <Text style={styles.signupHeader}>
                                    Forgot Your Password?
                                </Text>
                <View style={styles.signupContainer}>
                  <Item rounded style={styles.inputGrp}>
                    <Icon name="mail-open" />
                    <Input
                      placeholder="Email" style={styles.input}
                      placeholderTextColor="#FFF"
                    />
                  </Item>

                  <Button
                    rounded block bordered
                    onPress={() => Actions.pop()}
                    style={styles.signupBtn}
                  >
                    <Text style={{ color: '#FFF' }}>Send Email</Text>
                  </Button>

                  <TouchableOpacity onPress={() => Actions.pop()}>
                    <Text style={styles.termsText}>Back To Login</Text>
                  </TouchableOpacity>
                </View>
              </Content>
            </Image>
          </View>
        </Content>
      </Container>
    );
  }
}


export default connect()(NeedHelp);
