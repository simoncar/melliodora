import React, { Component } from "react";
import { FlatList, Container, Content, Text, View } from "react-native";
import firebase from "firebase";
import { Grid, Col, Row } from "react-native-easy-grid";

import Constants from "expo-constants";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationParams } from "react-navigation-props-mapper";

import styles from "./styles";

const BeaconItem = require("./beaconItem");

@withMappedNavigationParams()
class beacons extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Gateways",
    headerBackTitle: null
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      userBeacons: []
    };

    this.ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons")
      .where("name", "==", "GATEWAY");
  }
  //.equalTo("Active");

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  keyExtractor = item => item._key;

  onCollectionUpdate = beacons => {
    const userBeacons = [];
    this.countEntered = 0;
    var beaconIcon = "";

    beacons.forEach(doc => {
      beaconIcon = "G";

      if (doc.data().name == "GATEWAY") {
        userBeacons.push({
          beaconCampus: doc.data().campus,
          beaconGrade: doc.data().beaconGrade,
          beaconIcon: beaconIcon,
          beaconName: doc.data().name,
          beaconType: doc.data().beaconType,
          beaconPictureURL: doc.data().beaconPictureURL,
          timestamp: doc.data().timestamp,
          lastSeen: doc.data().lastSeen,
          state: doc.data().state,
          _key: doc.id
        });
      }
    });

    this.setState({
      userBeacons
    });
  };

  _renderItem2(item) {
    return (
      <BeaconItem
        navigation={this.props.navigation}
        beaconCampus={item.item.beaconCampus}
        beaconName={item.item.beaconName}
        beaconIcon={item.item.beaconIcon}
        beaconType={item.item.beaconType}
        beaconGrade={item.item.beaconGrade}
        beaconPictureURL={item.item.beaconPictureURL}
        lastSeen={item.item.lastSeen}
        timestamp={item.item.timestamp}
        item={item}
        state={item.item.state}
        _key={item.item._key}
      />
    );
  }

  renderCount(item, count) {
    return (
      <View
        style={{
          borderRadius: 30,
          backgroundColor: "#1DAEF2",
          width: 45,
          height: 45,
          marginLeft: 10,
          marginTop: 10,
          alignItems: "center",
          paddingLeft: 0,
          paddingRight: 0,
          justifyContent: "center"
        }}
      >
        <View>
          <Text>{count}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.userBeacons}
          renderItem={this._renderItem2.bind(this)}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

export default beacons;
