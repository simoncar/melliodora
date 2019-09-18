import React, { Component } from "react";
import { View, ImageBackground, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { Container, Content } from "native-base";
import styles from "./styles";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import * as firebase from "firebase";
import DatePicker from "react-native-datepicker";
import { Entypo } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "uuid";
import Constants from "expo-constants";

@withMappedNavigationParams()
class newStory extends Component {
  uid = "";
  storyRef = null;

  constructor(props) {
    super(props);

    this.state = {
      notifyMeSwitch: false,
      visible: props.edit ? props.visible : false,
      visibleMore: props.edit ? props.visibleMore : false,

      eventTitle: props.edit ? props.summary : "",
      eventDescription: props.edit ? props.description : "",
      location: props.edit && props.location !== undefined ? props.location : null,
      photo1: props.edit && props.photo1 !== undefined ? props.photo1 : null,
      eventDate: props.date_start,
      eventStartTime: props.time_start_pretty,
      eventEndTime: props.time_end_pretty,
      order: props.edit ? props.order : 1,
      _key: props.edit ? props._key : "",
      cameraIcon: "camera",
    };

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
      visibleMore: this.state.visibleMore,
      description: this.state.eventDescription,
      photo1: this.state.photo1,
      date_start: this.state.eventDate !== undefined ? this.state.eventDate : null,
      time_start_pretty: this.state.eventStartTime !== undefined ? this.state.eventStartTime : null,
      time_end_pretty: this.state.eventEndTime !== undefined ? this.state.eventEndTime : null,
      order: this.state.order !== undefined ? Number(this.state.order) : 1,
    };

    console.log(storyDict);

    if (this.state._key == "") {
      var storyRef = firebase
        .firestore()
        .collection(global.domain)
        .doc("feature")
        .collection("features")
        .add(storyDict);
    } else {
      var storyRef = firebase
        .firestore()
        .collection(global.domain)
        .doc("feature")
        .collection("features")
        .doc(this.state._key);

      storyRef.set(storyDict, { merge: true });
    }

    const { goBack } = this.props.navigation;

    goBack(null);
    setTimeout(() => {
      goBack(null);
    }, 100);
  }

  _drawImage(imageURI) {
    if (_.isNil(imageURI)) {
      var uri =
        "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2Fxdesk-calendar-980x470-20181016.jpg.pagespeed.ic.BdAsh-Nj_6.jpg?alt=media&token=697fef73-e77d-46de-83f5-a45540694274";
    } else {
      var uri = imageURI;
    }

    if (undefined !== uri && null !== uri && uri.length > 0) {
      console.log("imageURI=", imageURI);
      return (
        <View>
          <ImageBackground style={styles.storyPhoto} source={{ uri: `${this.state.photo1}` }}>
            <TouchableOpacity style={styles.photoButton} onPress={this._pickImage}>
              <View>
                <Entypo name={this.state.cameraIcon} style={{ fontSize: 25, color: "white" }} />
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      );
    }
  }

  _pickImage = async () => {
    var d = new Date();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      //this.setState({ image: result.uri });
      //this._images = images;

      const convertedImage = await new ImageManipulator.manipulateAsync(result.uri, [{ resize: { height: 1000 } }], {
        compress: 0,
      });

      fileToUpload = convertedImage.uri;
      mime = "image/jpeg";
      this.setState({ cameraIcon: "hour-glass" });
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", fileToUpload, true);
        xhr.send(null);
      });

      const ref = firebase
        .storage()
        .ref("random/" + d.getUTCFullYear() + ("0" + (d.getMonth() + 1)).slice(-2))
        .child(uuid.v4());

      const snapshot = await ref
        .put(blob, { contentType: mime })
        .then(snapshot => {
          return snapshot.ref.getDownloadURL(); // Will return a promise with the download link
        })
        .then(downloadURL => {
          console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
          this.setState({ photo1: downloadURL });
          return downloadURL;
        })

        .catch(error => {
          // Use to signal error if something goes wrong.
          console.log(`Failed to upload file and get link - ${error}`);
        });

      // We're done with the blob, close and release it
      blob.close();
      this.setState({ cameraIcon: "camera" });
    }
  };

  render() {
    const { goBack } = this.props.navigation;
    const order = _.isNumber(this.state.order) ? this.state.order.toString() : 0;
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Content showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {this._drawImage(this.state.photo1)}
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <TextInput
                onChangeText={text => this.setState({ eventTitle: text })}
                placeholder={"Title"}
                autoFocus
                style={[styles.eventTitle]}
                value={this.state.eventTitle}
              />

              <Text>Date (optional)</Text>
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

              <View
                style={{
                  paddingTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={styles.switchContainer}>
                  <Text style={styles.eventTitle}>Order: </Text>
                  <TextInput
                    onChangeText={text => this.setState({ order: text })}
                    placeholder={"0"}
                    style={styles.eventTitle}
                    value={order}
                    keyboardType="number-pad"
                  />
                  <Text style={styles.eventTitle}>Visibility: </Text>

                  <Text>Home Screen</Text>
                  <Switch
                    onValueChange={value => this.setState({ visible: value })}
                    style={styles.switch}
                    value={this.state.visible}
                  />
                  <Text>More Screen</Text>
                  <Switch
                    onValueChange={value => this.setState({ visibleMore: value })}
                    style={styles.switch}
                    value={this.state.visibleMore}
                  />
                </View>
              </View>

              <TextInput
                onChangeText={text => this.setState({ eventDescription: text })}
                placeholder={"Description"}
                multiline
                style={[styles.eventText]}
                value={this.state.eventDescription}
              />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

//Connect everything
export default newStory;
