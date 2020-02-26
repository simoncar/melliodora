import React from "react";
import * as firebase from "firebase";

import * as ImageManipulator from "expo-image-manipulator";
import Constants from "expo-constants";
import _ from "lodash";
import uuid from "uuid";
import { AsyncStorage } from "react-native";

export class Backend extends React.Component {
  uid = "";

  messageRef = null;

  constructor(props) {
    super(props);
    this.state = {
      chatroom: "",
      language: ""
    };
  }

  setUid(value) {
    this.uid = value;
  }

  aagetUid() {
    return this.uid;
  }

  setChatroom(chatroom, title) {
    this.state.chatroom = chatroom;
    this.state.title = title;
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
      case "id":
        return message.textID;
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
      .collection(global.domain)
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
          }
          callback({
            _id: message._id,

            text: mesageText,
            textEN: message.textEN,
            textFR: message.textFR,
            textJA: message.textJA,
            textKO: message.textKO,
            textZH: message.textZH,
            textES: message.textES,
            textID: message.textID,

            detectedSourceLanguage: message.detectedSourceLanguage,
            createdAt: new Date(message.timestamp),
            timestamp: new Date(message.timestamp),
            chatroom: this.state.chatroom,
            user: {
              _id: message.user._id,
              name: message.user.name,
              email: message.user.email
            },
            uid: message.uid,
            image: message.image,
            video: message.video,
            system: message.system,
            quickReplies: message.quickReplies
          });
        }
      });
    });
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  setUid(value) {
    this.uid = value;
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
          _id: message[i]._id,
          text: message[i].text,
          textLanguage: language,
          chatroom: this.state.chatroom,
          chatroomTitle: this.state.title ? this.state.title : this.state.chatroom,
          user: message[i].user,
          timestamp: Date.now(),
          system: false,
          pushToken: global.pushToken,
          uid: global.uid
        };

        console.log("messageDict", messageDict);

        this.messageRef = firebase
          .firestore()
          .collection(global.domain)
          .doc("chat")
          .collection("chatrooms")
          .doc(this.state.chatroom)
          .collection("messages")
          .add(messageDict);
      }
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
          name: global.name
        };
      } else {
        var messageDict = {
          pushToken: global.pushToken,
          timestamp: Date.now(),
          uid: global.uid,
          language: global.language,
          email: global.email,
          name: global.name
        };
      }

      firebase
        .firestore()
        .collection(global.domain)
        .doc("chat")
        .collection("chatrooms")
        .doc(this.state.chatroom)
        .collection("notifications")
        .doc(global.safeToken)
        .set(messageDict, { merge: true });
    }
  }

  closeChat() {
    console.log("Unsubscribe 1");
    if (this.unsubscribe) {
      console.log("Unsubscribe 2");
      this.unsubscribe();
      console.log("Unsubscribe 3");
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
    const convertedImage = await new ImageManipulator.manipulateAsync(message.image, [{ resize: { height: 1000 } }], {
      compress: 0
    });
    fileToUpload = convertedImage.uri;
    mime = "image/jpeg";
  } else {
    fileToUpload = message.image;
    mime = "video/mp4";
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
      _id: message._id,
      translated: true,
      image: URLfile,
      chatroom: chatroom,
      user: user,
      timestamp: Date.now(),
      system: false,
      pushToken: global.pushToken
    };
  } else {
    var messageDict = {
      _id: message._id,
      translated: true,
      video: URLfile,
      chatroom: chatroom,
      user: user,
      timestamp: Date.now(),
      system: false,
      pushToken: global.pushToken
    };
  }

  firebase
    .firestore()
    .collection(global.domain)
    .doc("chat")
    .collection("chatrooms")
    .doc(chatroom)
    .collection("messages")
    .add(messageDict);
  return;
}

export default new Backend();
