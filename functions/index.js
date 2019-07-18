"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const { Translate } = require("@google-cloud/translate");

admin.initializeApp();

const moment = require("moment");

const translateX = new Translate();
//const CUT_OFF_TIME = 2 * 60 * 60 * 1000;  - 2 hours
// List of output languages.
const LANGUAGES = ["es", "ko", "fr", "zh-CN", "ga", "it", "ja", "tl", "cy"];
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; //  - 2 hours

// TODO: Port google app script to function
//  https://script.google.com/d/1fHtmEsrscPPql_nkxmkBhJw1pTbfHVPEc44QpY-P8WVcrVjlLDC4EWyS/edit?usp=drive_web

// https://firebase.google.com/docs/functions/get-started
// firebase deploy (from root)
//  firebase deploy --only functions:translate
// send the push notification

// Translate an incoming message.
exports.translate = functions.database
  .ref("instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/{messageID}")
  .onWrite(async (change, context) => {
    const snapshot = change.after;
    const promises = [];
    const messageID = context.params.messageID;

    // for (let i = 0; i < LANGUAGES.length; i++) {
    //   const language = LANGUAGES[i];

    // if (language !== context.params.languageID) {
    var message = snapshot.child("text").val();

    var results = await translateX.translate(message, { to: "ja" });
    var detectedSourceLanguage = results[1].data.translations[0].detectedSourceLanguage;

    admin
      .database()
      .ref(`instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`)
      .update({
        textJA: results[0],
        detectedSourceLanguage: detectedSourceLanguage,
      });

    var results = await translateX.translate(message, { to: "zh-CN" });
    admin
      .database()
      .ref(`instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`)
      .update({ textZHCN: results[0] });

    var results = await translateX.translate(message, { to: "ko" });
    admin
      .database()
      .ref(`instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`)
      .update({ textKO: results[0] });

    var results = await translateX.translate(message, { to: "fr" });
    admin
      .database()
      .ref(`instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`)
      .update({ textFR: results[0] });

    var results = await translateX.translate(message, { to: "en" });
    admin
      .database()
      .ref(`instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`)
      .update({ textEN: results[0], approved: true });

    //}
    // }
    return Promise.all(promises);
  });

exports.sendPushNotificationSimonAll = functions.database
  .ref("instance/0001-sais_edu_sg/chat/chatroom/{chatroomID}/messages/{newMessageID}")
  .onCreate((snap, context) => {
    const createdData = snap.val();
    const messages = [];

    const query = admin.database().ref(`instance/0001-sais_edu_sg/chat/chatroom/${createdData.chatroom}/notifications`);
    query.on("value", snap => {
      snap.forEach(child => {
        const { key } = child; // "ada"
        const childData = child.val();

        // simon iPhone
        messages.push({
          to: childData.pushToken,
          title: createdData.chatroom,
          sound: "default",
          body: createdData.text,
        });
      });
    });

    // return the main promise
    return Promise.all(messages)

      .then(messages => {
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messages),
        });
      })
      .catch(reason => {
        console.log(reason);
      });
  });

exports.chatBeaconPing = functions.database
  .ref("instance/0001-sais_edu_sg/beacon/{beaconPing}")
  .onCreate((snapshot, context) => {
    const createdData = snapshot.val();

    // Grab the current value of what was written to the Realtime Database.
    const beaconName = createdData.beaconName;

    return null;
  });

const cors = require("cors")({
  origin: true,
});

