import React, { Component } from "react";
import { FlatList, Container, Content, Text, View } from "react-native";
import * as firebase from "firebase";
import BeaconHistoryItem from "./BeaconHistoryItem";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import moment from "moment";

@withMappedNavigationParams()
class beaconHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      userBeacons: {},
      history: [],
    };
  }

  componentDidMount() {
    const today = new moment().format("YYYYMMDD");
    const beacon = this.props._key;

    let loginsRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beaconHistory")
      .doc(today)
      .collection(beacon);

    loginsRef
      .get()
      .then(snapshot => {
        const history = [];
        snapshot.forEach(doc => {
          history.push(doc.data());
        });
        this.setState({ history });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  _renderListItem = ({ item, index }) => {
    if (index === 0) return <BeaconHistoryItem start={true} {...item} />;
    else if (index === this.state.history.length - 1) return <BeaconHistoryItem last={true} {...item} />;
    else return <BeaconHistoryItem {...item} />;
  };

  render() {
    return (
      <View style={{ paddingTop: 50 }}>
        <FlatList data={this.state.history} renderItem={this._renderListItem} />
      </View>
    );
  }
}

export default beaconHistory;
