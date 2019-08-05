import React, { Component } from "react";

import { Image, StyleSheet, View, Alert, AsyncStorage } from "react-native";
import SettingsList from "react-native-settings-list";
import { isAdmin } from "../global";
import I18n from "../../lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";

class Settings extends Component {
  static navigationOptions = {
    title: I18n.t("more"),

    headerBackTitle: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      language: "",
    };
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
      .collection("sais_edu_sg")
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

  render() {
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

            {this.gradeSelector("Pre-Nursery", "Early Years", -4)}
            {this.gradeSelector("Nursery", "Early Years", -3)}
            {this.gradeSelector("Pre-K", "Early Years", -2)}
            {this.gradeSelector("Kindergarten 1", "Early Years", -1)}
            {this.gradeSelector("Kindergarten 2", "Lower Elem", 0)}
            {this.gradeSelector("Grade 1", "Lower Elem", 1)}
            {this.gradeSelector("Grade 2", "Lower Elem", 2)}
            {this.gradeSelector("Grade 3", "Upper Elem", 3)}
            {this.gradeSelector("Grade 4", "Upper Elem", 4)}
            {this.gradeSelector("Grade 5", "Upper Elem", 5)}
            {this.gradeSelector("Grade 6", "Middle School", 6)}
            {this.gradeSelector("Grade 7", "Middle School", 7)}
            {this.gradeSelector("Grade 8", "Middle School", 8)}
            {this.gradeSelector("Grade 9", "High School", 9)}
            {this.gradeSelector("Grade 10", "High School", 10)}
            {this.gradeSelector("Grade 11", "High School", 11)}
            {this.gradeSelector("Grade 12", "High School", 12)}
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
