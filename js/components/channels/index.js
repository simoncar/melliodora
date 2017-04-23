

import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Container, Header, Left, Body, Right, Button, Icon } from 'native-base';
import { openDrawer } from '../../actions/drawer';

import styles from './styles';

import TabOne from './tabOne';
import TabTwo from './tabTwo';
import TabThree from './tabThree';

import CustomTabBar from './CustomTabBar';

const headerLogo = require('../../../images/Header-Logo.png');

class Channels extends Component {


  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
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
        <View style={styles.bgHead}>

          <ScrollableTabView renderTabBar={() => <CustomTabBar someProp={'here'} />}>
            <TabOne tabLabel="Following" />
            <TabTwo tabLabel="Popular" />
            <TabThree tabLabel="Explore" />
          </ScrollableTabView>
        </View>
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

export default connect(mapStateToProps, bindAction)(Channels);
