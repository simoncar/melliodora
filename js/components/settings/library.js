"use strict";
import React, { Component } from "react";

import { StyleSheet, View, Image } from "react-native";
import SettingsList from "react-native-settings-list";
import * as Localization from "expo-localization";

export default class Library extends Component {
  static navigationOptions = {
    title: "Library",
    headerBackTitle: null,
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
              icon={<Image style={styles.imageStyle} source={require("./images/wifi.png")} />}
              title="Catalogue"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://sais.follettdestiny.com/common/welcome.jsp?context=saas18_8400395",
                  title: "Library",
                })
              }
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/wifi.png")} />}
              title="myStamford Library"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url:
                    "https://mystamford.edu.sg/login/login.aspx?prelogin=https%3a%2f%2fmystamford.edu.sg%2flibrary&kr=iSAMS:ParentPP",
                  title: "Library",
                })
              }
            />

            <SettingsList.Header headerStyle={{ marginTop: 15 }} />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/hotspot.png")} />}
              title="Pebble Go"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.pebblego.com/choose",
                  title: "Pebble Go",
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/display.png")} />}
              title="Tuble Books"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url: "http://www.tumblebooks.com/library/auto_login.asp?U=saiss&P=books",
                  title: "Tubble Books",
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/display.png")} />}
              title="1000 eBooks"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url:
                    "https://sais.follettdestiny.com/cataloging/servlet/presentbooklistform.do?listID=10728306&context=saas18_8400395&site=100",
                  title: "1000 eBooks",
                })
              }
            />

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/display.png")} />}
              title="Gale Reference LIbrary"
              titleInfo=""
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() =>
                this.props.navigation.navigate("webportalURL", {
                  url:
                    "http://galeapps.galegroup.com/apps/auth/sgsais?cause=http%3A%2F%2Ffind.galegroup.com%2Fmenu%2Fstart%3FuserGroupName%3Dsgsais%26prod%3DGVRL%26finalAuth%3Dtrue",
                  title: "password = book",
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
    width: 30,
    fontSize: 30,
    color: "#FFF",
  },

  titleInfoStyle: {
    fontSize: 16,
    color: "#8e8e93",
  },
});
