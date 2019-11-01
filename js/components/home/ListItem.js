import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import styles from "./styles";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { getLanguageString } from "../global";
import { formatTime, formatMonth } from "../global.js";

const { width } = Dimensions.get("window");

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  icon(source) {
    const uri = this.props.item.item.photo1;
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
    };
    if (source == "calendar") {
      return (
        <Ionicons
          name="ios-calendar"
          size={35}
          style={{
            width: 36,
            height: 36,
            margin: 12,
            borderRadius: 18,
            borderWidth: 0,
            borderColor: "lightgray",
            color: "#0075b7",
            textAlign: "center",
          }}
        />
      );
    } else {
      return (
        <Image
          style={{
            width: 36,
            height: 36,
            margin: 12,
            borderRadius: 18,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "lightgray",
            justifyContent: "center",
            alignItems: "center",
          }}
          {...{ preview, uri }}
        />
      );
    }
  }
  renderTime(start, end) {
    if (undefined != start && start.length > 0) {
      return <Text style={{ color: "gray", fontSize: 12, marginBottom: 3 }}>{formatTime(start, end)} </Text>;
    }
  }
  render() {
    const summary = getLanguageString(global.language, this.props.item.item, "summary");
    const showIconChat = this.props.item.item.showIconChat === false ? false : true;
    const uri = this.props.item.item.photo1;
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
    };
    const rightMargin = this.props.item.item.showIconChat === false ? 0 : 36;
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            paddingRight: 4,
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "lightgray",
            marginTop: 5,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => this.props.navigation.navigate("story", this.props.item.item)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {this.icon(this.props.item.item.source)}

              <View>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="clip"
                  style={{
                    width: width - 120 - rightMargin,
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 18,
                    color: "#262626",
                    fontWeight: "500",
                  }}
                >
                  {summary}
                </Text>
                <Text style={{ color: "gray", fontSize: 12, marginBottom: 3 }}>
                  {formatMonth(this.props.item.item.date_start)} {this.props.item.item.location}{" "}
                </Text>
                {this.renderTime(this.props.item.item.time_start_pretty, this.props.item.item.time_end_pretty)}
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
              {showIconChat && (
                <SimpleLineIcons name="bubble" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
              )}

              <Ionicons name="ios-more" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
            </View>
          </TouchableOpacity>
        </View>

        {uri && (
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => this.props.navigation.navigate("story", this.props.item.item)}
          >
            <Image style={{ width, height: 200 }} {...{ preview, uri }} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default ListItem;
