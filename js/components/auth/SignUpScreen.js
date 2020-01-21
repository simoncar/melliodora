import React, { Component } from "react";
import { Text, TouchableOpacity, Linking, StyleSheet, View, TextInput, Button, Image, ScrollView } from "react-native";
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "uuid";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Input } from "react-native-elements";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
import 'firebase/functions';
import * as ImagePicker from 'expo-image-picker';

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
    displayName: "",
    firstName: "",
    lastName: "",
    errorMessage: null,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    disableSignUp: false
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
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
    try {
      this.setState({ disableSignUp: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(userCredential => {
          if (this.state.profilePic) {
            this.saveProfilePic(this.state.profilePic)
              .then(downloadURL => {
                userCredential.user.updateProfile({
                  photoURL: downloadURL,
                  displayName: this.state.displayName
                });

                console.log("userCredential.user.uid", userCredential.user.uid)
                const userDict = {
                  photoURL: downloadURL,
                  email: userCredential.user.email,
                  uid: userCredential.user.uid,
                  displayName: this.state.displayName,
                  firstName: this.state.firstName,
                  lastName: this.state.lastName
                }
                firebase
                  .firestore()
                  .collection(global.domain)
                  .doc("user")
                  .collection("registered")
                  .doc(userCredential.user.uid)
                  .set(userDict, { merge: true });
              })
              .catch(error => this.setState({ errorMessage: error.message, disableSignUp: false }));
          }
        })
        .then(() => {
          const setUserClaim = firebase.functions().httpsCallable('setUserClaim');
          setUserClaim({ email: this.state.email, domain: global.domain })
        })
        .then(result => console.log(result))
        .then(() => this.props.navigation.popToTop())
        .catch(error => this.setState({ errorMessage: error.message, disableSignUp: false }));

    } catch (error) {
      this.setState({
        errorMessage: error.message,
        disableSignUp: false
      })
    }
  };

  setProfilePic = ({ profilePic }) => {
    this.setState({ profilePic: profilePic });
  }

  async saveProfilePic(imgURI) {
    // const d = new Date();
    fileToUpload = imgURI;

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

    const snapshot = await ref.put(blob, { contentType: mime });
    const downloadURL = await snapshot.ref.getDownloadURL();

    blob.close();
    return downloadURL;

  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ profilePic: result.uri });
    }
  }

  _onOpenActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ['Take photo from camera', 'Select from gallery', 'Clear', 'Cancel'];
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
            this.props.navigation.push("CameraApp", {
              onGoBack: this.setProfilePic
            });
            break;
          case 1:
            this._pickImage();
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
        <ScrollView>
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
            <Text>Profile Picture: </Text>
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
          <Input
            placeholder="Display name"
            onChangeText={text => this.setState({ displayName: text })}
            value={this.state.displayName}
            containerStyle={styles.containerStyle}
            inputContainerStyle={{ borderBottomWidth: 0 }}
          />
          <Input
            placeholder="First name"
            onChangeText={text => this.setState({ firstName: text })}
            value={this.state.firstName}
            containerStyle={styles.containerStyle}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            autoCapitalize="words"
          />
          <Input
            placeholder="Last name"
            onChangeText={text => this.setState({ lastName: text })}
            value={this.state.lastName}
            containerStyle={styles.containerStyle}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            autoCapitalize="words"
          />
          <View style={{ flexDirection: "column", alignItems: "center", marginTop: 12 }}>
            <TouchableOpacity
              style={styles.SubmitButtonStyle}
              activeOpacity={0.5}
              onPress={this.handleSignUp}
              disabled={this.state.disableSignUp}>
              <Text style={styles.TextStyle}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
