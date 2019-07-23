"use strict";
import React, { Component } from "react";

import { AppRegistry, StyleSheet, Text, View, Image, Alert, TouchableOpacity, AsyncStorage } from "react-native";
import SettingsList from "react-native-settings-list";
import * as Localization from "expo-localization";
import { isAdmin } from "../global";
import I18n from "../../lib/i18n";

class Settings extends Component {
  static navigationOptions = {
    title: I18n.t("more"),

    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.onValueChangeELV = this.onValueChangeELV.bind(this);
    this.onValueChangeELEM = this.onValueChangeELEM.bind(this);
    this.onValueChangeMS = this.onValueChangeMS.bind(this);
    this.onValueChangeHS = this.onValueChangeHS.bind(this);

    this.state = {
      switchValue: false,
      switchValueELV: false,
      switchValueELEM: false,
      switchValueMS: false,
      switchValueHS: false,
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
        this.setState({ language: value });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

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
              icon={<Image style={styles.imageStyle} source={require("./images/wifi.png")} />}
              title="myStamford"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url:
                    "https://mystamford.edu.sg/login/login.aspx?prelogin=http%3a%2f%2fmystamford.edu.sg%2f&kr=iSAMS:ParentPP",
                  title: "myStamford",
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/wifi.png")} />}
              title={I18n.t("athletics")}
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.stamfordlionsathletics.com/",
                  title: "Athletics",
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/wifi.png")} />}
              title="CCAs"
              titleInfo="After School"
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url:
                    "https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2fco-curricular-activities-cca-1%2fcca-brochure-semester-1&kr=iSAMS:ParentPP",
                  title: "CCAs",
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/wifi.png")} />}
              title="Camp Asia"
              titleInfo="Holidays"
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.campasia.asia",
                  title: "Camp Asia",
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/cellular.png")} />}
              title="Cafe Top Up"
              titleInfo="Balance $999.99"
              onPress={() => Alert.alert("This function is not active")}
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/hotspot.png")} />}
              title={I18n.t("contact")}
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() => {
                this.props.navigation.navigate("contact");
              }}
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/cellular.png")} />}
              title={I18n.t("shop")}
              titleInfo={I18n.t("pta")}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.saispta.com/",
                  title: I18n.t("shop"),
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/display.png")} />}
              title={I18n.t("map")}
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() => {
                this.props.navigation.navigate("campusMap");
              }}
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/display.png")} />}
              title={I18n.t("library")}
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() => {
                this.props.navigation.navigate("library");
              }}
            />

            <SettingsList.Header headerStyle={{ marginTop: 15 }} />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/general.png")} />}
              title={"Language " + I18n.t("language")}
              titleInfo={this.state.language}
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() => this.props.navigation.navigate("selectLanguage")}
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/airplane.png")} />}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={true}
              title={I18n.t("adminAccess")}
              onPress={() => this.props.navigation.navigate("adminPassword")}
            />
            {isAdmin(this.props.adminPassword) && <SettingsList.Header headerStyle={{ marginTop: 15 }} />}
            {isAdmin(this.props.adminPassword) && (
              <SettingsList.Item
                icon={<Image style={styles.imageStyle} source={require("./images/notifications.png")} />}
                title={I18n.t("safeguarding")}
                onPress={() => this.props.navigation.navigate("AttendanceOverviewScreen")}
              />
            )}

            {isAdmin(this.props.adminPassword) && (
              <SettingsList.Item
                icon={<Image style={styles.imageStyle} source={require("./images/memory.png")} />}
                title={I18n.t("logs")}
                onPress={() => this.props.navigation.navigate("logs")}
              />
            )}

            <SettingsList.Header headerStyle={{ marginTop: 15 }} />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/airplane.png")} />}
              hasSwitch={true}
              switchState={this.state.switchValueELV}
              switchOnValueChange={this.onValueChangeELV}
              title="ELV"
              hasNavArrow={false}
              onPress={() => Alert.alert("NA")}
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/airplane.png")} />}
              hasSwitch={true}
              switchState={this.state.switchValueELEM}
              switchOnValueChange={this.onValueChangeELEM}
              title="Elementary"
              titleInfo="KG2 - Grade 5"
              hasNavArrow={false}
              onPress={() => Alert.alert("NA")}
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/airplane.png")} />}
              hasSwitch={true}
              switchState={this.state.switchValueMS}
              switchOnValueChange={this.onValueChangeMS}
              title="Middle School"
              titleInfo="Grade 6 - 8"
              hasNavArrow={false}
              onPress={() => Alert.alert("NA")}
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/airplane.png")} />}
              hasSwitch={true}
              switchState={this.state.switchValueHS}
              switchOnValueChange={this.onValueChangeHS}
              title="High School"
              titleInfo="Grade 9 - 12"
              hasNavArrow={false}
              onPress={() => Alert.alert("NA")}
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
  onValueChangeELV(value) {
    this.setState({ switchValueELV: value });
  }
  onValueChangeELEM(value) {
    this.setState({ switchValueELEM: value });
  }
  onValueChangeMS(value) {
    this.setState({ switchValueMS: value });
  }
  onValueChangeHS(value) {
    this.setState({ switchValueHS: value });
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
    color: "#007AFF",
  },
  imageStyleCheckOff: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    fontSize: 30,
    width: 30,
    color: "#FFF",
  },

  titleInfoStyle: {
    fontSize: 16,
    color: "#8e8e93",
  },
});

module.exports = Settings;
