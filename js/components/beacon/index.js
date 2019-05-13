import React, { Component } from "react";
import { FlatList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import * as firebase from "firebase";
import { Container, Content, Text, Button, Icon, View } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";

import Analytics from "../../lib/analytics";
import { Constants } from "expo";
import { SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
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

    this.beaconsFirebase = firebase.database().ref(`instance/${instID}/beacon`).orderByChild('timestamp');
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
      this.countVisitor = 0;
      var beaconIcon = "";

      dataSnapshot.forEach(child => {
        switch (child.val().beaconType) {
          case "Student":
            ++this.countStudent;
            beaconIcon = "G"
            break;
          case "Parent":
            ++this.countParent;
            beaconIcon = "P";
            break;
          case "Staff":
            ++this.countAdmin;
            beaconIcon = "A";
            break;
            case "Visitor":
            ++this.countVisitor;
            beaconIcon = "V";
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
          lastSeen:  child.val().lastSeen,
          _key: child.key

          
        });
        console.log ("this.state.userBeacons.lastSeen=", child.val().lastSeen)
          console.log ("this.state.userBeacons.timestamp=", child.val().timestamp)
      });

      this.state.userBeacons.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : (a.timestamp === undefined) ? ((a.lastSeen < b.lastSeen) ? 1 : -1) : -1 )

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
      <Container style={styles.container}>
        <Text style={styles.chatTitle}>
          Total : {this.countStudent + this.countParent + this.countAdmin + this.countVisitor}
        </Text>
  
        <View style={{ height: 100 }}>
        <Grid style={{ height: 50 }}>
          <Col style={{ alignItems: 'center' }}>
            <Row>
            {this.renderCount("Staff",this.countStudent)}
            </Row>
            <Row>
              <Text style={styles.chatTitle}>Students</Text>
            </Row>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Row>
            {this.renderCount("Staff",this.countParent)}
            </Row>
            <Row>
              <Text style={styles.chatTitle}>Parents</Text>
            </Row>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Row>
            {this.renderCount("Staff", this.countAdmin)}
            </Row>
            <Row>
              <Text style={styles.chatTitle}>Staff</Text>
            </Row>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Row>
            {this.renderCount("Staff",this.countVisitor)}
            </Row>
            <Row>
              <Text style={styles.chatTitle}>Visitors</Text>
            </Row>
          </Col>
        </Grid>
        </View>

        <Content style={{ paddingTop: 5 }}>
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
