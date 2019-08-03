import React, { Component } from "react";
import { StyleSheet, View, Image, Dimensions, Alert, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { Container, Content } from "native-base";
import styles from "./styles";
import SettingsList from "react-native-settings-list";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import * as firebase from "firebase";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";

@withMappedNavigationParams()
class push extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventTitle: props.eventTitle,
      eventDescription: props.eventDescription,
      eventDate: props.eventDate,
      eventStartTime: props.eventStartTime,
      eventEndTime: props.eventEndTime,
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
    var initialText = this.state.eventTitle + "\n\n" + this.state.eventDescription;
    var initialDate = this.state.eventDate;

    this.setState({ initialText: initialText });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      pushSend: this.pushSend,
    });
  }

  pushSend() {
    var pushMessage = {
      from: "App",
      text: this.state.initialText,
      grade: [8, 10, 12],
      image: "",
      state: "pending",
      timestamp: Date.now(),
    };

    var storyRef = firebase
      .firestore()
      .collection("sais_edu_sg")
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
                <SettingsList.Item
                  hasSwitch={true}
                  switchState={this.state.switchValue}
                  switchOnValueChange={this.onValueChange}
                  hasNavArrow={false}
                  title="Pre-Nursery"
                  onPress={() => this._changeLanguage("en")}
                  icon={<MaterialIcons name="people" style={styles.imageStyleCheckOn} />}
                />
                <SettingsList.Item
                  hasSwitch={true}
                  switchState={this.state.switchValue}
                  switchOnValueChange={this.onValueChange}
                  hasNavArrow={false}
                  title="Nursery"
                  onPress={() => this._changeLanguage("en")}
                  icon={<MaterialIcons name="people" style={styles.imageStyleCheckOn} />}
                />
              </SettingsList>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default push;
