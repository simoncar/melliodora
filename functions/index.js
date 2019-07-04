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
  .ref(
    "instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/{messageID}"
  )
  .onWrite(async (change, context) => {
    const snapshot = change.after;
    const promises = [];
    const messageID = context.params.messageID;

    // for (let i = 0; i < LANGUAGES.length; i++) {
    //   const language = LANGUAGES[i];

    // if (language !== context.params.languageID) {
    var message = snapshot.child("text").val();

    var results = await translateX.translate(message, { to: "ja" });
    var detectedSourceLanguage =
      results[1].data.translations[0].detectedSourceLanguage;

    admin
      .database()
      .ref(
        `instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`
      )
      .update({
        textJA: results[0],
        detectedSourceLanguage: detectedSourceLanguage
      });

    var results = await translateX.translate(message, { to: "zh-CN" });
    admin
      .database()
      .ref(
        `instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`
      )
      .update({ textZHCN: results[0] });

    var results = await translateX.translate(message, { to: "ko" });
    admin
      .database()
      .ref(
        `instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`
      )
      .update({ textKO: results[0] });

    var results = await translateX.translate(message, { to: "fr" });
    admin
      .database()
      .ref(
        `instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`
      )
      .update({ textFR: results[0] });

    var results = await translateX.translate(message, { to: "en" });
    admin
      .database()
      .ref(
        `instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/${messageID}`
      )
      .update({ textEN: results[0], approved: true });

    //}
    // }
    return Promise.all(promises);
  });

