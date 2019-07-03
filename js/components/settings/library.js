"use strict";
import React, { Component } from "react";

import { StyleSheet, View, Image } from "react-native";
import SettingsList from "react-native-settings-list";
import * as Localization from "expo-localization";

class Library extends Component {
  static navigationOptions = {
    title: "Library",
    headerBackTitle: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
        <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
          <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
            <SettingsList.Header headerStyle={{ marginTop: 15 }} />

            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require("./images/wifi.png")}
                />
              }
              title="Catalogue"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.library.org/",
                  title: "Library"
                })
              }
            />

            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require("./images/hotspot.png")}
                />
              }
              title="World News"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.library.org/",
                  title: "Library"
                })
              }
            />

            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require("./images/display.png")}
                />
              }
              title="Search Global Publications"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.library.org/",
                  title: "Library"
                })
              }
            />
          </SettingsList>
        </View>
      </View>
    );
  }
  toggleAuthView() {
    this.setState({ toggleAuthView: !this.state.toggleAuthView });
  }
  onValueChange(value) {
    this.setState({ switchValue: value });
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30
  },
  imageStyleCheckOn: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
    fontSize: 30,
    width: 30,
    color: "#007AFF"
  },
  imageStyleCheckOff: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
    fontSize: 30,
    width: 30,
    color: "#FFF"
  },

  titleInfoStyle: {
    fontSize: 16,
    color: "#8e8e93"
  }
});

module.exports = Library;
