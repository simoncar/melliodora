import React from 'react';
import * as firebase from 'firebase';
import { Expo, Constants, AppLoading, Asset, Font } from 'expo';

import ApiKeys from './../../ApiKeys';

var instID = Constants.manifest.extra.instance;

export class Backend extends React.Component{
  uid = '';
  messagesRef = null;

  //initialize firebase backend
  constructor(props) {
      super();
      this.state = {
          chatroom: '',
      }
  }

  setUid(value) {
    this.uid = value;
  }

  aagetUid() {
    return this.uid;
  }

  setChatroom(chatroom) {
    console.log ('chatroom=' + chatroom);
    this.state.chatroom = chatroom;
  }

  //retrive msg from backend
  loadMessages(callback) {
      
    this.messageRef = firebase.database().ref('instance/' + instID + '/chat/chatroom/' + this.state.chatroom);
    this.messageRef.off();
    const onReceive = (data) => {
      const message = data.val();
      if (undefined !== message.user.avatar && null !== message.user.avatar &&  message.user.avatar.length > 0) {
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
          //location: {
          //  latitude: 48.864601,
          //  longitude: 2.398704
          //},
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
          //location: {
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
    this.messageRef = firebase.database().ref('instance/' + instID + '/chat/chatroom/' + this.state.chatroom);
  
    for (let i = 0; i < message.length; i++) {

      console.log ('sendmessage:' + message[i].text);
      console.log ('sendmessage:' + this.state.chatroom);
      console.log ('sendmessage:' + message[i].user);
      console.log ('sendmessage:' + message[i].user);
      console.log ('sendmessage:' + firebase.database.ServerValue.TIMESTAMP);
      console.log ('sendmessage:' + new Date().getTime());
      console.log ('sendmessage:' + false);
 
      this.messageRef.push({
        text: '' + message[i].text,
        chatroom: this.state.chatroom,
        user: message[i].user,
        createdAt: this.timestamp,
        date: new Date().getTime(),
        system: false,
        //location: {
        //  latitude: 48.864601,
        //  longitude: 2.398704
        //},
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