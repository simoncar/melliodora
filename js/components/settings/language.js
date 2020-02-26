import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import SettingsListItem from "../settings/SettingsListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Updates } from "expo";
import I18n from "../../lib/i18n";
import Analytics from "../../lib/analytics";

export default class selectLanguage extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      switchValue: false,
      loggedIn: false,
      language: ""
    };
  }

  static navigationOptions = {
    title: I18n.t("language"),
    headerBackTitle: null
  };

  componentDidMount() {
    this._retrieveLanguage();
    Analytics.track("Language");
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

  _changeLanguage(language) {
    this.setState({ language: language });
    AsyncStorage.setItem("language", language);
    global.language = language;

    Analytics.track("Language", { set: language });

    Updates.reloadFromCache();
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
          <SettingsListItem
            hasSwitch={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title="English"
            onPress={() => this._changeLanguage("en")}
            icon={<MaterialCommunityIcons name="check" style={this._getStyle("en")} />}
          />
          <SettingsListItem
            hasSwitch={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title="中文(简体)"
            onPress={() => this._changeLanguage("zh")}
            icon={<MaterialCommunityIcons name="check" style={this._getStyle("zh")} />}
          />
          <SettingsListItem
            hasSwitch={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title="日本語"
            onPress={() => this._changeLanguage("ja")}
            icon={<MaterialCommunityIcons name="check" style={this._getStyle("ja")} />}
          />

          <SettingsListItem
            hasSwitch={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title="Français"
            onPress={() => this._changeLanguage("fr")}
            icon={<MaterialCommunityIcons name="check" style={this._getStyle("fr")} />}
          />

          <SettingsListItem
            hasSwitch={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title="한국어"
            onPress={() => this._changeLanguage("ko")}
            icon={<MaterialCommunityIcons name="check" style={this._getStyle("ko")} />}
          />

          <SettingsListItem
            hasSwitch={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title="Español"
            onPress={() => this._changeLanguage("es")}
            icon={<MaterialCommunityIcons name="check" style={this._getStyle("es")} />}
          />

          <SettingsListItem
            hasSwitch={false}
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title="bahasa Indonesia"
            onPress={() => this._changeLanguage("id")}
            icon={<MaterialCommunityIcons name="check" style={this._getStyle("id")} />}
          />

          <Text style={styles.titleInfoStyle}>{I18n.t("languageChangeWarning")}</Text>
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
    color: "#007AFF"
  },
  imageStyleCheckOff: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
    fontSize: 30,
    color: "#FFF"
  },

  titleInfoStyle: {
    marginTop: 20,
    fontSize: 16,
    color: "#8e8e93",

    marginLeft: 10,
    alignSelf: "center"
  }
});
