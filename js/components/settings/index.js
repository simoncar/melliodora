import React, { Component } from "react";
import { Image, StyleSheet, View, Alert, AsyncStorage, TouchableHighlight, ScrollView, Text, TouchableOpacity } from "react-native";
import { isAdmin } from "../global";
import I18n from "../../lib/i18n";
import { MaterialIcons, FontAwesome, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Updates } from "expo";
import FeatureMoreItems from "./FeatureMoreItems";
import { SettingsListItem, Separator } from "./SettingsListItem";
import Analytics from "../../lib/analytics";
import _ from "lodash";
import { actionRetrieveFeatures } from "../../store/settings";
import { connect } from 'react-redux';


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
    headerBackTitle: null
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this._retrieveGradeSelectors();

    this.willFocusSubscription = this.props.navigation.addListener("willFocus", () => {
    });

    // this.props.dispatch(actionRetrieveFeatures());
    Analytics.track("More");
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

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
    const user = this.props.auth.userInfo;
    if (_.has(user, "email") && user.email) {
      const email = user.email;
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("UserProfile", {
              uid: user.uid,
              permitEdit: true
            })
          }>
          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              {I18n.t("loggedInAs")}
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {email}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <SettingsListItem
          hasNavArrow={false}
          icon={<MaterialCommunityIcons name="account-plus" style={styles.imageStyleIcon} />}
          title={I18n.t("signIn") + "/" + I18n.t("signUp")}
          onPress={() => this.props.navigation.navigate("login")}
        />
      );
    }
  }

  separator(i) {
    if (i > 0) {
      console.log("separator = ", i);
      return <Separator />;
    }
  }

  render() {

    var i = 0;
    const features = this.props.settings.features ? this.props.settings.features : [];
    return (
      <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
        {(global.administrator || this.props.auth.isAdmin) && (
          <TouchableHighlight
            style={styles.adminButton}
            underlayColor="#ff7043"
            onPress={() =>
              this.props.navigation.navigate("moreAdmin", {
                moreFeatures: this.state.features
              })
            }>
            <MaterialIcons name="edit" style={{ fontSize: 25, color: "white" }} />
          </TouchableHighlight>
        )}

        {this._renderUser()}
        <SettingsListItem
          icon={<MaterialIcons name="search" style={styles.imageStyleIcon} />}
          title={I18n.t("searchUsers")}
          onPress={() => this.props.navigation.navigate("UserSearch")}
        />

        <FeatureMoreItems navigation={this.props.navigation} show="visibleMore" />

        {features
          .filter(item => item.visible !== false)
          .map((el, idx) => {
            i++;
            const navTitle = el.navTitle || el.title;
            const navProps = el.navURL
              ? {
                url: el.navURL,
                title: I18n.t(navTitle, { defaultValue: navTitle })
              }
              : {};

            const imgSource = el.icon ? icons[el.icon] : icons["wifi"];
            return (
              <SettingsListItem
                key={"feature" + idx}
                icon={<Image style={styles.imageStyle} source={imgSource} />}
                title={I18n.t(el.title || "", {
                  defaultValue: el.title || ""
                })}
                titleInfo={el.titleInfo || ""}
                onPress={() => this.props.navigation.navigate(el.navigate || "webportalURL", navProps)}
              />
            );
          })}

        {this.separator(i)}

        <SettingsListItem
          icon={<FontAwesome name="language" style={styles.imageStyleIcon} />}
          title={"Language"}
          titleInfo={this.props.auth.language}
          onPress={() => this.props.navigation.navigate("selectLanguage")}
        />
        <SettingsListItem
          icon={<FontAwesome name="lock" style={styles.imageStyleIcon} />}
          hasNavArrow={true}
          title={I18n.t("adminAccess")}
          onPress={() => this.props.navigation.navigate("adminPassword")}
        />

        {isAdmin(this.props.adminPassword) && (
          <SettingsListItem
            icon={<FontAwesome name="edit" style={styles.imageStyleIcon} />}
            title={I18n.t("editor")}
            onPress={() => this.props.navigation.navigate("Content")}
          />
        )}

        <SettingsListItem
          hasNavArrow={false}
          icon={<MaterialIcons name="info-outline" style={styles.imageStyleIcon} />}
          title={I18n.t("aboutThisApp")}
          onPress={() => {
            this.props.navigation.navigate("webportalURL", {
              url: "https://smartcookies.io/smart-community",
              title: I18n.t("aboutThisApp")
            });
          }}
        />
        <SettingsListItem
          hasNavArrow={false}
          icon={<SimpleLineIcons name="logout" style={styles.imageStyleIcon} />}
          title={I18n.t("logout")}
          onPress={() => this._logout()}
        />

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
    width: 30
  },
  imageStyleIcon: {
    marginLeft: 15,
    alignSelf: "center",
    width: 30,
    fontSize: 25,
    textAlign: "center"
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
    fontSize: 30,
    width: 30,
    color: "#FFF"
  },

  titleInfoStyle: {
    fontSize: 18,
    color: "#8e8e93"
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
      width: 0
    },
    zIndex: 1
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#ffffff80"
  },
  nameText: {
    fontWeight: "600",
    fontSize: 18
  },
  sectionContentText: {
    color: "#808080",
    fontSize: 14
  }
});

const mapStateToProps = state => ({
  settings: state.settings,
  auth: state.auth
});
export default connect(mapStateToProps)(Settings);
