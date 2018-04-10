import * as firebase from 'firebase';
import { Expo, Constants } from 'expo';

var instID = Constants.manifest.extra.instance;

class Backend {
  uid = '';
  messagesRef = null;

  //initialize firebase backend
  constructor() {
    /*
    firebase.initializeApp({
      apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw",
      authDomain: "calendar-app-57e88-41179.firebaseio.com",
      databaseURL: "https://calendar-app-57e88-41179.firebaseio.com",
      projectId: "12345",
      storageBucket: "",
      messagingSenderId: "22222"
    });
    */
   /*
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setUid(user.uid);
      } else {
        firebase.auth().signInAnonymously().catch((error) => {
          alert(error.message);
        });
      }
    });
    */
  }

  setUid(value) {
    this.uid = value;
  }

  getUid() {
    return this.uid;
  }

  //retrive msg from backend
  loadMessages(callback) {
    this.messageRef = firebase.database().ref('instance/' + instID + '/chat/class/3SHMU');
    this.messageRef.off();
    const onReceive = (data) => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        chatroom: 'AAA',
        user: {
          id: message.user._id,
          name: message.user.name
        }
      });
    };
    this.messageRef.limitToLast(50).on('child_added', onReceive);
  }

  //send msg to db
  SendMessage(message) {
    for (let i = 0; i < message.length; i++) {
      
        this.messageRef.push({text: message[i].text, chatroom:'5DAYE', user:message[i].user, createdAt: firebase.database.ServerValue.TIMESTAMP});
    }
  }

 closeChat() {
    if (this.messageRef) {
      this.messageRef.off();
    }
  }

}

export default new Backend();