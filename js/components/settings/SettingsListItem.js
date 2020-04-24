import React, { Component } from "react";
import { View, TouchableHighlight } from "react-native";
import { Text } from "native-base";
import { Feather } from "@expo/vector-icons";
export const SettingsListItem = class SettingsListItem extends Component {
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
            borderBottomWidth: 1,
          }}>
          {icon}
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 8 }}>
            <View>
              <Text style={[titleInfoStyle, { color: "#333333" }]}>{title || ""}</Text>
            </View>

            <View>
              <Text style={[titleInfoStyle, { color: "#777777" }]}>{titleInfo || ""}</Text>
            </View>
          </View>

          <View style={{ marginHorizontal: 8 }}>{hasNavArrow && <Feather name="chevron-right" size={22} color="#777777" />}</View>
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
          marginTop: 30,
        }}
      />
    );
  }
};