exports.sendPushNotificationSimonAll = functions.database
  .ref(
    "instance/0001-sais_edu_sg/chat/chatroom/{chatroomID}/messages/{newMessageID}"
  )
  .onCreate((snap, context) => {
    const createdData = snap.val();
    const messages = [];

    const query = admin
      .database()
      .ref(
        `instance/0001-sais_edu_sg/chat/chatroom/${
        createdData.chatroom
        }/notifications`
      );
    query.on("value", snap => {
      snap.forEach(child => {
        const { key } = child; // "ada"
        const childData = child.val();

        // simon iPhone
        messages.push({
          to: childData.pushToken,
          title: createdData.chatroom,
          sound: "default",
          body: createdData.text
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify(messages)
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
  origin: true
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
        timestamp: Date.now()
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

exports.beaconPingHistoryNotOurs = functions.firestore
  .document("sais_edu_sg/beacon/beaconsNotOurs/{beaconID}")
  .onWrite(async (change, context) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();

    const beacon = context.params.beaconID;

    const newState = newValue.state;
    const newCampus = newValue.campus;

    const oldState = oldValue.state;
    const oldCampus = oldValue.campus;

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
        timestamp: Date.now()
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

//https://us-central1-calendar-app-57e88.cloudfunctions.net/computeCounts
exports.computeCounts = functions.https.onRequest(async (req, res) => {
  let entered = 0
  let onCampus = 0;
  let enteredExited = 0;
  let noShow = 0;

  let beacons = await admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .limit(50);
  // .where("timestamp", "<", cutoff)
  // .limit(1);

  let query = beacons.get().then( async snapshot => {
    console.log("querying")

    snapshot.forEach(doc => {
      const state = doc.data().state
      console.log("state=", state);
      ++entered;

      switch (state) {
        case "Perimeter":
        case "On Campus":
          ++onCampus;
          break;
        case "No Show":
          ++noShow;
          break;
        case "Entered then Exited":
          ++enteredExited;
          break;
        default:
        // code block
      }

    });
    let result = {
      entered: entered,
      onCampus: onCampus,
      noShow: noShow,
      enteredExited: enteredExited
    }

    console.log("Attendance Overview : ", JSON.stringify(result));
    let today = new Date();
    console.log("today", today.toISOString())
    let setWithOptions  = await admin
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beaconHistory")
      .doc("20190703")
      .set(result, { merge: true });

    res.status(200).send("setWithOptions " + setWithOptions);
  });


  
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
            beaconCampus: child.campus,
            lastSeen: Date.now(),
            timestamp: null,
            state: "Off Campus",
            mac: doc.id,
            rssi: child.rssi
          };

          admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection("beacons")
            .doc(doc.id)
            .update(update);
        }

        if (child.state == "Gateway - Active") {
          i++;
          updates[i] = {
            lastSeen: Date.now(),
            timestamp: null,
            state: "Gateway - Offline"
          };

          admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection("beacons")
            .doc(doc.id)
            .update(updates[i]);
        }
      } //i
    });
  });

  //part 2 - on campus 'lost beacons' expire overnight

  // const cutoff = now - 100000; //CUT_OFF_TIME;
  const cutoffOvernight = now - 1000000; //CUT_OFF_TIME;
  beacons = await admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .where("timestamp", "<", cutoffOvernight)
    .where("state", "==", "On Campus")
    .limit(100);

  let query2 = beacons.get().then(snapshot => {
    if (snapshot.empty) {
      console.log("No matching On Campus beacons to expire.");
      return;
    }

    snapshot.forEach(doc => {
      child = doc.data();
      if (i < 100) {
        if (child.state == "On Campus") {
          i++;
          update = {
            beaconCampus: child.campus,
            lastSeen: Date.now(),
            timestamp: null,
            state: "Off Campus",
            mac: doc.id,
            rssi: child.rssi
          };

          console.log("Expire lost on campus.", doc.id, update);

          admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection("beacons")
            .doc(doc.id)
            .update(update);
        }
      }
    });
  });

  res.status(200).send(response);
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

    //const formattedDate = moment().format(format);
    //console.log("DATA:", formattedDate);
    console.log("DATA:", req.body);

    var beacons = req.body;
    var personCampus = "";
    var personState = "";
    var personName = "";
    var personPictureURL = "";
    var targetCollection = "beaconsNotOurs";

    try {
      beacons.forEach(async function (snapshot) {
        if ((snapshot.type = "Gateway" && personCampus == "")) {
          personName = "GATEWAY";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";

          switch (snapshot.mac) {
            case "AC233FC03164":
              personCampus = "Woodleigh - Gate 1";
              personState = "Perimeter";
              break;
            case "AC233FC031B8":
              personCampus = "Woodleigh - Gate 2";
              personState = "Perimeter";
              break;
            case "AC233FC039DB":
              personCampus = "Smartcookies Office HQ";
              personState = "Perimeter";
              break;
            case "AC233FC039C9":
              personCampus = "Smartcookies Cove";
              personState = "Perimeter";
              break;
            case "AC233FC039B2":
              personCampus = "ELV Gate 1";
              personState = "Perimeter";
              break;
            case "AC233FC039BE":
              personCampus = "Woodleigh Parent Helpdesk";
              personState = "On Campus";
              break;
            case "AC233FC039A7":
              personCampus = "Woodleigh TBA 1";
              personState = "On Campus";
              break;
            case "AC233FC03A44":
              personCampus = "Woodleigh TBA 2";
              personState = "On Campus";
              break;
            case "AC233FC039B1":
              personCampus = "Woodleigh TBA 3";
              personState = "On Campus";
              break;
            case "AC233FC039CA":
              personCampus = "Woodleigh TBA 4";
              personState = "On Campus";
              break;
            case "AC233FC039BB":
              personCampus = "Woodleigh TBA 5";
              personState = "On Campus";
              break;
            case "AC233FC039B8":
              personCampus = "Woodleigh TBA 6";
              personState = "On Campus";
              break;
            case "AC233FC03E1F":
              personCampus = "Woodleigh - Gate 1 II";
              personState = "On Campus";
              break;
            case "AC233FC03E00":
              personCampus = "Woodleigh - Gate 1 II";
              personState = "On Campus";
              break;
            case "AC233FC03E46":
              personCampus = "Woodleigh Parent Helpdesk II";
              personState = "On Campus";
              break;
            default:
              personName = "";
              personPictureURL = "";
          }
        }

        // targetCollection = "beaconsNotOurs";
        targetCollection = "beacons";
        var newBeacon = false;

        let beaconRef = await admin
          .firestore()
          .collection("sais_edu_sg")
          .doc("beacon")
          .collection("beacons")
          .doc(snapshot.mac);

        let beaconDoc = await beaconRef
          .get()
          .then(doc => {
            if (!doc.exists) {
              targetCollection = "beaconsNotOurs";
              targetCollection = "beacons";
              newBeacon = true;
            } else targetCollection = "beacons";
          })

          .catch(err => {
            console.log("Error getting document", err);
          });

        var ibeaconUuid =
          snapshot.ibeaconUuid === undefined ? "" : snapshot.ibeaconUuid;
        var ibeaconMajor =
          snapshot.ibeaconMajor === undefined ? 0 : snapshot.ibeaconMajor;
        var ibeaconMinor =
          snapshot.ibeaconMinor === undefined ? 0 : snapshot.ibeaconMinor;
        var rssi = snapshot.rssi === undefined ? 0 : snapshot.rssi;
        var ibeaconTxPower =
          snapshot.ibeaconTxPower === undefined ? 0 : snapshot.ibeaconTxPower;
        var battery = snapshot.battery === undefined ? 0 : snapshot.battery;
        var raw = snapshot.rawData === undefined ? "0" : snapshot.rawData;

        //console.log("a=", raw.length, snapshot.mac);
        // console.log("b=", snapshot.rawData.length, snapshot.mac);

        if (raw.length < 10) {
          var dataDict = {
            campus: personCampus,
            timestamp: Date.now(),
            state: personState,
            type: snapshot.type,
            ibeaconUuid: ibeaconUuid,
            ibeaconMajor: ibeaconMajor,
            ibeaconMinor: ibeaconMinor,
            rssi: rssi,
            ibeaconTxPower: ibeaconTxPower,
            battery: battery,
            mac: snapshot.mac,
            name: personName
          };
        } else {
          var dataDict = {
            campus: personCampus,
            timestamp: Date.now(),
            state: personState,
            type: snapshot.type,
            ibeaconUuid: ibeaconUuid,
            ibeaconMajor: ibeaconMajor,
            ibeaconMinor: ibeaconMinor,
            rssi: rssi,
            ibeaconTxPower: ibeaconTxPower,
            battery: battery,
            raw: raw,
            mac: snapshot.mac,
            name: personName
          };
        }

        if (newBeacon == true) {
          await admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection(targetCollection)
            .doc(snapshot.mac)
            .set(dataDict);
        } else {
          await admin
            .firestore()
            .collection("sais_edu_sg")
            .doc("beacon")
            .collection(targetCollection)
            .doc(snapshot.mac)
            .update(dataDict);
        }
      });
    } catch (e) {
      console.log("catch error body:", req.body);
      console.error(e.message);
    }

    res.status(200).send(req.body);
  });
});
