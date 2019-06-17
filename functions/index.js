"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const { Translate } = require("@google-cloud/translate");

admin.initializeApp();

const translateX = new Translate();
//const CUT_OFF_TIME = 2 * 60 * 60 * 1000;  - 2 hours
// List of output languages.
const LANGUAGES = ["en", "es", "de", "fr", "sv", "ga", "it", "jp"];
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; //  - 2 hours

// https://firebase.google.com/docs/functions/get-started
// firebase deploy (from root)
// send the push notification

// Translate an incoming message.
exports.translate = functions.database
  .ref(
    "instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages/{languageID}/{messageID}"
  )
  .onWrite(async (change, context) => {
    const snapshot = change.after;

    if (1 == 2) {
      return null;
    }
    const promises = [];
    for (let i = 0; i < LANGUAGES.length; i++) {
      const language = LANGUAGES[i];
      console.log("translate = ", language);
      console.log("   context = ", context.params.languageID);
      if (language !== context.params.languageID) {
        console.log("do some work  = ", snapshot);

        console.log("call translator", promises);
        const results = await translateX.translate(snapshot.val().message, {
          from: context.params.languageID,
          to: language
        });
        console.log("translate await results = ", results);

        return admin
          .database()
          .ref(
            `instance/0001-sais_edu_sg/chat/chatroom/Test Chatroom/messages2/${language}/YYY`
          )
          .set({
            text: results[0],
            translated: true
          });

        console.log("here errror");
      }
    }
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

exports.beaconPingHistory = functions.database
  .ref("instance/0001-sais_edu_sg/beacon/{beaconID}/state")
  .onWrite(async (change, context) => {
    const snapshot = change.after;

    const beacon = context.params.beaconID;
    const state = snapshot.val();

    const moment = require("moment");
    const xdate = moment().format("YYYYMMDD");

    const newHistory = admin
      .database()
      .ref(
        "instance/0001-sais_edu_sg/beaconHistory/" +
          xdate +
          "/" +
          beacon +
          "/" +
          Date.now()
      );

    newHistory.update({
      //mute: false,

      timestamp: Date.now(),
      state: state
    });
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
    var ibeaconUuid = "";
    var ibeaconMajor = 0;
    var ibeaconMinor = 0;
    var rssi = 0;
    var ibeaconTxPower = 0;
    var battery = 0;

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
              console.log("ELV Formatted body:", req.body);
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

        const beacon = admin
          .database()
          .ref(`instance/0001-sais_edu_sg/beacon/` + snapshot.mac);

        var ibeaconUuid = snapshot.ibeaconUuid;

        beacon.once("value").then(async function(snapshot2) {

          if (undefined == snapshot.ibeaconUuid ) {ibeaconUuid = ""} else {ibeaconUuid = snapshot.ibeaconUuid};
          if (undefined == snapshot.ibeaconMajor ) {ibeaconMajor = ""} else {ibeaconMajor = snapshot.ibeaconMajor};
          if (undefined == snapshot.ibeaconMinor ) {ibeaconMinor = ""} else {ibeaconMinor = snapshot.ibeaconMinor};
          if (undefined == snapshot.rssi ) {rssi = ""} else {rssi = snapshot.rssi};
          if (undefined == snapshot.ibeaconTxPower ) {ibeaconTxPower = ""} else {ibeaconTxPower = snapshot.ibeaconTxPower};
          if (undefined == snapshot.battery ) {battery = ""} else {battery = snapshot.battery};

          if (snapshot2.child("beaconName").exists()) {
            beacon.update({
              //mute: false,
              // beaconName: personName,
              // beaconType: personType,
              // beaconCampus: personCampus,
              // beaconGrade: personGrade,
              // beaconPictureURL: personPictureURL,
              timestamp: Date.now(),
              state: personState,
              type: snapshot.type,
              ibeaconUuid: ibeaconUuid,
              ibeaconMajor: ibeaconMajor,
              ibeaconMinor: ibeaconMinor,
              rssi: rssi,
              ibeaconTxPower: ibeaconTxPower,
              battery: battery
            });
          } else {
            // not our beacon

            const beaconNotOurs = await admin
              .database()
              .ref(`instance/0001-sais_edu_sg/beaconNotOurs/` + snapshot.mac);

            beaconNotOurs.update({
              //mute: false,
              // beaconName: personName,
              // beaconType: personType,
              // beaconCampus: personCampus,
              // beaconGrade: personGrade,
              // beaconPictureURL: personPictureURL,
              beaconType: "not ours",
              timestamp: Date.now(),
              state: personState,
              type: snapshot.type,
              ibeaconUuid: ibeaconUuid,
              ibeaconMajor: ibeaconMajor,
              ibeaconMinor: ibeaconMinor,
              rssi: rssi,
              ibeaconTxPower: ibeaconTxPower,
              battery: battery
            });
          }
        });
        // Test for the existence of certain keys within a DataSnapshot

        var personName = "";
        var personType = "";

        var personGrade = "";
        var personPictureURL = "";

        // if ((snapshot.type = "Gateway") && personCampus == "") {
        //   switch (snapshot.mac) {
        //     case "AC233FC03164":
        //       personCampus = "Woodleigh - Gate 1";
        //       personName = "GATEWAY";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
        //       personState = "Perimeter";
        //       break;
        //     case "AC233FC031B8":
        //       personCampus = "Woodleigh - Gate 2";
        //       personName = "GATEWAY";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
        //       personState = "On Campus";
        //       break;
        //     case "AC233FC039DB":
        //       personName = "GATEWAY";
        //       personCampus = "Smartcookies Office HQ";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
        //       personState = "XX Perimeter";
        //       break;
        //     case "AC233FC039C9":
        //       personName = "GATEWAY";
        //       personCampus = "Smartcookies Cove";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
        //       personState = "XX Perimeter";
        //       break;
        //     case "AC233FC039B2":
        //       personName = "GATEWAY";
        //       personCampus = "ELV Gate 1";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
        //       personState = "Perimeter";
        //       console.log("ELV Formatted body:", req.body);
        //       break;
        //     case "AC233FC039BE":
        //       personName = "GATEWAY";
        //       personCampus = "Woodleigh Parent Helpdesk";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
        //       personState = "On Campus";
        //       break;
        //     case "AC233FC039BB":
        //       personName = "GATEWAY";
        //       personCampus = "Woodleigh Stairwell";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
        //       personState = "On Campus";
        //       break;
        //   }
        // } else {
        //   // switch (snapshot.mac) {
        //     case "AC233F292EB0":
        //       personName = "Ryan Windebank";
        //       personType = "Student";
        //       personGrade = "7";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-10-12.17.21.png";
        //       break;
        //     case "AC233F292E3E":
        //       personName = "Grace Cariss";
        //       personType = "Student";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/graceprofilepic.jpeg";
        //       personGrade = "6";

        //       break;
        //     case "AC233F292E9A":
        //       personName = "Simon Cariss";
        //       personType = "Parent";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/27993517_10156308333051494_4863829502063215688_o.jpg";

        //       break;
        //     case "AC233F29148B":
        //       personName = "Lucy Cariss";
        //       personType = "Student";
        //       personGrade = "4";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/lucyprofilepic.jpeg";

        //       break;
        //     case "AC233F2915A0":
        //       personName = "Ben Cariss";
        //       personType = "Student";
        //       personGrade = "2";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/benprofilepic.jpeg";

        //       break;
        //     case "AC233F292F52":
        //       personName = "Christina Thorsen";
        //       personType = "Parent";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-19.07.22.png";
        //       break;
        //     case "AC233F29148A":
        //       personName = "Kayla Thorsen";
        //       personType = "Student";
        //       personGrade = "4";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-19.10.12.png";

        //       break;

        //     case "AC233F292FDD":
        //       personName = "Visitor Woodleigh";
        //       personType = "Visitor";
        //       personGrade = "4";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-22.21.19.png";
        //       break;
        //     case "FB1590E2A414":
        //       personName = "Unallocated Button";
        //       break;
        //     case "C33FA1179F52":
        //       personName = "Test Card **";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/27993517_10156308333051494_4863829502063215688_o.jpg";

        //       break;
        //     case "AC233F2915A9":
        //       personName = "Mohd Yusoff";
        //       personType = "Staff";
        //       personPictureURL =
        //         "https://saispta.com/wp-content/uploads/2019/05/Yusoff.jpeg";
        //       break;
        //     default:
        //       personType = snapshot.mac;
        //       personName = "~" + snapshot.mac;
        //   }
        // }
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
