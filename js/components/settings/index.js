import React, { Component } from "react";
import { Image, StyleSheet, View, Alert, AsyncStorage, TouchableHighlight, ScrollView, Text } from "react-native";
import { isAdmin } from "../global";
import I18n from "../../lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Updates } from "expo";
import FeatureMoreItems from "./FeatureMoreItems";
import Constants from "expo-constants";
import SettingsListItem from "./SettingsListItem";
import Analytics from "../../lib/analytics";

const icons = {
  wifi: require("./images/wifi.png"),
  contact: require("./images/contact.png"),
  library: require("./images/library.png"),
  map: require("./images/map.png"),
  shop: require("./images/shop.png"),
};

class Settings extends Component {
  static navigationOptions = {
    title: I18n.t("more"),
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      language: "",
      features: global.moreFeatures || [],
    };
  }

  componentWillMount() {
    this._retrieveLanguage();
    this._retrieveGradeSelectors();

    this.willFocusSubscription = this.props.navigation.addListener("willFocus", () => {
      this.setState({ features: global.moreFeatures || [] });
    });

    // firebase.auth().onAuthStateChanged(user => {
    //   if (user && !user.isAnonymous) {
    //     user.getIdTokenResult()
    //       .then((idTokenResult) => {
    //         console.log("claims", idTokenResult.claims)
    //         if (idTokenResult.claims[global.domain]) {
    //           this.setState({ user: user });
    //         }
    //       });
    //   }
    // });
  }

  componentDidMount() {
    Analytics.track("More");
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
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



  _logout() {
    AsyncStorage.clear().then(() => {
      global = {};
      Analytics.track("Logout");

      Alert.alert("Restarting");
      Updates.reloadFromCache();
    });
  }

  _renderUser() {
    // const user = this.state.user;
    // console.log("_renderUser", user);
    if (global.uid) {
      const email = global.uid;
      return (
        <SettingsListItem
          hasNavArrow={false}
          icon={<Image style={styles.imageStyle} source={require("./images/dnd.png")} />}
          title={email}
          onPress={() => this.props.navigation.navigate("login")}
        />
      )
    } else {
      return (
        <SettingsListItem
          hasNavArrow={false}
          icon={<Image style={styles.imageStyle} source={require("./images/dnd.png")} />}
          title={I18n.t("Sign In", { defaultValue: "Sign In" })}
          onPress={() => this.props.navigation.navigate("login")}
        />
      )
    }
  }

  render() {
    var languageTitle = "Language";
    if (I18n.t("language") != "Language") {
      languageTitle = "Language " + I18n.t("language");
    }

    return (
      <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
        {global.administrator && (
          <TouchableHighlight
            style={styles.adminButton}
            underlayColor="#ff7043"
            onPress={() => this.props.navigation.navigate("moreAdmin", { moreFeatures: this.state.features })}
          >
            <MaterialIcons name="edit" style={{ fontSize: 25, color: "white" }} />
          </TouchableHighlight>
        )}

        <ScrollView style={{ backgroundColor: "#EFEFF4" }}>
          {this._renderUser()}

          <FeatureMoreItems navigation={this.props.navigation} show="visibleMore" />

          <Seperator />
          {this.state.features
            .filter(item => item.visible !== false)
            .map((el, idx) => {
              const navTitle = el.navTitle || el.title;
              const navProps = el.navURL
                ? {
                  url: el.navURL,
                  title: I18n.t(navTitle, { defaultValue: navTitle }),
                }
                : {};

              const imgSource = el.icon ? icons[el.icon] : icons["wifi"];
              return (
                <SettingsListItem
                  key={"feature" + idx}
                  icon={<Image style={styles.imageStyle} source={imgSource} />}
                  title={I18n.t(el.title || "", { defaultValue: el.title || "" })}
                  titleInfo={el.titleInfo || ""}
                  titleInfoStyle={styles.titleInfoStyle}
                  onPress={() => this.props.navigation.navigate(el.navigate || "webportalURL", navProps)}
                />
              );
            })}

          <SettingsListItem
            icon={<Image style={styles.imageStyle} source={require("./images/general.png")} />}
            title={languageTitle}
            titleInfo={this.state.language}
            titleInfoStyle={styles.titleInfoStyle}
            onPress={() => this.props.navigation.navigate("selectLanguage")}
          />
          <SettingsListItem
            icon={<Image style={styles.imageStyle} source={require("./images/airplane.png")} />}
            hasNavArrow={true}
            title={I18n.t("adminAccess")}
            onPress={() => this.props.navigation.navigate("adminPassword")}
          />
          {isAdmin(this.props.adminPassword) && <Seperator />}

          {isAdmin(this.props.adminPassword) && (
            <SettingsListItem
              icon={<Image style={styles.imageStyle} source={require("./images/memory.png")} />}
              title={I18n.t("editor")}
              onPress={() => this.props.navigation.navigate("Content")}
            />
          )}

          <Seperator />

          <SettingsListItem
            hasNavArrow={false}
            icon={<Image style={styles.imageStyle} source={require("./images/about.png")} />}
            title={"About this App"}
            onPress={() => {
              this.props.navigation.navigate("webportalURL", {
                url: "https://smartcookies.io/smart-community",
                title: "About this App",
              });
            }}
          />
          <SettingsListItem
            hasNavArrow={false}
            icon={<Image style={styles.imageStyle} source={require("./images/dnd.png")} />}
            title={I18n.t("logout")}
            onPress={() => this._logout()}
          />
          <View style={{ marginTop: 30 }}></View>
        </ScrollView>
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
    fontSize: 18,
    color: "#8e8e93",
  },
  adminButton: {
    backgroundColor: "#ff5722",
    borderColor: "#ff5722",
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    zIndex: 1,
  },
});

class Seperator extends Component {
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
}

module.exports = Settings;
