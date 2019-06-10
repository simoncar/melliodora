import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  Text
} from "react-native";

import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";
import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";
import moment from "moment";

import { isAdmin } from "../global.js";


const { width } = Dimensions.get("window");

class BeaconItem extends Component {
  constructor(props) {
    super(props);
  }

  renderProfileIcons(lastSeen,timestamp, beaconType) {
   

    if (beaconType == "Asset") {
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
            <MaterialIcons
              style={{ color: "white", fontSize: 20 }}
              name="device-hub"
            />
          </View>
        </View>
      );
    } else {
       
      return (
        <Grid>
          <Row>
            <Col
              style={{
                width: 45
              }}
            >
              <View
                style={{
                  borderRadius: 30,
                  backgroundColor: "green",
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
                  <Feather
                    style={{ color: "white", fontSize: 20 }}
                    name="radio"
                  />
                </View>
              </View>
            </Col>
          </Row>
        </Grid>
      );
    
    }
  }

  renderLastSeen(lastSeen, timestamp, beaconState) {

    if (lastSeen != null && timestamp == null) {
      lastSeenDateTime = moment(lastSeen).format("LLL");

      return (<View><Text style={styles.chatDescription}>{beaconState}</Text><Text style={styles.chatDescription}>{lastSeenDateTime}</Text></View>)
    } else if (timestamp != null) {
      return <Text style={styles.lastSeenActive}>{beaconState}</Text>;
    } else {
      return <Text style={styles.lastSeenActive}>{beaconState}</Text>;
    }
  }

  renderBeaconCampus(beaconCampus) {
    if (beaconCampus != null && beaconCampus.length > 0) {
      return <Text style={styles.chatDescription}>{beaconCampus}</Text>;
    }
  }

  renderBeaconIcon(beaconPictureURL) {
    if (
      beaconPictureURL != null &&
      beaconPictureURL != undefined &&
      beaconPictureURL.length > 0
    ) {
      return (
        <Image
        style={styles.singleChatItemImage}
        source={{ uri: beaconPictureURL }}
      />
      );
    } else {
      return (
      <MaterialIcons
        style={styles.singleChatItemIcon}
        name="person"
      />
      )
    }
  }
  renderBeaconType(beaconType) {
    if (
      beaconType != null &&
      beaconType != undefined &&
      beaconType.length > 0
    ) {
      return <Text style={styles.chatDescription}>{beaconType}</Text>;
    }
  }

  render() {
    //console.log(this.props.beaconName);

    return (
      <View style={styles.chatRow}>
        <Grid>
          <Row>
            <Col>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  this.props.navigation.navigate("chat", {
                    chatroom: "beacon-" + this.props.beaconName,
                    description: "Safeguarding Chat",
                    contact: "",
                    url: this.props.beaconName
                  });
                }}
              >

             {this.renderBeaconIcon(this.props.beaconPictureURL)}

                <View>
                  <Text style={styles.chatTitle}>{this.props.beaconName}</Text>
                  <Text style={styles.chatDescription} />
                  {this.renderLastSeen(this.props.lastSeen, this.props.timestamp, this.props.state)}
                  {this.renderBeaconCampus(this.props.beaconCampus)}
                </View>
              </TouchableOpacity>
            </Col>
            <Col style={{ width: 70 }}>
              {this.renderProfileIcons(
                this.props.lastSeen,
                this.props.timestamp,
                this.props.beaconType
              )}
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
}

module.exports = BeaconItem;
