import React, { Component } from "react";
import { Image, StyleSheet, View, Alert, AsyncStorage } from "react-native";
import SettingsList from "react-native-settings-list";
import { isAdmin } from "../global";
import I18n from "../../lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Updates } from "expo";
import FeatureMoreItems from "./FeatureMoreItems";
import Constants from "expo-constants";

const icons = {
  wifi: require("./images/wifi.png"),
  contact: require("./images/contact.png"),
  library: require("./images/library.png"),
  map: require("./images/map.png"),
  shop: require("./images/shop.png")
};

class Settings extends Component {
  static navigationOptions = {
    title: I18n.t("more"),
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 28,
    },
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      language: ""
    };

    this.features = global.moreFeatures || [];
  }

  componentWillMount() {
    this._retrieveLanguage();
    this._retrieveGradeSelectors();
  }

  componentDidMount() {
    console.log(this.state);
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

  _retrieveGradeSelectors = async () => {
    var value = await AsyncStorage.getItem("gradeNotify");
    value = JSON.parse(value) || [];
    var arrayLength = value.length;
    for (var i = 0; i < arrayLength; i++) {
      console.log(value[i]);
      this.setState({ [value[i]]: true });
    }
  };

  _getStyle(language) {
    if (language == this.state.language) {
      return styles.imageStyleCheckOn;
    } else {
      return styles.imageStyleCheckOff;
    }
  }

  gradeSelector(title, level, grade) {
    return (
      <SettingsList.Item
        hasSwitch={true}
        switchState={this.state[grade]}
        switchOnValueChange={() => this._setGrade(grade)}
        title={title}
        titleInfo={level}
        hasNavArrow={false}
        icon={<MaterialIcons name="people" style={styles.imageStyleCheckOn} />}
      />
    );
  }

  _setGrade(grade) {
    console.log(grade);
    this.state[grade] = !this.state[grade];
    this.setState({ [grade]: this.state[grade] });

    var grades = this._getGrade();

    AsyncStorage.setItem("gradeNotify", JSON.stringify(grades));

    var userDict = {
      gradeNotify: grades,
    };

    firebase
      .firestore()
      .collection(global.domain)
      .doc("user")
      .collection("usernames")
      .doc(uid)
      .set(userDict, { merge: true });
  }

  _getGrade() {
    var grades = [];
    for (var i = -4; i < 13; i++) {
      console.log("loop=", i, this.state[i]);
      if (this.state[i] == true) {
        grades.push(i);
      }
    }
    return grades;
  }

  _logout() {

    AsyncStorage.clear().then(() => {
      global = {};

      Alert.alert("Restarting");
      Updates.reloadFromCache();
    });

  }

  render() {
    var languageTitle = "Language";
    if (I18n.t("language") != "Language") {
      languageTitle = "Language " + I18n.t("language");
    }

    return (
      <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
        <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
          <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
            <FeatureMoreItems navigation={this.props.navigation} />
            <SettingsList.Header headerStyle={{ marginTop: 15 }} />

            {

              this.features.filter(item => item.visible !== false)
                .map(el => {

                  const navTitle = el.navTitle || el.title;
                  const navProps = el.navURL ? {
                    url: el.navURL,
                    title: I18n.t(navTitle, { defaultValue: navTitle }),
                  } : {};

                  const imgSource = el.icon ? icons[el.icon] : icons["wifi"];
                  return (
                    <SettingsList.Item
                      icon={<Image style={styles.imageStyle} source={imgSource} />}
                      title={I18n.t(el.title || "", { defaultValue: el.title || "" })}
                      titleInfo={el.titleInfo || ""}
                      titleInfoStyle={styles.titleInfoStyle}
                      onPress={() =>
                        this.props.navigation.navigate(el.navigate || "webportalURL", navProps)
                      }
                    />
                  );
                }

                )
            }

            <SettingsList.Header headerStyle={{ marginTop: 15 }} />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/general.png")} />}
              title={languageTitle}
              titleInfo={this.state.language}
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() => this.props.navigation.navigate("selectLanguage")}
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={require("./images/airplane.png")} />}
              hasNavArrow={true}
              title={I18n.t("adminAccess")}
              onPress={() => this.props.navigation.navigate("adminPassword")}
            />
            {isAdmin(this.props.adminPassword) && <SettingsList.Header headerStyle={{ marginTop: 15 }} />}

            {isAdmin(this.props.adminPassword) && (
              <SettingsList.Item
                icon={<Image style={styles.imageStyle} source={require("./images/memory.png")} />}
                title={I18n.t("logs")}
                onPress={() => this.props.navigation.navigate("logs")}
              />
            )}

            <SettingsList.Header headerStyle={{ marginTop: 15 }} />
            <SettingsList.Item
              hasNavArrow={false}
              icon={<Image style={styles.imageStyle} source={require("./images/about.png")} />}
              title={"About this App"}
              onPress={() => {
                this.props.navigation.navigate("webportalURL", {
                  url: "https://www.smartcookies.io/stamford-app-faqs",
                  title: "About this App",
                });
              }}
            />
            <SettingsList.Item
              hasNavArrow={false}
              icon={<Image style={styles.imageStyle} source={require("./images/dnd.png")} />}
              title={I18n.t("logout")}
              onPress={() => this._logout()}
            />
          </SettingsList>
        </View>
      </View>
    );
  }
  toggleAuthView() {
    this.setState({ toggleAuthView: !this.state.toggleAuthView });
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
