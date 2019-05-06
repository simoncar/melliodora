import React, { Component } from "react";
import { FlatList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import * as firebase from "firebase";
import { Container, Content, Text, Button, Icon } from "native-base";

import Analytics from "../../lib/analytics";
import { Constants } from "expo";
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

    this.beaconsFirebase = firebase.database().ref(`instance/${instID}/beacon`);
    //this.beaconsFirebase = firebase.database().ref(`instance/${  instID  }/user/${ global.safeToken}/chatrooms`);
  }

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
      this.countStudent = 0;
      this.countParent = 0;
      this.countAdmin = 0;
      var beaconIcon = '';

      dataSnapshot.forEach(child => {
        switch (child.val().beaconType) {
          case "Student":
            ++this.countStudent;
            beaconIcon = "G" + child.val().beaconGrade
            break;
          case "Parent":
            ++this.countParent;
            beaconIcon = "P" 
            break;
          case "Staff":
            ++this.countAdmin;
            beaconIcon = "A" 
            break;
        }


        this.state.userBeacons.push({
          beaconCampus: child.val().beaconCampus,
          beaconGrade: child.val().beaconGrade,
          beaconIcon: beaconIcon,
          beaconName: child.val().beaconName,
          beaconType: child.val().beaconType,
          beaconPictureURL: child.val().beaconPictureURL,
          timestamp: child.val().timestamp,
          _key: child.key
        });
      });

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
        item={item}
      />
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Text style={styles.chatTitle}>Total  : {this.countStudent + this.countParent + this.countAdmin}</Text>
        <Text style={styles.chatTitle}>Students  : {this.countStudent}</Text>
        <Text style={styles.chatTitle}>Parents : {this.countParent}</Text>
        <Text style={styles.chatTitle}>Staff : {this.countAdmin}</Text>
        <Text style={styles.chatTitle}>Visitors : 0</Text>

        <Content style={{ paddingTop: 20 }}>
          <FlatList
            data={this.state.userBeacons}
            renderItem={this._renderItem2.bind(this)}
            keyExtractor={this.keyExtractor}
          />
        </Content>
      </Container>
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
