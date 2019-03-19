const functions = require('firebase-functions');
const admin = require('firebase-admin');
let fetch = require('node-fetch');

admin.initializeApp(functions.config().firebase);

// https://firebase.google.com/docs/functions/get-started
// firebase deploy
// send the push notification
exports.sendPushNotification = functions.database.ref('instance/0001-sais_edu_sg/chat/chatroom/International Fiesta/{createdID}').onCreate((snap, context) => {
  const createdData = snap.val();
  console.log(createdData);
  console.log(`${createdData.user.name  }: ${  createdData.text}`);

  let messages = [];

  // cx iPhone
  messages.push({
    'to': 'ExponentPushToken[0_rniBFtyWshjEYnkzcQXF]',
    'title': 'International Fiesta > ' + createdData.user.name,
    sound: 'default',
    body: createdData.text,
  });

  // Android
  messages.push({
    to: 'ExponentPushToken[rXb2wQB9LjaLe3JlSarOsk]',
    'title': 'International Fiesta > ' + createdData.user.name,
    'sound': 'default',
    body: createdData.text,
  });

  // simon iPhone
  messages.push({
    to: 'ExponentPushToken[lBKUcgCJqZDVFJALPCsq07]',
    'title': 'International Fiesta > ' + createdData.user.name,
    'sound': 'default',
    body: createdData.text,
  });

  // return the main promise
  return Promise.all(messages)

    .then((messages) => {
      // console.log(messages)
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


exports.sendPushNotificationSimonAll = functions.database.ref('instance/0001-sais_edu_sg/chat/chatroom/{createdID}').onCreate((snap, context) => {
  const createdData = snap.val();
  console.log(createdData);
  

  let messages = [];
  // simon iPhone
  messages.push({
    to: 'ExponentPushToken[lBKUcgCJqZDVFJALPCsq07]',
    title: 'New Chat Message in SAIS App',
    'sound': 'default',
    'body': createdData.text,
  });

  // return the main promise
  return Promise.all(messages)

    .then((messages) => {
      // console.log(messages)
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

exports.sendPushNotificationGala = functions.database.ref('instance/0001-sais_edu_sg/chat/chatroom/Stamford 10 Year Gala/{createdID}').onCreate((snap, context) => {
  const createdData = snap.val();
  console.log(createdData);
  console.log(`${createdData.user.name  }: ${  createdData.text}`);

  let messages = [];



  // simon iPhone
  messages.push({
    to: 'ExponentPushToken[lBKUcgCJqZDVFJALPCsq07]',
    title: 'ALL > ' + createdData.user.name,
    sound: 'default',
    'body': createdData.text,
  });

  // return the main promise
  return Promise.all(messages)

    .then((messages) => {
      // console.log(messages)
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

