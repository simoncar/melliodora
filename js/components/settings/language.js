"use strict";
import React, { Component } from "react";

import { AppRegistry, StyleSheet, Text, View, Image, Alert, TouchableOpacity } from "react-native";
import SettingsList from "react-native-settings-list";
import * as Localization from "expo-localization";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";

export default class selectLanguage extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      switchValue: false,
      loggedIn: false,
      language: "",
    };
  }

  componentWillMount() {
    this._retrieveLanguage();
  }
  _retrieveLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem("language");
      if (value !== null) {
        // We have data!!
        console.log(value);
        this.setState({ language: value });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _changeLanguage(language) {
    this.state.language = "ja";
    this.setState({ language: language });
    global.language = language;
    AsyncStorage.setItem("language", language);

    const { goBack } = this.props.navigation;

    goBack(null);
    setTimeout(() => {
      goBack(null);
    }, 100);
  }
  _getStyle(language) {
    if (language == this.state.language) {
      return styles.imageStyleCheckOn;
    } else {
      return styles.imageStyleCheckOff;
    }
  }

  render() {
    var bgColor = "#DCE3F4";
    return (
      <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
        <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
          <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
            <SettingsList.Header headerStyle={{ marginTop: 15 }} />

            <SettingsList.Item
              hasSwitch={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title="English"
              onPress={() => this._changeLanguage("en")}
              icon={<MaterialCommunityIcons name="check" style={this._getStyle("en")} />}
            />
            <SettingsList.Item
              hasSwitch={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title="中文(简体)"
              onPress={() => this._changeLanguage("zhcn")}
              icon={<MaterialCommunityIcons name="check" style={this._getStyle("zhcn")} />}
            />
            <SettingsList.Item
              hasSwitch={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title="日本語"
              onPress={() => this._changeLanguage("ja")}
              icon={<MaterialCommunityIcons name="check" style={this._getStyle("ja")} />}
            />

            <SettingsList.Item
              hasSwitch={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title="Français"
              onPress={() => this._changeLanguage("fr")}
              icon={<MaterialCommunityIcons name="check" style={this._getStyle("fr")} />}
            />

            <SettingsList.Item
              hasSwitch={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title="한국어"
              onPress={() => this._changeLanguage("ko")}
              icon={<MaterialCommunityIcons name="check" style={this._getStyle("ko")} />}
            />

            <SettingsList.Item
              hasSwitch={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title="Español"
              onPress={() => this._changeLanguage("es")}
              icon={<MaterialCommunityIcons name="check" style={this._getStyle("es")} />}
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
