import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import { Chip } from 'react-native-paper';

export class HeaderSearchBar extends Component {

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
  }
  render() {
    const { navigation } = this.props;
    console.log("props", this.props.attendanceSearchTerm);

    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={forceInset} style={styles.headerArea}>

          <View style={styles.searchBar}>
            <TouchableOpacity style={styles.headerBtn}
              onPress={() => navigation.goBack()}>
              <Ionicons name="ios-arrow-back" size={32} color="#007aff" />
            </TouchableOpacity>
            <SearchBar
              placeholder="Search..."
              lightTheme
              round
              containerStyle={styles.searchcontainerStyle}
              onChangeText={(text) => this.props.setAttendanceSearch(text)}
              value={this.props.attendanceSearchTerm}
            />

            <TouchableOpacity style={styles.headerBtn} >
              <FontAwesome name="star-o" size={28} color="#007aff" />
            </TouchableOpacity>
          </View>


          <View>
            <ScrollView horizontal style={{ paddingBottom: 5 }}>

              <Chip
                icon={() => (<FontAwesome name="calendar" size={12} color='gray' />)}
                onPress={() => console.log('Pressed')}
                textStyle={styles.filterTextStyle}
                style={styles.filterStyle}>
                28/06/2019
              </Chip>

              <Chip
                onPress={() => console.log('Pressed')}
                textStyle={styles.filterTextStyle}
                style={styles.filterStyle}>
                Grade/Class
              </Chip>

              <Chip
                onPress={() => console.log('Pressed')}
                textStyle={styles.filterTextStyle}
                style={styles.filterStyle}>
                Status
              </Chip>
            </ScrollView>

          </View>

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
  searchBar: {
    flex: 1,
    flexDirection: 'row'
  },
  headerBtn: {
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
  },
  headerArea: {
    flex: 1,
    flexDirection: 'column'
  },
  filterStyle: {
    borderRadius: 10,
    marginLeft: 8
  },
  filterTextStyle: {
    color: 'gray'
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
