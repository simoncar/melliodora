import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import firebase from "firebase";
import {
  MaterialIcons,
  Ionicons
} from "@expo/vector-icons";
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import _ from "lodash";
import uuid from "uuid";



class UserProfile extends Component {
  // state = {
  //   user: {}
  // }

  componentWillMount() {
    const { uid, user } = this.props.navigation.state.params;
    console.log("uid", uid);

    this.props.navigation.state.params._updateProfile = this._updateProfile;
    this.originData = { ...user };
    this.setState({ ...user, uid });
  }

  /**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
  difference = (object, base) => {
    function changes(object, base) {
      return _.transform(object, function (result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }

  _updateProfile = async () => {
    const diff = this.difference(this.state, this.originData);

    const user = firebase.auth().currentUser;

    if (user && user.uid === this.originData.uid && !_.isEmpty(diff)) {
      const updateProfileObj = {};
      if (diff.photoURL) {
        console.log("updating profile picture..");
        const downloadURL = await this.saveProfilePic(diff.photoURL);

        //set auth photo info
        updateProfileObj["photoURL"] = downloadURL;

        //set firestore photo info 
        diff["photoURL"] = downloadURL;
      }

      //update displayname
      if (diff.displayName) updateProfileObj["displayName"] = diff.displayName;

      //update auth user info
      if (!_.isEmpty(updateProfileObj)) user.updateProfile(updateProfileObj);

      //update firestore user info
      firebase
        .firestore()
        .collection(global.domain)
        .doc("user")
        .collection("registered")
        .doc(this.originData.uid)
        .set(diff, { merge: true });
    }


    this.props.navigation.popToTop();
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
      this.setState({ photoURL: result.uri });
    }
  }

  setProfilePic = ({ profilePic }) => {
    this.setState({ photoURL: profilePic });
  }

  _onOpenActionSheet = () => {
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

  _renderProfilePic = () => {
    const width = 180;
    const containerHeight = 200;
    const photoURL = this.state.photoURL;
    if (photoURL) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            Profile Picture:
          </Text>

          <TouchableOpacity style={{ width }} onPress={this._onOpenActionSheet}>
            <Image
              style={[
                {
                  marginTop: 20,
                  backgroundColor: "white",
                  width: width,
                  height: width,
                  borderRadius: width / 2,
                  borderWidth: 5,
                  borderColor: "lightgray"
                }
              ]}
              source={{ uri: photoURL }}
            />
          </TouchableOpacity>
        </View>
      )
    }

  }
  render() {
    return (
      <View>
        <View style={{ flexDirection: "column" }}>
          {this._renderProfilePic()}
          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              Display Name:
            </Text>
            <TextInput
              style={styles.sectionContentText}
              onChangeText={(text) => this.setState({ displayName: text })}
              value={this.state.displayName}
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              Email:
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {this.state.email}
            </Text>
          </View>

          <View style={[styles.titleContainer, { flexDirection: "row" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText} numberOfLines={1}>
                First Name:
              </Text>
              <TextInput
                style={styles.sectionContentText}
                onChangeText={(text) => this.setState({ firstName: text })}
                value={this.state.firstName}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.nameText} numberOfLines={1}>
                Last Name:
              </Text>
              <TextInput
                style={styles.sectionContentText}
                onChangeText={(text) => this.setState({ lastName: text })}
                value={this.state.lastName}
              />
            </View>
          </View>

        </View>

      </View>
    )
  }
}

const ConnectedApp = connectActionSheet(UserProfile);

export default class ActionSheetContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    // title: I18n.t("Edit", { defaultValue: "Edit" }),
    headerRight: () => {
      const permitEdit = navigation.state.params.permitEdit;

      if (!permitEdit) return;
      return (
        <TouchableOpacity
          onPress={() => navigation.state.params._updateProfile()}
        >
          <View
            style={{
              color: "#48484A",
              fontSize: 25,
              marginRight: 10,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "red" }}>Save </Text>
            <MaterialIcons
              name="done"
              style={{
                color: "red",
                fontSize: 25,
                marginRight: 10
              }}
            />
          </View>
        </TouchableOpacity>
      )
    }
  });

  render() {
    return (
      <ActionSheetProvider>
        <ConnectedApp navigation={this.props.navigation} />
      </ActionSheetProvider>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fdfdfd"
  },
  nameText: {
    fontWeight: "600",
    fontSize: 18,
    color: "black"
  },
  sectionContentText: {
    color: "#808080",
    fontSize: 14,
    height: 40, borderColor: 'gray', borderBottomWidth: 1, width: "80%"
  },
});
