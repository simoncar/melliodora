import React from "react";
import * as firebase from "firebase";

import * as ImageManipulator from "expo-image-manipulator";
import Constants from "expo-constants";
import _ from "lodash";
import uuid from "uuid";
import { AsyncStorage } from "react-native";

let instID = Constants.manifest.extra.instance;

export class Backend extends React.Component {
  uid = "";

  messagesRef = null;

  constructor(props) {
    super(props);
    this.state = {
      chatroom: "",
      language: "",
    };
  }

  setUid(value) {
    this.uid = value;
  }

  aagetUid() {
    return this.uid;
  }

  setChatroom(chatroom) {
    this.state.chatroom = chatroom.trim();
  }

  getLanguageMessage(message, language) {
    switch (language) {
      case "fr":
        return message.textFR;
        break;
      case "ko":
        return message.textKO;
        break;
      case "zh":
        return message.textZH;
        break;
      case "es":
        return message.textES;
        break;
      case "ja":
        return message.textJA;
        break;
      default:
        return message.textEN;
    }
  }

  _retrieveLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem("language");
      if (value !== null) {
        this.setState({ language: value });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  loadMessages = async (language1, callback) => {
    const language = await AsyncStorage.getItem("language");
    global.language = language;

    this.ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("chat")
      .collection("chatrooms")
      .doc(this.state.chatroom)
      .collection("messages")
      .orderBy("timestamp");

    this.unsubscribe = this.ref.onSnapshot(messages => {
      messages.docChanges().forEach(change => {
        if (change.type === "added") {
          const message = change.doc.data();
          if (message.textLanguage == language) {
            var mesageText = message.text;
            callback({
              _id: change.doc.id,
              text: mesageText,
              detectedSourceLanguage: message.detectedSourceLanguage,
              timestamp: new Date(message.timestamp),
              chatroom: this.state.chatroom,
              user: {
                _id: message.user._id,
                name: message.user.name,
              },
              uid: message.uid,
              image: message.image,
              video: message.video,
              system: message.system,
              quickReplies: message.quickReplies,
            });
          } else {
            var mesageText = this.getLanguageMessage(message, language);
          }
        }
      });
    });

    this.ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("chat")
      .collection("chatrooms")
      .doc(this.state.chatroom)
      .collection("messages")
      .orderBy("timestamp")
      .where("translated", "==", true);

    this.unsubscribe = this.ref.onSnapshot(messages => {
      messages.docChanges().forEach(change => {
        if (change.type === "added") {
          const message = change.doc.data();
          if (message.textLanguage == language) {
            var mesageText = message.text;
          } else {
            var mesageText = this.getLanguageMessage(message, language);
            callback({
              _id: change.doc.id,

              text: mesageText,
              textEN: message.textEN,
              textFR: message.textFR,
              textJA: message.textJA,
              textKO: message.textKO,
              textZH: message.textZH,
              textES: message.textES,

              detectedSourceLanguage: message.detectedSourceLanguage,
              timestamp: new Date(message.timestamp),
              chatroom: this.state.chatroom,
              user: {
                _id: message.user._id,
                name: message.user.name,
              },
              uid: message.uid,
              image: message.image,
              video: message.video,
              system: message.system,
              quickReplies: message.quickReplies,
            });
          }
        }
      });
    });
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  SendMessage(message) {
    if (undefined === global.pushToken) {
      global.pushToken = "";
    }
    if (!_.isString(language)) {
      language = "en";
    }

    for (let i = 0; i < message.length; i++) {
      if (undefined != message[i].image && message[i].image.length > 0) {
        var uploadUrl = uploadImageAsync(message[i], this.state.chatroom, message[i].user);
      } else {
        var messageDict = {
          text: message[i].text,
          textLanguage: language,
          chatroom: this.state.chatroom,
          user: message[i].user,
          timestamp: Date.now(),
          system: false,
          pushToken: global.pushToken,
          uid: global.uid,
        };

        this.messageRef = firebase
          .firestore()
          .collection("sais_edu_sg")
          .doc("chat")
          .collection("chatrooms")
          .doc(this.state.chatroom)
          .collection("messages")
          .add(messageDict);
      }
    }
    if (global.pushToken.length > 0) {
      this.messageRef = firebase
        .database()
        .ref(`instance/${instID}/chat/chatroom/${this.state.chatroom}/notifications/${global.safeToken}`);
      this.messageRef.update({
        //mute: false,
        pushToken: global.pushToken,
      });
    }
  }

  setMute(muteState) {
    if (_.isString(global.pushToken) && global.pushToken.length > 0) {
      if (_.isBoolean(muteState)) {
        var messageDict = {
          mute: muteState,
          pushToken: global.pushToken,
          timestamp: Date.now(),
          uid: global.uid,
          language: global.language,
          email: global.email,
          name: global.username,
        };
      } else {
        var messageDict = {
          pushToken: global.pushToken,
          timestamp: Date.now(),
          uid: global.uid,
          language: global.language,
          email: global.email,
          name: global.username,
        };
      }

      console.log(messageDict, this.state.chatroom, global.safeToken);

      firebase
        .firestore()
        .collection("sais_edu_sg")
        .doc("chat")
        .collection("chatrooms")
        .doc(this.state.chatroom)
        .collection("notifications")
        .doc(global.safeToken)
        .set(messageDict, { merge: true });
    }
  }

  setLanguage(language) {
    this.state.language = language;
    var userDict = {
      language: language,
    };

    firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("user")
      .collection("usernames")
      .doc(global.safeToken)
      .update(userDict);
  }

  closeChat() {
    if (this.messageRef) {
      this.messageRef.off();
    }
  }
}

async function uploadImageAsync(message, chatroom, user) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662

  var URLfile;
  var mime = "";
  var d = new Date();

  if (undefined == message.filename && message.playableDuration > 0) {
    message.filename = "image.MOV";
  } else if (undefined == message.filename && message.playableDuration == 0) {
    message.filename = "image.JPG";
  }

  var fileType = message.filename
    .split(".")
    .pop()
    .split(/\#|\?/)[0];
  var fileToUpload = "";
  console.log("fileType=", fileType);
  fileType = fileType.toUpperCase();
  if (fileType == "JPG" || fileType == "HEIC" || fileType == "PNG") {
    console.log("C");
    const convertedImage = await new ImageManipulator.manipulateAsync(message.image, [{ resize: { height: 1000 } }], {
      compress: 0,
    });
    fileToUpload = convertedImage.uri;
    mime = "image/jpeg";
    console.log("A");
  } else {
    fileToUpload = message.image;
    mime = "video/mp4";
    console.log("B");
  }

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", fileToUpload, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref("chatimage/" + chatroom + "/" + d.getUTCFullYear() + ("0" + (d.getMonth() + 1)).slice(-2))
    .child(uuid.v4());

  const snapshot = await ref
    .put(blob, { contentType: mime })
    .then(snapshot => {
      return snapshot.ref.getDownloadURL(); // Will return a promise with the download link
    })

    .then(downloadURL => {
      console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
      URLfile = downloadURL;
      return downloadURL;
    })

    .catch(error => {
      // Use to signal error if something goes wrong.
      console.log(`Failed to upload file and get link - ${error}`);
    });

  // We're done with the blob, close and release it
  blob.close();
  console.log("----------= file type - ", fileType);
  if (fileType == "JPG" || fileType == "HEIC" || fileType == "PNG") {
    var messageDict = {
      translated: true,
      image: URLfile,
      chatroom: chatroom,
      user: user,
      timestamp: Date.now(),
      system: false,
      pushToken: global.pushToken,
    };
  } else {
    var messageDict = {
      translated: true,
      video: URLfile,
      chatroom: chatroom,
      user: user,
      timestamp: Date.now(),
      system: false,
      pushToken: global.pushToken,
    };
  }
  firebase
    .firestore()
    .collection("sais_edu_sg")
    .doc("chat")
    .collection("chatrooms")
    .doc(chatroom)
    .collection("messages")
    .add(messageDict);
  return;
}

export default new Backend();
