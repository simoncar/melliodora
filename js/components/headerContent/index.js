
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Icon, Button, Left, Right, Body, Header } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';


const headerLogo = require('../../../images/Header-Logo.png');

class HeaderContent extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Header>
        <Left>
          <Button transparent onPress={() => Actions.popTo('home')}>
            <Icon active name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Image source={headerLogo} style={styles.imageHeader} />
        </Body>
        <Right>
          <Button transparent onPress={this.props.openDrawer} >
            <Icon active name="menu" />
          </Button>
        </Right>
      </Header>
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

export default connect(mapStateToProps, bindAction)(HeaderContent);
