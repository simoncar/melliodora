"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const { Translate } = require("@google-cloud/translate");

admin.initializeApp();

const translateX = new Translate();
//const CUT_OFF_TIME = 2 * 60 * 60 * 1000;  - 2 hours
// List of output languages.
const LANGUAGES = ["es", "ko", "fr", "zh-CN", "ga", "it", "ja", "tl", "cy"];
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; //  - 2 hours

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
    console.log("Beacon Name - new Ping", beaconName);

    return null;
  });

const moment = require("moment");
const cors = require("cors")({
  origin: true
});

exports.beaconPingHistory = functions.firestore
  .document("sais_edu_sg/beacon/beacons/{beaconID}")
  .onWrite(async (change, context) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();

    const beacon = context.params.beaconID;

    const newState = newValue.state;
    const newCampus = newValue.campus

    const oldState = oldValue.state;
    const oldCampus= oldValue.campus

     if (newState !== oldState) {
      const moment = require("moment");
      const xdate = moment().add(8,'hours').format("YYYYMMDD");
      const timestamp = Date.now();
      

      var dataDict = {
        oldState: oldState,
        oldCampus: oldCampus,
        state: newState,
        campus : newCampus,
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
    const newCampus = newValue.campus

    const oldState = oldValue.state;
    const oldCampus= oldValue.campus

     if (newState !== oldState) {
      const moment = require("moment");
      const xdate = moment().add(8,'hours').format("YYYYMMDD");
      const timestamp = Date.now();
      
      var dataDict = {
        oldState: oldState,
        oldCampus: oldCampus,
        state: newState,
        campus : newCampus,
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

//https://us-central1-calendar-app-57e88.cloudfunctions.net/deleteOldItems

exports.deleteOldItems = functions.https.onRequest(async (req, res) => {
  // const ref = admin
  //     .database()
  //     .ref(
  //       `instance/0001-sais_edu_sg/beacon/`
  //     );
  var response = "";
  var i = 0;
  //const ref = change.after.ref.parent; // reference to the parent
  const now = Date.now();
  const cutoff = now - 100000; //CUT_OFF_TIME;
  const updates = {};
  const beacon = admin.database().ref("instance/0001-sais_edu_sg/beacon/");
  const oldItemsQuery = await admin
    .database()
    .ref(`instance/0001-sais_edu_sg/beacon/`)
    .orderByChild("timestamp")
    .endAt(cutoff);
  oldItemsQuery.on("value", function(snapshot) {
    //.endAt(cutoff);

    //const oldItemsQuery = ref.orderByChild("timestamp").endAt(cutoff);
    //const snapshot = oldItemsQuery.once("value");
    // create a map with all children that need to be removed

    console.log("before ");
    response = response + "before";
    snapshot.forEach(child => {
      if (i < 100) {
        if (child.child("state").val() == "Perimeter") {
          i++;
          updates[child.key] = {
            beaconName: child.child("beaconName").val(),
            beaconCampus: child.child("beaconCampus").val(),
            beaconType: child.child("beaconType").val(),
            lastSeen: Date.now(),
            timestamp: null,
            state: "Off Campus",
            beaconPictureURL: child.child("beaconPictureURL").val()
          };

          const beaconName = child.child("beaconName").val();
          const newPing = admin
            .database()
            .ref(
              `instance/0001-sais_edu_sg/chat/chatroom/beacon-` +
                beaconName +
                "/messages"
            );

          newPing.push({
            //mute: false,
            chatroom: beaconName,
            text: "Ping - " + child.child("beaconCampus").val(),
            createdAt: Date.now(),
            date: Date.now(),
            system: true,
            user: {
              name: child.child("beaconCampus").val()
            }
          });
        }

        if (child.child("state").val() == "Gateway - Active") {
          i++;
          updates[child.key] = {
            lastSeen: Date.now(),
            timestamp: null,
            state: "Gateway - Offline"
          };
        }
      } //i
    });

    console.log("updates = ", updates);
    console.log("i = ", i);
    beacon.update(updates);
    //oldItemsQuery.update(updates)
  });
  res.status(200).send(response);
  // return oldItemsQuery.update(updates);
});

exports.registerBeacon = functions.https.onRequest((req, res) => {
  // https://us-central1-calendar-app-57e88.cloudfunctions.net/registerBeacon
  // https://script.google.com/macros/s/AKfycbwhrlEfQhiSgcsF6AM_AlaMWxU7SsEtJ-yQpvthyQTT1jui588E/exec

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
      beacons.forEach(async function(snapshot) {
        if ((snapshot.type = "Gateway" && personCampus == "")) {
          switch (snapshot.mac) {
            case "AC233FC03164":
              personCampus = "Woodleigh - Gate 1";
              personName = "GATEWAY";
              personPictureURL =
                "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
              personState = "Perimeter";
              break;
            case "AC233FC031B8":
              personCampus = "Woodleigh - Gate 2";
              personName = "GATEWAY";
              personPictureURL =
                "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
              personState = "On Campus";
              break;
            case "AC233FC039DB":
              personName = "GATEWAY";
              personCampus = "Smartcookies Office HQ";
              personPictureURL =
                "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
              personState = "Perimeter";
              break;
            case "AC233FC039C9":
              personName = "GATEWAY";
              personCampus = "Smartcookies Cove";
              personPictureURL =
                "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
              personState = "Perimeter";
              break;
            case "AC233FC039B2":
              personName = "GATEWAY";
              personCampus = "ELV Gate 1";
              personPictureURL =
                "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
              personState = "Perimeter";
              
              break;
            case "AC233FC039BE":
              personName = "GATEWAY";
              personCampus = "Woodleigh Parent Helpdesk";
              personPictureURL =
                "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
              personState = "On Campus";
              break;
            case "AC233FC039BB":
              personName = "GATEWAY";
              personCampus = "Woodleigh Stairwell";
              personPictureURL =
                "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
              personState = "On Campus";
              break;
          }
        }

       // targetCollection = "beaconsNotOurs";
        targetCollection = "beacons";
        var newBeacon = false

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
          battery: battery
        };

        
        if (newBeacon == true) {
          admin
          .firestore()
          .collection("sais_edu_sg")
          .doc("beacon")
          .collection(targetCollection)
          .doc(snapshot.mac)
          .set(dataDict);
        } else {
          admin
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
    // [END sendResponse]
  });
});
// [END all]
