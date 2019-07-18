import React, { Component } from "react";
import { Text, StyleSheet, Image, View, Alert, TouchableOpacity, TouchableHighlight } from "react-native";
import SettingsList from "react-native-settings-list";
import I18n from "../../lib/i18n";
import { withMappedNavigationParams } from "react-navigation-props-mapper";

@withMappedNavigationParams()
export default class AttendanceMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require("../settings/images/cellular.png")} />}
            title={I18n.t("gateways")}
            titleInfo="Online"
            onPress={() => this.props.navigation.navigate("beacon")}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require("../settings/images/control.png")} />}
            title={I18n.t("reports")}
            onPress={() => Alert.alert("Route To Reports")}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={require("../settings/images/dnd.png")} />}
            title={I18n.t("studentLookup")}
            onPress={() => this.props.navigation.navigate("BeaconSearch")}
          />
        </SettingsList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
  },
  imageStyleCheckOn: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
    fontSize: 30,
    width: 30,
    color: "#007AFF",
  },
  imageStyleCheckOff: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
    fontSize: 30,
    width: 30,
    color: "#FFF",
  },

  titleInfoStyle: {
    fontSize: 16,
    color: "#8e8e93",
  },
});
