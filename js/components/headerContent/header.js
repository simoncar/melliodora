
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Icon, Button, Left, Right, Body, Header, Text } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

const headerLogo = require('../../../images/Header-Logo-White-0002.png');

class HeaderContent extends Component {

  static propTypes = {
    openDrawer: PropTypes.func,
    showHome: PropTypes.string,
    showBack: PropTypes.string,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  _HomeNav() {
    console.log (this.props.showHome)
    if( this.props.showHome == 'false'){
        //dont show home button
        return(
          <Button transparent style={{
               width: 35}}>
          </Button>
        )

    } else if ( this.props.showBack == 'true') {

     <Button transparent style={styles.btnHeader} onPress={() => Actions.pop()}>
       <Icon active name="ios-home" />
     </Button>

   } else { 
      return(
        <Button transparent onPress={() => Actions.homeNav()}>
         <Icon active name="ios-home" />
        </Button>
      )
    }
  }



  render() {

    return (
      <Header style={styles.header}>
        <View style={styles.viewHeader}>       
          <View>
            <Button transparent onPress={this.props.openDrawer} >
              <Icon active name="menu" />
            </Button>
          </View>
          <Body>
            <Image source={headerLogo} style={styles.imageHeader} />
          </Body>
          <View>
              {this._HomeNav()}
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
