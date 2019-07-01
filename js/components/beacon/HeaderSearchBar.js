import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";

export class HeaderSearchBar extends Component {

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
  }
  render() {
    const { navigation } = this.props;
    console.log("props", this.props.attendanceSearchTerm);

    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={forceInset} style={styles.HeaderArea}>
          <TouchableOpacity style={styles.HeaderBtn}
            onPress={() => navigation.goBack()}>
            <Ionicons name="ios-arrow-back" size={32} color="#007aff" />
          </TouchableOpacity>
          <SearchBar
            placeholder="Type Here..."
            lightTheme
            round
            containerStyle={styles.searchcontainerStyle}
            onChangeText={(text) => this.props.setAttendanceSearch(text)}
            value={this.props.attendanceSearchTerm}
          />

          <TouchableOpacity style={styles.HeaderBtn} >
            <FontAwesome name="star-o" size={28} color="#007aff" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    )
  }
}

const forceInset = {
  top: 'always',
  bottom: 'never',
  horizontal: 'always',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5
  },
  HeaderArea: {
    flex: 1,
    flexDirection: 'row'
  },
  HeaderBtn: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  searchcontainerStyle: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    flex: 1
  }


});


const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = (state) => {
  console.log("map state props", state.attendanceSearch.attendanceSearchTerm);
  return {
    attendanceSearchTerm: state.attendanceSearch.attendanceSearchTerm,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearchBar)
