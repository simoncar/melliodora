import React from "react";
import * as firebase from "firebase";
import { Constants, FileSystem, ImageManipulator } from "expo";
import uuid from "uuid";
import AssetUtils from "expo-asset-utils";
import shortid from "shortid";

let instID = Constants.manifest.extra.instance;

export class Backend extends React.Component {
  uid = "";

  messagesRef = null;

  constructor(props) {
    super();
    this.state = {
      chatroom: ""
    };
  }

  setUid(value) {
    this.uid = value;
  }

  aagetUid() {
    return this.uid;
  }

  setChatroom(chatroom) {
    console.log(`chatroom=${chatroom}`);
    this.state.chatroom = chatroom.trim();
  }

  // retrive msg from backend
  loadMessages(callback) {
    this.messageRef = firebase
      .database()
      .ref(`instance/${instID}/chat/chatroom/${this.state.chatroom}/messages`);
    this.messageRef.off();
    const onReceive = data => {
      const message = data.val();
      if (
        undefined !== message.user.avatar &&
        message.user.avatar !== null &&
        message.user.avatar.length > 0
      ) {
        callback({
          _id: data.key,
          text: message.text,
          createdAt: new Date(message.createdAt),
          chatroom: this.state.chatroom,
          user: {
            _id: message.user._id,
            name: message.user.name,
            avatar: message.user.avatar
          },
          image: message.image,
          messageType: "image"
          // location: {
          //  latitude: 48.864601,
          //  longitude: 2.398704
          // },
        });
      } else {
        callback({
          _id: data.key,
          text: message.text,
          createdAt: new Date(message.createdAt),
          chatroom: this.state.chatroom,
          user: {
            _id: message.user._id,
            name: message.user.name
          },
          image: message.image,
          video: message.video,
          messageType: "image"
          // location: {
          //  latitude: 48.864601,
          //  longitude: 2.398704
          // },
        });
      }
    };
    this.messageRef.limitToLast(50).on("child_added", onReceive);
  }

  // 1.
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  // 2.
  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  SendMessage(message) {
  

    if (undefined === global.pushToken) {
      global.pushToken = "";
    }

    this.messageRef = firebase
      .database()
      .ref(`instance/${instID}/chat/chatroom/${this.state.chatroom}/messages`);


      this.latestMessageRef = firebase
      .database()
      .ref(`instance/${instID}/chat/chatroom/${this.state.chatroom}`);


    for (let i = 0; i < message.length; i++) {
      if (undefined != message[i].image && message[i].image.length > 0) {
        //we have an image

        uploadUrl = uploadImageAsync(
          message[i].image,
          this.state.chatroom,
          message[i].user
        );
      } else {
        this.messageRef.push({
          text: `${message[i].text}`,
          chatroom: this.state.chatroom,
          user: message[i].user,
          createdAt: this.timestamp,
          date: new Date().getTime(),
          system: false,
          pushToken: global.pushToken
        });

        this.latestMessageRef.update({
          latestText: `${message[i].text}`,
          latestUser: message[i].user.name,
        });
      }
    }
    if (global.pushToken.length > 0) {
      this.messageRef = firebase
        .database()
        .ref(
          `instance/${instID}/chat/chatroom/${
            this.state.chatroom
          }/notifications/${global.safeToken}`
        );
      this.messageRef.update({
        //mute: false,
        pushToken: global.pushToken
      });
    }
  }

  setMute(muteState) {
    if (undefined === global.pushToken) {
      global.pushToken = "";
    }

    if (global.pushToken.length > 0) {
      this.messageRef = firebase
        .database()
        .ref(
          `instance/${instID}/chat/chatroom/${
            this.state.chatroom
          }/notifications/${global.safeToken}`
        );
      this.messageRef.update({
        mute: muteState,
        pushToken: global.pushToken
      });
    }
  }

  closeChat() {
    if (this.messageRef) {
      this.messageRef.off();
    }
  }
}

async function uploadImageAsync(uri, chatroom, user) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662

  var URLfile;
  var d = new Date();
  const fileType = uri.split('.').pop().split(/\#|\?/)[0];
  var fileToUpload = "";

  if (fileType == 'JPG') {
    const convertedImage = await new ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { height: 1000 } }],
      { compress: 0 }
    );
    fileToUpload = convertedImage.uri
  } else {
    fileToUpload = uri
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
    .ref(
      "chatimage/" +
        chatroom +
        "/" +
        d.getUTCFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2)
    )
    .child(uuid.v4());

  const snapshot = await ref
    .put(blob)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL(); // Will return a promise with the download link
    })

    .then(downloadURL => {
      console.log(
        `Successfully uploaded file and got download link - ${downloadURL}`
      );
      URLfile = downloadURL;
      return downloadURL;
    })

    .catch(error => {
      // Use to signal error if something goes wrong.
      console.log(`Failed to upload file and get link - ${error}`);
    });

  // We're done with the blob, close and release it
  blob.close();

  this.messageRef = firebase
    .database()
    .ref(`instance/${instID}/chat/chatroom/${chatroom}/messages`);
  this.messageRef.push({
    image: URLfile,
    chatroom: chatroom,
    user: user,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    date: new Date().getTime(),
    system: false,
    pushToken: global.pushToken

    // location: {
    //  latitude: 48.864601,
    //  longitude: 2.398704
    // },
  });

  return await uploadUrl;
}

export default new Backend();
