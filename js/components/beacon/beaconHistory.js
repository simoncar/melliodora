import React, { Component } from "react";
import { FlatList, Container, Content, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import * as firebase from "firebase";

import Constants from "expo-constants";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationProps } from "react-navigation-props-mapper";

import styles from "./styles";

let instID = Constants.manifest.extra.instance;

@withMappedNavigationProps()
class beaconHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      userBeacons: {}
    };

  }


  componentDidMount() {
    let loginsRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beaconHistory")
      .doc("20190618")
      .collection("C33FA1179F52");

    let allLogins = loginsRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, "=>", doc.data());
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  render() {
    return (
        <View>
    <Text>Hello</Text>
    </View>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(beaconHistory);
