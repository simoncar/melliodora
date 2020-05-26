import React, { Component } from "react";
import { View, ImageBackground, Text, TextInput, TouchableOpacity, Button, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert } from "react-native";
import { Input } from "react-native-elements";
import { Container, Content } from "native-base";
import styles from "./styles";
import * as firebase from "firebase";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "uuid";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import systemHero from "../../lib/systemHero";
import { connect } from "react-redux";
import { IconChat, OrderOnPage, ShowOnHomeScreen, ShowOnMoreScreen, EventDateTime } from "./formUtilities";
import { SaveFeature, DeleteFeature } from "./formAPI";
import { StackActions } from "@react-navigation/native";

class Form extends Component {
  uid = "";
  storyRef = null;

  constructor(props) {
    super(props);

    const { edit, _key, summary, description, photo1, visible, visibleMore, showIconChat, order } = this.props.route.params;

    this.state = {
      photo1: edit && photo1 !== undefined ? photo1 : null,
      summary: edit ? summary : "",
      description: edit ? description : "",
      visible: edit ? visible : true,
      visibleMore: edit ? visibleMore : true,
      showIconChat: edit ? showIconChat : true,
      order: edit ? order : 1,
      _key: edit ? _key : "",

      date_start: props.date_start,
      time_start_pretty: props.time_start_pretty,
      time_end_pretty: props.time_end_pretty,

      cameraIcon: "camera",
      showAdvanced: true,
      notifyMeSwitch: false,
    };
    this.handlerChat = this.handlerChat.bind(this);
    this.handlerOrder = this.handlerOrder.bind(this);
    this.handlerVisible = this.handlerVisible.bind(this);
    this.handlerVisibleMore = this.handlerVisibleMore.bind(this);
    this.handleEventDateTime = this.handleEventDateTime.bind(this);
  }

  handlerChat(show) {
    this.setState({ showIconChat: show });
  }

  handlerOrder(order) {
    this.setState({ order: order });
  }
  handlerVisible(visible) {
    this.setState({ visible: visible });
  }
  handlerVisibleMore(visible) {
    this.setState({ visibleMore: visible });
  }
  handleEventDateTime(dateTimeStart, dateTimeEnd) {
    console.log("HANDLER DATE:", dateTimeStart, dateTimeEnd);
    this.setState({ dateTimeStart: dateTimeStart, dateTimeEnd: dateTimeEnd });
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  save() {
    if (this.props.route.params.edit) {
      const refreshFunction = this.props.route.params.refreshFunction;
      refreshFunction(this.state);
    }

    SaveFeature(this.state);
    const popAction = StackActions.pop(2);
    this.props.navigation.dispatch(popAction);
  }

  deleteHandler(navigation) {
    const popAction = StackActions.pop(2);
    navigation.dispatch(popAction);
  }

  deleteButton() {
    const { _key, edit } = this.props.route.params;
    if (edit) {
      return (
        <TouchableOpacity
          style={styles.SubmitButtonStyle}
          activeOpacity={0.5}
          onPress={() => {
            Alert.alert(
              I18n.t("delete"),
              "Are you sure?",
              [
                {
                  text: I18n.t("cancel"),
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: I18n.t("delete"), onPress: () => DeleteFeature(_key, this.deleteHandler(this.props.navigation)) },
              ],
              { cancelable: false }
            );
          }}
        >
          <Text style={styles.TextStyle}>{I18n.t("delete")}</Text>
        </TouchableOpacity>
      );
    }
  }

  setUid(value) {
    this.uid = value;
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  set uid(uid) {}

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
          <ImageBackground style={styles.storyPhoto} source={{ uri: `${uri}` }}>
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
        .then((snapshot) => {
          return snapshot.ref.getDownloadURL(); // Will return a promise with the download link
        })
        .then((downloadURL) => {
          console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
          this.setState({ photo1: downloadURL });
          return downloadURL;
        })

        .catch((error) => {
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
    this.props.navigation.setOptions({
      headerRight: () => <Button onPress={() => this.save()} title={I18n.t("save")} />,
    });
    return (
      <Container style={{ backgroundColor: "#f2f2f2" }}>
        <Content showsVerticalScrollIndicator={true}>
          <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
            {this._drawImage(this.state.photo1)}

            <View>
              <View>
                <View style={{ flex: 1, paddingTop: 20, paddingLeft: 10, paddingRight: 10 }}>
                  <View style={styles.containerStyle}>
                    <IconChat handler={this.handlerChat} showIconChat={this.state.showIconChat} />
                    <ShowOnHomeScreen handler={this.handlerVisible} visible={this.state.visible} />
                    <ShowOnMoreScreen handler={this.handlerVisibleMore} visibleMore={this.state.visibleMore} />
                    <OrderOnPage handler={this.handlerOrder} order={this.state.order} />
                  </View>
                </View>
                <View style={{ flex: 1, paddingTop: 20, paddingLeft: 10, paddingRight: 10 }}>
                  <EventDateTime handler={this.handleEventDateTime} dateTimeStart={this.state.dateTimeStart} dateTimeEnd={this.state.dateTimeEnd} />
                </View>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 20, paddingLeft: 10, paddingRight: 10 }}>
              <Input
                onChangeText={(text) => this.setState({ summary: text })}
                placeholder="Title"
                autoFocus={true}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                containerStyle={styles.containerStyle}
                value={this.state.summary}
              />

              <View style={{ paddingTop: 20, flexDirection: "row" }}></View>

              <Input
                onChangeText={(text) => this.setState({ description: text })}
                placeholder="Description"
                multiline
                inputContainerStyle={{ borderBottomWidth: 0 }}
                containerStyle={styles.containerStyle}
                value={this.state.description}
              />
            </View>
            <View style={{ flexDirection: "column", alignItems: "center", marginTop: 12 }}>{this.deleteButton()}</View>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  community: state.community,
});
export default connect(mapStateToProps)(Form);