// https://us-central1-calendar-app-57e88.cloudfunctions.net/deleteOldItems
exports.deleteOldItems = functions.https.onRequest(async (req, res) => {
  var response = "";
  var i = 0;
  const now = Date.now();
  const cutoff = now - 100000; //CUT_OFF_TIME;
  const updates = [];
  var update = [];
  var child;

  //part 1 - perimeter beacons that have not been heard of
  let beacons = await admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .where("timestamp", "<", cutoff)
    .where("state", "==", "Perimeter")
    .limit(100);

  let query = beacons.get().then(snapshot => {
    if (snapshot.empty) {
      console.log("No matching Perimeter beacons to expire.");
      return;
    }

    snapshot.forEach(doc => {
      child = doc.data();
      if (i < 100) {
        if (child.state == "Perimeter") {
          i++;
          var update = {
            campus: child.campus,
            lastSeen: Date.now(),
            timestamp: null,
            state: "Exited",
            mac: doc.id,
            rssi: child.rssi,
          };

          admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection("beacons")
            .doc(doc.id)
            .update(update);
        }
      } //i
    });
  });

  // const cutoff = now - 100000; //CUT_OFF_TIME;
  const cutoffOvernight = now - 1000000; //CUT_OFF_TIME;
  beacons = await admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .where("timestamp", "<", cutoffOvernight)
    .where("state", "==", "Entered")
    .limit(100);

  let query2 = beacons.get().then(snapshot => {
    if (snapshot.empty) {
      console.log("No matching Entered beacons to expire.");
      return;
    }

    snapshot.forEach(doc => {
      child = doc.data();
      if (i < 100) {
        i++;
        update = {
          campus: child.campus,
          lastSeen: Date.now(),
          timestamp: null,
          state: "Not Present",
          mac: doc.id,
          rssi: child.rssi,
        };

        admin
          .firestore()
          .collection("sais_edu_sg")
          .doc("beacon")
          .collection("beacons")
          .doc(doc.id)
          .update(update);
      }
    });
  });

  res.status(200).send(response);
});

exports.beaconPingHistory = functions.firestore
  .document("sais_edu_sg/beacon/beacons/{beaconID}")
  .onWrite(async (change, context) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();
    const beacon = context.params.beaconID;
    var oldState = "";
    var oldCampus = "";

    if (undefined !== oldValue) {
      oldState = oldValue.state;
      oldCampus = oldValue.campus;
    }
    const newState = newValue.state;
    const newCampus = newValue.campus;

    if (newState !== oldState) {
      const xdate = moment()
        .add(8, "hours")
        .format("YYYYMMDD");
      const timestamp = Date.now();

      var dataDict = {
        oldState: oldState,
        oldCampus: oldCampus,
        state: newState,
        campus: newCampus,
        timestamp: Date.now(),
      };

      admin
        .firestore()
        .collection("sais_edu_sg")
        .doc("beacon")
        .collection("beaconHistory")
        .doc(xdate)
        .collection(beacon)
        .doc(timestamp.toString())
        .set(dataDict);
    }
  });

