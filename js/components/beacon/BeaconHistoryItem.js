import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  Text
} from "react-native";

import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";
import moment from "moment";

import { isAdmin } from "../global.js";

const { width } = Dimensions.get("window");

export default class BeaconHistoryItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { start, last, state, campus, timestamp } = this.props;
    const line = () => {
      if (start) return style.lineStart;
      if (last) return style.lineEnd;
      return style.line;
    };
    return (
      <>

        {start && (
          <View style={style.sectionHead}>
            <Text style={style.location}>{campus ? campus : "-----"}</Text>
          </View>)
        }
        <View style={style.container}>
          <View style={style.timeContainer}>
            <Text adjustsFontSizeToFit style={style.time}>
              {timestamp}
              {/* {moment(timestamp).format("LLL")} */}
            </Text>
          </View>

          <View style={style.iconPlaceHolder}>
            <View style={line()} />
            <View
              style={
                start || last
                  ? style.iconPlacementStartEnd
                  : style.iconPlacement
              }
            />
          </View>
          <View style={style.details}>
            <Text style={style.detailsText}>{state}</Text>
          </View>
        </View>
      </>
    );
  }
}

const style = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch"
  },
  sectionHead: {
    backgroundColor: "#f2f2f7",
    width: width,
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    paddingLeft: 155,

  },
  location: {
    color: "#48484a",
    flex: 1,
    alignSelf: "stretch"
  },
  timeContainer: {
    flex: 2,
    justifyContent: "center"
  },
  time: {
    // padding  : 10,
    textAlign: "right",
    fontWeight: "bold"
  },
  iconPlaceHolder: {
    flexDirection: "column",
    flex: 1,
    height: 70
  },
  iconPlacement: {
    backgroundColor: "green",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignSelf: "center",
    marginTop: "25%"
  },
  iconPlacementStartEnd: {
    backgroundColor: "green",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignSelf: "center",
    marginTop: "20%"
  },
  line: {
    backgroundColor: "gray",
    position: "absolute",
    width: 5,
    height: "100%",
    left: "45%"
  },
  lineStart: {
    backgroundColor: "gray",
    position: "absolute",
    marginTop: "25%",
    width: 5,
    left: "45%",
    height: "82%"
  },
  lineEnd: {
    backgroundColor: "gray",
    position: "absolute",
    width: 5,
    height: "25%",
    left: "45%"
  },
  details: {
    alignSelf: "center",
    justifyContent: "center",
    flex: 3
  },
  detailsText: {
    fontWeight: "bold"
  }
});