
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Icon, Button, Left, Right, Body, Header } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

const headerLogo = require('../../../images/Header-Logo-White-0001.png');

class HeaderContent extends Component {

  static propTypes = {
    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  render() {
    return (
      <Header>

      <View style={{
             flex: 1,
             flexDirection: 'row',
             justifyContent: 'space-between',
           }}>


          <View>
                  <Button transparent onPress={this.props.openDrawer} >
                    <Icon active name="menu" />
                  </Button>
          </View>

          <Body>
            <Image source={headerLogo} style={styles.imageHeader} />
          </Body>


        <View>
           <Button transparent onPress={() => Actions.homeNav()}>
            <Icon active name="ios-home" />
           </Button>
        </View>

        </View>


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