exports.registerBeacon = functions.https.onRequest((req, res) => {
  // https://us-central1-calendar-app-57e88.cloudfunctions.net/registerBeacon

  if (req.method === "PUT") {
    return res.status(403).send("Forbidden!");
  }

  if (undefined == req.body.length) {
    return res.status(403).send("Forbidden!");
  }
  if (req.body == "{}") {
    return res.status(403).send("Forbidden!");
  }

  return cors(req, res, () => {
    let format = req.query.format;
    if (!format) {
      format = req.body.format;
    }

    console.log("DATA:", req.body);

    var beacons = req.body;
    var campus = "";
    var personState = "";
    var dataDict = "";
    var beaconUpdates = [];

    //  try {

    beacons.forEach(snapshot => {
      if (snapshot.type == "Gateway") {
        dataDict = setGateway(snapshot);
        admin
          .firestore()
          .collection("sais_edu_sg")
          .doc("beacon")
          .collection("gateways")
          .doc(snapshot.mac)
          .set(dataDict);
      } else {
        if (beaconUpdates.indexOf(snapshot.mac) == -1) {
          beaconUpdates.push(snapshot.mac);
          console.log("Index : " + beaconUpdates.indexOf(snapshot.mac), snapshot.mac);

          let beaconRef = admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection("beacons")
            .doc(snapshot.mac)
            .get()
            .then(function(doc) {
              if (!doc.exists) {
                //IGNORE
              } else {
                personState = dataDict.state;
                campus = dataDict.campus;

                var ibeaconUuid = snapshot.ibeaconUuid === undefined ? "" : snapshot.ibeaconUuid;
                var ibeaconMajor = snapshot.ibeaconMajor === undefined ? 0 : snapshot.ibeaconMajor;
                var ibeaconMinor = snapshot.ibeaconMinor === undefined ? 0 : snapshot.ibeaconMinor;
                var rssi = snapshot.rssi === undefined ? 0 : snapshot.rssi;
                var ibeaconTxPower = snapshot.ibeaconTxPower === undefined ? 0 : snapshot.ibeaconTxPower;
                var battery = snapshot.battery === undefined ? 0 : snapshot.battery;
                var raw = snapshot.rawData === undefined ? "0" : snapshot.rawData;

                if (raw.length < 10) {
                  raw = "";
                }

                var dataDictUpdate = {
                  campus: campus,
                  timestamp: Date.now(),
                  state: personState,
                  ibeaconUuid: ibeaconUuid,
                  ibeaconMajor: ibeaconMajor,
                  ibeaconMinor: ibeaconMinor,
                  rssi: rssi,
                  ibeaconTxPower: ibeaconTxPower,
                  raw: raw,
                  mac: snapshot.mac,
                };

                admin
                  .firestore()
                  .collection("sais_edu_sg")
                  .doc("beacon")
                  .collection("beacons")
                  .doc(snapshot.mac)
                  .update(dataDictUpdate);
              }
            })

            .catch(err => {
              console.log("Error getting document", err);
            });
        }
      }
    });
    // } catch (e) {
    //   console.log("catch error body:", req.body);
    //   console.error(e.message);
    // }

    res.status(200).send(req.body);
  });
});

function setGateway(snapshot) {
  var state = "Entered";
  var personCampus = "";
  var personPictureURL = "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";

  switch (snapshot.mac) {
    case "AC233FC03164":
      personCampus = "Woodleigh - Gate 1";
      state = "Perimeter";
      break;
    case "AC233FC031B8":
      personCampus = "Woodleigh - Gate 2";
      state = "Perimeter";
      break;
    case "AC233FC039DB":
      personCampus = "Smartcookies Office HQ";
      state = "Perimeter";
      break;
    case "AC233FC039C9":
      personCampus = "Smartcookies Cove";
      state = "Perimeter";
      break;
    case "AC233FC039B2":
      personCampus = "ELV Gate 1";
      state = "Perimeter";
      break;
    case "AC233FC039BE":
      personCampus = "Woodleigh Parent Helpdesk";
      break;
    case "AC233FC039A7":
      personCampus = "Woodleigh TBA 1";
      break;
    case "AC233FC03A44":
      personCampus = "Woodleigh TBA 2";
      break;
    case "AC233FC039B1":
      personCampus = "Woodleigh TBA 3";
      break;
    case "AC233FC039CA":
      personCampus = "Woodleigh TBA 4";
      break;
    case "AC233FC039BB":
      personCampus = "Woodleigh TBA 5";
      break;
    case "AC233FC039B8":
      personCampus = "Woodleigh TBA 6";
      break;
    case "AC233FC03E1F":
      personCampus = "Woodleigh - Gate 1 II";
      state = "Perimeter";
      break;
    case "AC233FC03E00":
      personCampus = "Woodleigh - Gate 1 II";
      state = "Perimeter";
      break;
    case "AC233FC03E46":
      personCampus = "Woodleigh Parent Helpdesk II";
      break;
    default:
      personCampus = "Unknown - " + snapshot.mac;
      state = "Perimeter";
  }

  var dataDict = {
    campus: personCampus,
    timestamp: Date.now(),
    state: state,
    picture: personPictureURL,
    mac: snapshot.mac,
    gatewayFree: snapshot.gatewayFree,
    gatewayLoad: snapshot.gatewayLoad,
  };

  return dataDict;
}
