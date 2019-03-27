const functions = require('firebase-functions');
const admin = require('firebase-admin');
let fetch = require('node-fetch');

admin.initializeApp(functions.config().firebase);

// https://firebase.google.com/docs/functions/get-started
// firebase deploy
// send the push notification

exports.sendPushNotificationSimonAll = functions.database.ref('instance/0001-sais_edu_sg/chat/chatroom/{chatroomID}/messages/{newMessageID}').onCreate((snap, context) => {
  const createdData = snap.val();
  console.log(createdData);
  

  let messages = [];

  console.log ("1************")
  var query = admin.database().ref("instance/0001-sais_edu_sg/chat/chatroom/" + createdData.chatroom + "/notifications");
  console.log ("2************")
  query.on('value', (snap) => {
    console.log ("3************")
    snap.forEach((child) => {
      console.log ("4************   TTTTTTTT")
        var key = child.key; // "ada"
        var childData = child.val();
       // taken out mute for now
          console.log (childData.push);
          console.log (childData.pushToken);

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