import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import firebase from "firebase";
import BeaconItem from "./beaconItem";

import { withMappedNavigationParams } from "react-navigation-props-mapper";

@withMappedNavigationParams()
class beacons extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Gateways",
    headerBackTitle: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      userBeacons: [],
    };

    this.ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("gateways");
  }

  componentDidMount() {
    try {
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    } catch (e) {
      //console.error(e.message);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  keyExtractor = item => item._key;

  onCollectionUpdate = beacons => {
    const userBeacons = [];

    beacons.forEach(doc => {
      userBeacons.push({
        campus: doc.data().campus,
        picture: doc.data().picture,
        timestamp: doc.data().timestamp,
        state: doc.data().state,
        mac: doc.data().mac,
        gatewayLoad: doc.data().gatewayLoad,
        gatewayFree: doc.data().gatewayFree,
        _key: doc.id,
      });
    });

    this.setState({
      userBeacons,
    });
  };

  _renderItem(item) {
    return <BeaconItem item={item} />;
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.userBeacons}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

export default beacons;
