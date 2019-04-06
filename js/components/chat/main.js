import React, { Component } from 'react';

import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';

import { Constants } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './styles';
import { openDrawer } from '../../actions/drawer';
import * as ActionCreators from '../../actions';

class Main extends Component {

  constructor(props) {
    super(props);   
  }

  onPress = () => {
    this.props.navigation.navigate('login');
  };

  componentWillMount() {
  if (Constants.manifest.extra.instance == '0001-sais_edu_sg') {
    if (this.props.userX.nickname) {
      console.log ("yyyyyyy=" , this.props.userX.nickname)
      this.props.navigation.navigate('chat', 
          { chatroom: 'CXS', name: this.props.userX.nickname}
      ); 
      //we have a value, good

    } else {
      //nothing :-(
      
    };

  };
};

  render() {
    return (
      <View>
        <Text style={styles.nameText}>You need to setup your chat account name</Text>


        <TouchableOpacity onPress={this.onPress}>
          <Text style={styles.buttonText}>Setup Chat Name</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators (ActionCreators, dispatch)
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  userX: state.user,

});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

