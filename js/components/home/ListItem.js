import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import styles from "./styles";
import { Ionicons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { getLanguageString } from "../global";
import { formatTime, formatMonth } from "../global.js";

const { width } = Dimensions.get("window");

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  icon(source, number) {
    const uri = this.props.item.photo1;
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
    };

    if (this.props.item.number >= 0) {
      return (
        <View
          style={{
            borderRadius: 30,
            backgroundColor: "#1daef2",
            width: 36,
            height: 36,
            margin: 12,
            alignItems: "center",
            paddingLeft: 0,
            paddingRight: 0,
            justifyContent: "center"
          }}>
          <Text
            size={35}
            style={{
              color: "white",
              fontSize: 14
            }}>
            {this.props.item.number}
          </Text>
        </View>
      );
    } else if (source == "calendar") {
      return (
        <Ionicons
          name="ios-calendar"
          size={35}
          style={{
            width: 36,
            height: 36,
            margin: 12,
            borderRadius: 5,
            borderWidth: 0,
            borderColor: "lightgray",
            color: "lightgray",
            textAlign: "center",
            textAlignVertical: "top"
          }}
        />
      );
    } else if (source == "balance") {
      return (
        <MaterialCommunityIcons
          name="cash-multiple"
          size={35}
          style={{
            width: 36,
            height: 36,
            margin: 12,
            borderRadius: 18,
            borderWidth: 0,
            borderColor: "lightgray",
            color: "lightgray",
            textAlign: "center"
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
            alignItems: "center"
          }}
          {...{ preview, uri }}
        />
      );
    }
  }
  renderTime(start, end, source) {
    if (source == "calendar") {
      if (undefined != start && start.length > 0) {
        return <Text style={{ color: "gray", fontSize: 12, marginBottom: 3 }}>{formatTime(start, end)} </Text>;
      }
    }
  }

  renderLocation(location) {
    if (undefined != location && location.length > 0) {
      return (
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardLocation}>
          {location}
        </Text>
      );
    }
  }

  renderDate(date_start) {
    if (undefined != date_start && date_start.length > 0) {
      return <Text style={{ color: "gray", fontSize: 12, marginBottom: 3 }}>{formatMonth(date_start)}</Text>;
    }
  }

  isURL(str) {
    if (!str) return false;
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return pattern.test(str);
  }

  renderExcerptImage(excerpt, uri) { }
  render() {
    const summary = getLanguageString(
      this.props.language,
      this.props.item,

      "summary"
    );
    const showIconChat = this.props.item.showIconChat === false ? false : true;
    const uri = this.props.item.photo1;
    const card = this.props.card === false ? false : true;
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
    };

    const excerpt = this.props.item.excerpt;

    return (
      <View style={card && [styles.card, this.props.cardStyle]}>
        <View
          style={{
            flexDirection: "row",
            paddingRight: 4,
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0.1,
            borderBottomColor: "lightgray",
            marginTop: 5
          }}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => this.props.navigation.navigate("story", this.props.item)}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {this.icon(this.props.item.source, this.props.item.number)}

              <View>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardTitle}>
                  {summary}
                </Text>
                {this.renderLocation(this.props.item.location)}

                {this.renderDate(this.props.item.date_start)}
                {this.renderTime(
                  this.props.item.time_start_pretty,
                  this.props.item.time_end_pretty,
                  this.props.item.source
                )}
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}>
              {showIconChat && <SimpleLineIcons name="bubble" size={25} color="black" style={{ marginRight: 8 }} />}

              <Ionicons name="ios-more" size={25} color="black" style={{ marginRight: 8 }} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate("story", this.props.item)}>
          <View style={{ flexDirection: "column" }}>
            {excerpt ? (
              <Text
                ellipsizeMode="clip"
                style={{
                  fontSize: 14,
                  color: "#262626",
                  paddingVertical: 12,
                  paddingHorizontal: 8
                }}>
                {excerpt}
              </Text>
            ) : null}
            {this.isURL(uri) && <Image style={{ height: 200, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} {...{ preview, uri }} />}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ListItem;
