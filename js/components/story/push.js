import React, { Component } from "react";
import { StyleSheet, View, Image, Dimensions, Alert, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { Container, Content } from "native-base";
import styles from "./styles";
import SettingsList from "react-native-settings-list";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import * as firebase from "firebase";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import _ from "lodash";
import Constants from "expo-constants";

@withMappedNavigationParams()
class push extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialText: "",
      _key: props._key,
    };

    this.pushSend = this.pushSend.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Entypo name="chevron-left" style={styles.chatHeadingLeft} />
      </TouchableOpacity>
    ),

    headerTitle: <Text style={{ fontSize: 17, fontWeight: "600" }}>{I18n.t("message")}</Text>,
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.pushSend();
        }}
      >
        <Text style={styles.chatHeading}>{I18n.t("send")}</Text>
      </TouchableOpacity>
    ),
  });

  componentWillMount() {
    var initialText = this.props.summary;

    if (_.isString(this.props.description)) {
      initialText = initialText + "\n\n" + this.props.description;
    }

    var initialDate = this.state.start_date;

    this.setState({ initialText: initialText });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      pushSend: this.pushSend,
    });
  }

  pushSend() {
    var grades = this._getGrade();

    var pushMessage = {
      from: "App",
      text: this.state.initialText,
      grade: grades,
      image: "",
      state: "pending",
      timestamp: Date.now(),
    };

    console.log("push =", pushMessage);

    var storyRef = firebase
      .firestore()
      .collection(Constants.manifest.extra.instance)
      .doc("push")
      .collection("message")
      .add(pushMessage);

    Alert.alert("Push message sent");

    // const { goBack } = this.props.navigation;
    // goBack(null);
  }

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
    this.setState({ [grade]: !this.state[grade] });
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
      <Container style={{ backgroundColor: "#fff" }}>
        <Content showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <TextInput
                onChangeText={text => this.setState({ initialText: text })}
                placeholder={"Description"}
                multiline
                style={[styles.eventText]}
                value={this.state.initialText}
              />
            </View>

            <View>
              <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
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
        </Content>
      </Container>
    );
  }
}

export default push;
