import React, { Component } from "react";
import { Text, TouchableOpacity, Linking, StyleSheet, View, TextInput, Button, Image } from "react-native";
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "uuid";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Input } from "react-native-elements";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";

class SignUpScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Sign Up",
    headerBackTitle: null,
  });

  state = {
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
    errorMessage: null,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  checkConfirmPassword = text => {
    this.setState({ confirmPassword: text }, () => {
      if (this.state.confirmPassword !== this.state.password) {
        const errorMsg = "Password don't match";
        this.setState({ errorMessage: errorMsg });
      } else {
        this.setState({ errorMessage: "" });
      }
    });
  };

  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate("Overview"))
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  async snapPhoto() {
    var d = new Date();
    const options = { quality: 1, base64: true, fixOrientation: true, exif: true };
    await this.camera.takePictureAsync(options).then(async photo => {
      const convertedImage = await new ImageManipulator.manipulateAsync(photo.uri, [{ resize: { height: 600 } }], {
        compress: 0,
      });
      //photo.exif.Orientation = 1;
      fileToUpload = convertedImage.uri;

      console.log("fileToUpload", fileToUpload);

      mime = "image/jpeg";
      // this.setState({ cameraIcon: "hour-glass" });

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
        .ref("smartcommunity/profile")
        .child(uuid.v4());

      const recordInfo = this.props.navigation.state.params.recordInfo;
      const beaconExist = await checkBeaconExist(recordInfo.studentNo)
      if (!beaconExist) {
        //create record in beacon/beacons
        await createBeacon(recordInfo.studentNo, recordInfo);
      }

      const snapshot = await ref
        .put(blob, { contentType: mime })
        .then(snapshot => {
          return snapshot.ref.getDownloadURL(); // Will return a promise with the download link
        })
        .then(downloadURL => {
          console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
          this.setState({ profilePic: downloadURL });
        })
        .catch(error => {
          console.log(`Failed to upload file and get link - ${error}`);
        });

      blob.close();
    });

  }

  _onOpenActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ['Camera', 'Gallery', 'Clear', 'Cancel'];
    const destructiveButtonIndex = options.length - 2;
    const cancelButtonIndex = options.length - 1;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        switch (buttonIndex) {
          case 0:
            // this.snapPhoto();
            this.props.navigation.navigate("CameraApp");
            break;
        }
      },
    );
  };

  icon(source) {
    // const uri = source;
    // const preview = {
    //   uri:
    //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
    // };
    const width = 100;
    if (!source) {
      return (
        <Ionicons
          name="ios-person"
          size={width * 0.85}
          color="grey"
          style={{
            width: width,
            height: width,
            margin: 12,
            borderRadius: width / 2,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "lightgray",
            color: "#0075b7",
            textAlign: "center",
          }}
        />
      );
    } else {
      return (
        <Image
          style={{
            width: width,
            height: width,
            margin: 12,
            borderRadius: width / 2,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "lightgray",
            justifyContent: "center",
            alignItems: "center",
          }}
          source={{ uri: source }}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.errorMessage}</Text>
        <Input
          placeholder="Email Address"
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
          containerStyle={styles.containerStyle}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          autoCapitalize="none"
          keyboardType="email-address"
          autoFocus={true}
        />
        <Input
          placeholder="Password"
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          containerStyle={styles.containerStyle}
          secureTextEntry={true}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Input
          placeholder="Confirm Password"
          onChangeText={text => this.checkConfirmPassword(text)}
          value={this.state.confirmPassword}
          containerStyle={styles.containerStyle}
          secureTextEntry={true}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <View>
          <Text>Profile Picture</Text>
          <TouchableOpacity onPress={this._onOpenActionSheet}>
            {this.icon(this.state.profilePic)}
          </TouchableOpacity>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          ></Camera>
        </View>
        <View style={{ flexDirection: "column", alignItems: "center", marginTop: 12 }}>
          <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity={0.5} onPress={this.handleSignUp}>
            <Text style={styles.TextStyle}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.learnMore}
            onPress={() => {
              var url = "https://www.smartcookies.io/geofencing";
              Linking.canOpenURL(url)
                .then(supported => {
                  if (supported) {
                    return Linking.openURL(url);
                  }
                })
                .catch(err => {
                  console.error("An error occurred", err);
                });
            }}
          >
            <Text>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const ConnectedApp = connectActionSheet(SignUpScreen);

export default class ActionSheetContainer extends Component {
  render() {
    return (
      <ActionSheetProvider>
        <ConnectedApp navigation={this.props.navigation} />
      </ActionSheetProvider>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    padding: 10,
  },

  containerStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d2d2d2",
    backgroundColor: "#ffffff",
    marginVertical: 8,
  },

  learnMore: {},
  SubmitButtonStyle: {
    backgroundColor: "#fff",
    height: 50,
    width: 250,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 4,
    marginBottom: 30,
  },
});
