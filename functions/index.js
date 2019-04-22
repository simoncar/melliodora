const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp(functions.config().firebase);

// https://firebase.google.com/docs/functions/get-started
// firebase deploy (from root)
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

'use strict';

// [START functionsimport]

// [END functionsimport]
// [START additionalimports]
// Moments library to format dates.
const moment = require('moment');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true,
});
// [END additionalimports]

// [START all]
/**
 * Returns the server's date. You must provide a `format` URL query parameter or `format` vaue in
 * the request body with which we'll try to format the date.
 *
 * Format must follow the Node moment library. See: http://momentjs.com/
 *
 * Example format: "MMMM Do YYYY, h:mm:ss a".
 * Example request using URL query parameters:
 *   https://us-central1-<project-id>.cloudfunctions.net/date?format=MMMM%20Do%20YYYY%2C%20h%3Amm%3Ass%20a
 * Example request using request body with cURL:
 *   curl -H 'Content-Type: application/json' /
 *        -d '{"format": "MMMM Do YYYY, h:mm:ss a"}' /
 *        https://us-central1-<project-id>.cloudfunctions.net/date
 *
 * This endpoint supports CORS.
 */
// [START trigger]
exports.registerBeacon = functions.https.onRequest((req, res) => {

  // https://us-central1-calendar-app-57e88.cloudfunctions.net/registerBeacon

  // [END trigger]
  // [START sendError]
  // Forbidding PUT requests.
  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }
  // [END sendError]

  // [START usingMiddleware]
  // Enable CORS using the `cors` express middleware.
  return cors(req, res, () => {
    // [END usingMiddleware]
    // Reading date format from URL query parameter.
    // [START readQueryParam]
    let format = req.query.format;
    // [END readQueryParam]
    // Reading date format from request body query parameter
    if (!format) {
      // [START readBodyParam]
      format = req.body.format;
      // [END readBodyParam]
    }
    // [START sendResponse]
    const formattedDate = moment().format(format);
    console.log('Sending Formatted date:', formattedDate);
    res.status(200).send(formattedDate);
    // [END sendResponse]
  });
});
// [END all]