import React, { Component } from "react";
import { StyleSheet, View, Image, Dimensions, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { connect } from "react-redux";
import { Container, Content } from "native-base";
import styles from "./styles";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import * as firebase from "firebase";
import DatePicker from "react-native-datepicker";
import { Entypo } from "@expo/vector-icons";
import I18n from "../../lib/i18n";

@withMappedNavigationParams()
class newStory extends Component {
  uid = "";
  storyRef = null;

  constructor(props) {
    super(props);

    this.state = {
      notifyMeSwitch: false,
      visible: props.edit ? props.visible : false,
      eventTitle: props.edit ? props.eventTitle : "",
      eventDescription: props.edit ? props.eventDescription : "",
      location: props.edit && props.location !== undefined ? props.location : null,
      photo1: props.edit && props.photo1 !== undefined ? props.photo1 : null,
      eventDate: props.eventDate,
      eventStartTime: props.eventStartTime,
      eventEndTime: props.eventEndTime,
      _key: props.edit ? props._key : "",
    };

    this.generateID = this.generateID.bind(this);
    this.addStory = this.addStory.bind(this);
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

    headerTitle: <Text style={{ fontSize: 17, fontWeight: "600" }}>{I18n.t("edit")}</Text>,
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.addStory();
        }}
      >
        <Text style={styles.chatHeading}>{I18n.t("save")}</Text>
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    this.props.navigation.setParams({
      addStory: this.addStory,
    });
  }

  generateID() {
    let d = new Date().getTime();
    let id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(5);
    });

    return id;
  }

  setUid(value) {
    this.uid = value;
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  clearDates() {
    this.setState({ eventDate: null });
    this.setState({ eventStartTime: null });
    this.setState({ eventEndTime: null });
  }

  addStory() {
    var storyDict = {
      summary: this.state.eventTitle,
      visible: this.state.visible,
      description: this.state.eventDescription,
      location: this.state.location,
      photo1: this.state.photo1,
      date_start: this.state.eventDate !== undefined ? this.state.eventDate : null,
      time_start_pretty: this.state.eventStartTime !== undefined ? this.state.eventStartTime : null,
      time_end_pretty: this.state.eventEndTime !== undefined ? this.state.eventEndTime : null,
    };

    var storyRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("feature")
      .collection("feature articles")
      .doc(this.state._key);

    storyRef.set(storyDict);

    const { goBack } = this.props.navigation;

    goBack(null);
    setTimeout(() => {
      goBack(null);
    }, 100);
  }

  render() {
    const { goBack } = this.props.navigation;

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
              <View style={styles.switchContainer}>
                <Text>Visible</Text>
                <Switch
                  onValueChange={value => this.setState({ visible: value })}
                  style={styles.switch}
                  value={this.state.visible}
                />
              </View>

              <TextInput
                onChangeText={text => this.setState({ eventTitle: text })}
                placeholder={"Title"}
                autoFocus
                style={[styles.eventTitle]}
                value={this.state.eventTitle}
              />

              <TextInput
                onChangeText={text => this.setState({ eventDescription: text })}
                placeholder={"Description"}
                multiline
                style={[styles.eventText]}
                value={this.state.eventDescription}
              />

              <TextInput
                onChangeText={text => this.setState({ photo1: text })}
                placeholder={"Photo 1 URL"}
                style={[styles.photoURL]}
                value={this.state.photo1}
              />

              <Text>Dates (optional)</Text>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.eventDate}
                mode="date"
                placeholder="Event Date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => {
                  this.setState({ eventDate: date });
                }}
              />

              <Text>Time (optional)</Text>

              <DatePicker
                style={{ width: 200 }}
                date={this.state.eventStartTime}
                placeholder="Start Time"
                mode="time"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minuteInterval={10}
                onDateChange={time => {
                  this.setState({ eventStartTime: time });
                }}
              />

              <DatePicker
                style={{ width: 200 }}
                date={this.state.eventEndTime}
                placeholder="End Time"
                mode="time"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minuteInterval={10}
                onDateChange={time => {
                  this.setState({ eventEndTime: time });
                }}
              />
              <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.clearDates()}>
                <Text>Clear Dates</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

//Connect everything
export default connect(null)(newStory);
