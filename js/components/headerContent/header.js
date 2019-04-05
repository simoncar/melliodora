
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Icon, Button, Left, Right, Body, Header, Text } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';


class HeaderContent extends Component {

  static propTypes = {
    openDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  _LeftNav() {

    if (this.props.showBack){
      return (
      <Button transparent onPress={() => Actions.pop()}>
        <Icon active style={styles.btnHeader} name="arrow-back" />
      </Button>
      )
    } else {
      return (
        <Button transparent style={styles.btnHeader} onPress={this.props.openDrawer} >
        <Icon active style={styles.btnHeader} name="menu" />
      </Button>
    )
    }
        
    
 
  }

  _RightNav() {

    if (this.props.showHome == 'false') {
      //dont show home button
      return (
        <Button transparent style={{
          width: 35
        }}>
        </Button>
      )
    } else {
      return (
        <Button transparent onPress={() => Actions.homeNav()}>
          <Icon active style={styles.btnHeader} name="ios-home" />
        </Button>
      )
    }
  }

  _PageTitle() {
    if (undefined !== this.props.pageTitle && null !== this.props.pageTitle &&  this.props.pageTitle.length > 0) {
      return (
        this.props.pageTitle
      );
    } else {
      return (
        "Stamford"
      );
    }
  }

  render() {
    return (
      <Header style={styles.header}>
        <View style={styles.viewHeader}>
          <View style={styles.btnHeader}>
          {this._LeftNav()}
          </View>
          <Body>
            <Text style={styles.textHeader}>{this._PageTitle()}</Text>
          </Body>
          <View style={styles.btnHeader}>
            {this._RightNav()}
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
