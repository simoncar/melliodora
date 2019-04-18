import React from 'react';
import * as firebase from 'firebase';
import { Constants } from 'expo';

let instID = Constants.manifest.extra.instance;

export class Backend extends React.Component {
  uid = '';

  messagesRef = null;

  constructor(props) {
    super();
    this.state = {
      chatroom: '',
    };
  }

  setUid(value) {
    this.uid = value;
  }

  aagetUid() {
    return this.uid;
  }

  setChatroom(chatroom) {
    console.log(`chatroom=${  chatroom}`);
    this.state.chatroom = chatroom.trim();
  }

  // retrive msg from backend
  loadMessages(callback) {
    this.messageRef = firebase.database().ref(`instance/${  instID  }/chat/chatroom/${  this.state.chatroom  }/messages`);
    this.messageRef.off();
    const onReceive = (data) => {
      const message = data.val();
      if (undefined !== message.user.avatar && message.user.avatar !== null && message.user.avatar.length > 0) {
        callback({
          _id: data.key,
          text: message.text,
          createdAt: new Date(message.createdAt),
          chatroom: this.state.chatroom,
          user: {
            _id: message.user._id,
            name: message.user.name,
            avatar: message.user.avatar,
          },
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
            name: message.user.name,
          },
          // location: {
          //  latitude: 48.864601,
          //  longitude: 2.398704
          // },
        });
      }
    };
    this.messageRef.limitToLast(50).on('child_added', onReceive);
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
      global.pushToken = '';
    }

    this.messageRef = firebase.database().ref(`instance/${ instID  }/chat/chatroom/${ this.state.chatroom }/messages`);

    for (let i = 0; i < message.length; i++) {
      this.messageRef.push({
        text: `${message[i].text}`,
        chatroom: this.state.chatroom,
        user: message[i].user,
        createdAt: this.timestamp,
        date: new Date().getTime(),
        system: false,
        pushToken: global.pushToken,
        // location: {
        //  latitude: 48.864601,
        //  longitude: 2.398704
        // },
      });
    }



    if (global.pushToken.length > 0) {
      this.messageRef = firebase.database().ref(`instance/${ instID }/chat/chatroom/${ this.state.chatroom }/notifications/${ global.safeToken }`);
      this.messageRef.update({
        //mute: false,
        pushToken: global.pushToken,
      });
    }
  }


  setMute(muteState) {
    if (undefined === global.pushToken) {
      global.pushToken = '';
    }

    if (global.pushToken.length > 0) {
      this.messageRef = firebase.database().ref(`instance/${ instID }/chat/chatroom/${ this.state.chatroom }/notifications/${ global.safeToken }`);
      this.messageRef.update({
        mute: muteState,
        pushToken: global.pushToken,
      });
    }
  }

  closeChat() {
    if (this.messageRef) {
      this.messageRef.off();
    }
  }

 
}


export default new Backend();
