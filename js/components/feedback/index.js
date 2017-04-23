

import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';

import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Button, Icon, Item, Input, Left, Right, Body } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

const primary = require('../../themes/variable').brandPrimary;

class Feedback extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }
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
      <Container contentOffset={this.state.offset} scrollEnabled={false} >
        <Image source={require('../../../images/BG-signUp.png')} style={styles.container} >
          <Header>
            <Left>
              <Button transparent onPress={this.props.openDrawer} >
                <Icon active name="menu" />
              </Button>
            </Left>
            <Body>
              <Image source={require('../../../images/Header-Logo.png')} style={styles.imageHeader} />
            </Body>
            <Right>
              <Button transparent onPress={() => Actions.login({ type: ActionConst.RESET  })}>
                <Icon active name="power" />
              </Button>
            </Right>
          </Header>

          <Content showsVerticalScrollIndicator={false}>
            <View style={styles.contentIconsContainer}>
              <Grid>
                <Col>
                  <Button transparent style={styles.roundedButton}>
                    <Icon name="ios-call-outline" style={{ fontSize: 30, width: 30, color: '#FFF' }} />
                  </Button>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedCustomButton}>
                    <Icon name="ios-mail-outline" style={{ fontSize: 28, color: primary, width: 22, marginLeft: 5 }} />
                  </Button>
                </Col>
                <Col>
                  <Button transparent style={styles.roundedButton}>
                    <Icon name="ios-pin-outline" style={{ fontSize: 28, width: 30, color: '#FFF' }} />
                  </Button>
                </Col>
              </Grid>
            </View>
            <View style={styles.feedbackHeaderContainer}>
              <Text style={styles.feedbackHeader}>SEND FEEDBACK</Text>
              <Text note style={styles.feedbackHead}>Your feedback is very important to us.</Text>
            </View>
            <View style={styles.feedbackContainer}>
              <Item rounded style={styles.inputGrp}>
                <Icon name="ios-person-outline" />
                <Input placeholder="Username" placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} />
              </Item>
              <Item rounded style={styles.inputGrp}>
                <Icon name="ios-mail-outline" />
                <Input placeholder="Email" placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} />
              </Item>


              <View style={styles.feedbackInputBox}>
                  <Item iconRight>
                    <Input placeholder="Write something..." placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} />
                    <Icon active name="arrow-forward" style={styles.forwardIcon} />
                  </Item>
              </View>
            </View>
          </Content>
        </Image>
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

export default connect(mapStateToProps, bindAction)(Feedback);
