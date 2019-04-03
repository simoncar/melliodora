const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp(functions.config().firebase);

// https://firebase.google.com/docs/functions/get-started
// firebase deploy
// send the push notification

exports.sendPushNotificationSimonAll = functions.database.ref('instance/0001-sais_edu_sg/chat/chatroom/{chatroomID}/messages/{newMessageID}').onCreate((snap, context) => {
  const createdData = snap.val();
  const messages = [];

  const query = admin.database().ref(`instance/0001-sais_edu_sg/chat/chatroom/${createdData.chatroom}/notifications`);
  query.on('value', (snap) => {
    snap.forEach((child) => {
      const { key } = child; // "ada"
      const childData = child.val();

      // simon iPhone
      messages.push({
        to: childData.pushToken,
        title: createdData.chatroom,
        sound: 'default',
        body: createdData.text,
      });
    });
  });

  // return the main promise
  return Promise.all(messages)

    .then((messages) => {
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),

      });
    })
    .catch((reason) => {
      console.log(reason);
    });
});
