import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import { Feather } from "@expo/vector-icons";
export default class SettingsListItem extends Component {
  render() {
    const { icon, onPress, title, titleInfoStyle, titleInfo, hasNavArrow = true } = this.props;
    return (
      <TouchableHighlight onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 8,
            alignItems: "center",
            borderBottomColor: "#CED0CE",
            borderBottomWidth: 1
          }}>
          {icon}
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 8 }}>
            <View>
              <Text style={[titleInfoStyle, { color: "black" }]}>{title || ""}</Text>
            </View>

            <View>
              <Text style={[titleInfoStyle, { color: "grey" }]}>{titleInfo || ""}</Text>
            </View>
          </View>

          <View style={{ marginHorizontal: 8 }}>{hasNavArrow && <Feather name="chevron-right" size={22} color="grey" />}</View>
        </View>
      </TouchableHighlight>
    );
  }
};

export const Separator = class Separator extends Component {
  render() {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
          marginTop: 30
        }}
      />
    );
  }
};
