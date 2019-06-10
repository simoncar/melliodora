import React, { Component } from "react";
import { FlatList, Container, Content, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import * as firebase from "firebase";
import { Grid, Col, Row } from "react-native-easy-grid";

import Constants from "expo-constants";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationProps } from "react-navigation-props-mapper";

import styles from "./styles";

const BeaconItem = require("./beaconItem");
let instID = Constants.manifest.extra.instance;

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

@withMappedNavigationProps()
class beacons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      userBeacons: {}
    };

    this.beaconsFirebase = firebase
      .database()
      .ref(`instance/${instID}/beacon`)
      .orderByChild("state")
      
  }
  //.equalTo("Active");

  static navigationOptions = {
    title: "Campus Attendance",
    tabBarColor: "yellow",
    tabBarIcon: tabBarIcon("bubble")
  };

  componentDidMount() {
    this.listenLoadFromFirebase(this.beaconsFirebase);
  }

  keyExtractor = item => item._key;

  listenLoadFromFirebase(beacons) {
    beacons.on("value", dataSnapshot2 => {
      this.props.setUserBeacons(dataSnapshot2);
      dataSnapshot = dataSnapshot2;
      this.state.userBeacons = [];
      this.countEntered = 0;
      var beaconIcon = "";

      dataSnapshot.forEach(child => {
        beaconIcon = "G";

        if (
          child.val().beaconName != "GATEWAY" &&
          child.val().beaconName != "" &&
          (
            child.val().state == "Perimeter" ||
            child.val().state == "On Campus" ||
            child.val().state == "Off Campus"
          )
        ) {
          ++this.countEntered;
          this.state.userBeacons.push({
            beaconCampus: child.val().beaconCampus,
            beaconGrade: child.val().beaconGrade,
            beaconIcon: beaconIcon,
            beaconName: child.val().beaconName,
            beaconType: child.val().beaconType,
            beaconPictureURL: child.val().beaconPictureURL,
            timestamp: child.val().timestamp,
            lastSeen: child.val().lastSeen,
            state: child.val().state,
            _key: child.key
          });
        }
      });

      dataSnapshot.forEach(child => {
        beaconIcon = "G";

        if (child.val().beaconName == "GATEWAY") {
          this.state.userBeacons.push({
            beaconCampus: child.val().beaconCampus,
            beaconGrade: child.val().beaconGrade,
            beaconIcon: beaconIcon,
            beaconName: child.val().beaconName,
            beaconType: child.val().beaconType,
            beaconPictureURL: child.val().beaconPictureURL,
            timestamp: child.val().timestamp,
            lastSeen: child.val().lastSeen,
            state: child.val().state,
            _key: child.key
          });
        }
      });

      //this.state.userBeacons.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : (a.timestamp === undefined) ? ((a.lastSeen < b.lastSeen) ? 1 : -1) : -1 )
      // this.state.userBeacons.sort((a, b) => {
      //   if (a.state < b.state) return -1;
      //   if (a.state > b.state) return 1;
      //   return 0;
      // });

      this.setState({
        beacons
      });
    });
  }

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
        <View style={{ height: 100 }}>
          <Grid style={{ height: 50 }}>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("Total", 3028)}</Row>
              <Row>
                <Text style={styles.chatTitle}>Total</Text>
              </Row>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("Entered", this.countEntered)}</Row>
              <Row>
                <Text style={styles.chatTitle}>Entered</Text>
              </Row>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("Exited", 0)}</Row>
              <Row>
                <Text style={styles.chatTitle}>Exited</Text>
              </Row>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("No Show", 3028 - this.countEntered)}</Row>
              <Row>
                <Text style={styles.chatTitle}>No Show</Text>
              </Row>
            </Col>
          </Grid>
        </View>

        
          <FlatList
            data={this.state.userBeacons}
            renderItem={this._renderItem2.bind(this)}
            keyExtractor={this.keyExtractor}
          />
      
     </View>
    );
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
)(beacons);
