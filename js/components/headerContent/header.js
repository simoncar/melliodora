
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button,  Body, Header, Text } from 'native-base';

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
    const { goBack } = this.props.navigation;
    if (this.props.showBack == 'true') {
      return (
      <Button transparent onPress={() => goBack(null)}>
        <Ionicons active style={styles.btnHeader} name="arrow-back" />
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
        <Button transparent onPress={() =>  this.props.navigation.navigate('homeNav')}>
          <Ionicons active style={styles.btnHeader} name="ios-home" />
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
      <View />
         

    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(HeaderContent);
