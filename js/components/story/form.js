import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StatusBar,
  SafeAreaView,
  Button,
  LayoutAnimation,
} from "react-native";
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
import * as Permissions from "expo-permissions";
import { createMaterialTopTabNavigator, MaterialTopTabBar } from "react-navigation-tabs";

@withMappedNavigationParams()
class PageText extends Component {
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

    this.getPermissionAsync();

    this.props.navigation.setParams({
      save: () => this.state
    });
  }


  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  setUid(value) {
    this.uid = value;
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  _drawImage(imageURI) {
    if (_.isNil(imageURI)) {
      var uri =
        "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2Fxdesk-calendar-980x470-20181016.jpg.pagespeed.ic.BdAsh-Nj_6.jpg?alt=media&token=697fef73-e77d-46de-83f5-a45540694274";
    } else {
      var uri = imageURI;
    }

    if (undefined !== uri && null !== uri && uri.length > 0) {
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

              <View
                style={{
                  paddingTop: 20,
                  flexDirection: "row",
                }}
              ></View>

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

class MaterialTopTabBarWrapper extends React.Component {
  render() {
    return (
      <SafeAreaView
        style={{ backgroundColor: "#000" }}
        forceInset={{ top: "always", horizontal: "never", bottom: "never" }}
      >
        <MaterialTopTabBar {...this.props} />
      </SafeAreaView>
    );
  }
}

@withMappedNavigationParams()
class PageSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifyMeSwitch: false,
      visible: props.edit ? props.visible : false,
      visibleMore: props.edit ? props.visibleMore : false,

      location: props.edit && props.location !== undefined ? props.location : null,

      eventDate: props.date_start,
      eventStartTime: props.time_start_pretty,
      eventEndTime: props.time_end_pretty,
      order: props.edit ? props.order : 1,
      _key: props.edit ? props._key : ""
    };

    //this.addStory = this.addStory.bind(this);

    //this.getPermissionAsync();

    this.props.navigation.setParams({
      save: () => this.state
    });
  }

  static navigationOptions = {
    tabBarLabel: "Settings",
    tabBarIcon: ({ tintColor, focused, horizontal }) => (
      <Ionicons name={focused ? "ios-people" : "ios-people"} size={horizontal ? 20 : 26} style={{ color: tintColor }} />
    ),
  };
  render() {
    const { navigation } = this.props;
    const summary = this.props.summary;
    const order = _.isNumber(this.state.order) ? this.state.order.toString() : 0;
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "always" }}>
        <Text>{summary}</Text>

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

        {/* <Button onPress={() => navigation.navigate("Home")} title="Go to home tab" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" /> */}
      </SafeAreaView>
    );
  }
}

const SimpleTabs = createMaterialTopTabNavigator(
  {
    pageText: PageText,
    pageSettings: PageSettings,
  },
  {
    tabBarComponent: MaterialTopTabBarWrapper,
    tabBarOptions: {
      style: {
        backgroundColor: "#000",
      },
    },
  },
);

class newStory extends React.Component {
  static router = SimpleTabs.router;

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: "Content",
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
          const { routes } = navigation.state;
          let saveState = {};


          if (_.has(routes[0], "params.save")) {
            const pageState = routes[0].params.save() || {};
            saveState = { ...saveState, ...pageState }
          }


          if (_.has(routes[1], "params.save")) {
            const pageState = routes[1].params.save() || {};
            saveState = { ...saveState, ...pageState }
          }

          const { eventTitle, visible, visibleMore, eventDescription, photo1, eventDate, eventStartTime, eventEndTime, order, _key } = saveState;

          const storyDict = {
            summary: eventTitle,
            visible: visible || false,
            visibleMore: visibleMore || false,
            description: eventDescription,
            photo1: photo1,
            date_start: eventDate !== undefined ? eventDate : null,
            time_start_pretty: eventStartTime !== undefined ? eventStartTime : null,
            time_end_pretty: eventEndTime !== undefined ? eventEndTime : null,
            order: order !== undefined ? Number(order) : 1,
          };

          if (_key == "") {
            firebase
              .firestore()
              .collection(global.domain)
              .doc("feature")
              .collection("features")
              .add(storyDict)
              .then(() =>
                navigation.goBack()
              );
          } else {
            const storyRef = firebase
              .firestore()
              .collection(global.domain)
              .doc("feature")
              .collection("features")
              .doc(_key);

            storyRef.set(storyDict, { merge: true })
              .then(() =>
                navigation.goBack()
              );
          }

        }}
      >
        <Text style={styles.chatHeading}>{I18n.t("save")}</Text>
      </TouchableOpacity>
    ),
  });

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <SimpleTabs navigation={navigation} />
      </View>
    );
  }
}

export default newStory;
