import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import styles from "./styles";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { getLanguageString } from "../global";
import { Grid, Col, Row } from "react-native-easy-grid";
import { formatTime, formatMonth } from "../global.js";
const { width } = Dimensions.get("window");

class CalendarItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.item;
    return (
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => this.props.navigation.navigate("storyCalendar", item)}
      >
        <View
          style={[
            styles.agendaItem,
            {
              height: item.height,
              borderRightColor: this.formatBackground(item.color),
            },
          ]}
        >
          <Grid>
            <Row>
              <Col>
                <Text style={styles.agendaLocation}>
                  {formatMonth(item.date_start)} {item.location}{" "}
                </Text>
                {this.renderTime(item.time_start_pretty, item.time_end_pretty)}

                <Text style={styles.text}>{item.summary}</Text>

                {undefined !== item.group && item.group !== null && item.group.length > 0 && (
                  <View style={styles.groupView}>
                    <Text style={styles.groupText}>{item.group}</Text>
                  </View>
                )}
              </Col>
              <Col style={{ width: 60 }}>
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: this.formatBackground(item.color),
                    width: 45,
                    height: 45,
                    marginLeft: 10,
                    marginTop: 5,
                    alignItems: "center",
                    paddingLeft: 0,
                    paddingRight: 0,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons style={{ color: "white", fontSize: 20 }} name={item.icon} />
                  <View />
                </View>
              </Col>
            </Row>
            <Row>
              <View>{this.renderImage(item.photo1)}</View>
            </Row>
          </Grid>
        </View>
      </TouchableOpacity>
    );
  }
  renderImage(calImage) {
    if (undefined != calImage && calImage.length > 0) {
      return <Image source={{ uri: calImage }} style={{ width: 300, height: 150 }} resizeMode="contain" />;
    }
  }
  renderTime(start, end) {
    if (undefined != start && start.length > 0) {
      return <Text style={styles.agendaDate}>{formatTime(start, end)} </Text>;
    }
  }

  formatBackground(color) {
    let ret = "#1DAEF2";
    switch (color) {
      case "grey":
        ret = "#64D4D2";
        break;
      case "yellow":
        ret = "#8F63B8";
        break;
      case "purple":
        ret = "#8F63B8";
        break;
      case "red":
        ret = "#E63946";
        break;
      case "green":
        ret = "#64D4D2";
        break;
      case "light blue":
        ret = "white";
        break;
      case 5:
        ret = "Friday";
        break;
      case 6:
        ret = "Saturday";
    }

    return ret;
  }
}

export default CalendarItem;
