import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";

import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import moment from "moment";

class BeaconItem extends Component {
  constructor(props) {
    super(props);
  }

  renderProfileIcons(lastSeen, timestamp, beaconType) {
    if (this.isOnline(timestamp)) {
      var color = "green";
    } else {
      var color = "red";
    }

    return (
      <Grid>
        <Row>
          <Col
            style={{
              width: 45,
            }}
          >
            <View
              style={{
                borderRadius: 30,
                backgroundColor: color,
                width: 45,
                height: 45,
                marginLeft: 10,
                marginTop: 10,
                alignItems: "center",
                paddingLeft: 0,
                paddingRight: 0,
                justifyContent: "center",
              }}
            >
              <View>
                <Feather style={{ color: "white", fontSize: 20 }} name="radio" />
              </View>
            </View>
          </Col>
        </Row>
      </Grid>
    );
  }

  isOnline(timestamp) {
    const now = Date.now();
    const cutoff = now - 100000; //CUT_OFF_TIME;
    if (timestamp < cutoff) {
      return false;
    } else {
      return true;
    }
  }

  renderLastSeen(lastSeen, timestamp, beaconState) {
    if (this.isOnline(timestamp)) {
      return <Text style={styles.lastSeenActive}>Healthy</Text>;
    } else {
      lastSeenDateTime = moment(timestamp).format("LLL");
      return (
        <View>
          <Text style={styles.offlineTitle}>Offline</Text>
          <Text style={styles.chatDescription}>Last Seen {lastSeenDateTime}</Text>
        </View>
      );
    }
  }

  rendercampus(campus) {
    if (campus != null && campus.length > 0) {
      return <Text style={styles.chatDescription}>{campus}</Text>;
    }
  }

  renderBeaconIcon() {
    return <Image style={styles.singleChatItemImage} source={require("../../../images/minew_G1.png")} />;
  }

  renderBeaconType(beaconType) {
    if (beaconType != null && beaconType != undefined && beaconType.length > 0) {
      return <Text style={styles.chatDescription}>{beaconType}</Text>;
    }
  }

  render() {
    console.log(this.props);

    return (
      <View style={styles.chatRow}>
        <Grid>
          <Row>
            <Col>
              <TouchableOpacity style={{ flexDirection: "row" }}>
                {this.renderBeaconIcon()}

                <View>
                  <Text style={styles.chatTitle}>{this.rendercampus(this.props.item.item.campus)}</Text>

                  <Text style={styles.chatDescription} />
                  {this.renderLastSeen(
                    this.props.item.item.lastSeen,
                    this.props.item.item.timestamp,
                    this.props.item.item.state,
                  )}

                  <Text style={styles.chatDescription}>{this.props.item.item._key}</Text>
                  <Text style={styles.chatDescription}>Load : {this.props.item.item.gatewayLoad} %</Text>
                  <Text style={styles.chatDescription}>Free : {this.props.item.item.gatewayFree} %</Text>
                </View>
              </TouchableOpacity>
            </Col>
            <Col style={{ width: 70 }}>
              {this.renderProfileIcons(
                this.props.item.item.lastSeen,
                this.props.item.item.timestamp,
                this.props.item.item.beaconType,
              )}
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
}

module.exports = BeaconItem;
