const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const { Translate } = require("@google-cloud/translate");
const computeCounts = require("./computeCounts.js");

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

// firebase deploy --only functions:sendPushNotificationFromQueue
exports.sendPushNotificationFromQueue = functions.firestore
  .document("sais_edu_sg/push/queue/{messageID}")
  .onCreate((snap, context) => {
    const createdData = snap.data();
    var messages = [];
    // simon iPhone
    var token = createdData.pushToken;
    var realToken = token.replace("{", "[");
    realToken = realToken.replace("}", "]");

    messages.push({
      to: realToken,
      title: "PTA Message",
      sound: "default",
      body: createdData.text,
    });
    console.log("Send Push > ", realToken, createdData.text);
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
  var minutes = 1000 * 60;
  const now = Date.now();
  const cutoff = now - minutes * 10; //CUT_OFF_TIME;
  const updates = [];
  var update = [];
  var child;

  //part 1 - perimeter beacons that have not been heard of
  let beacons = await admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .where("timestampPerimeter", "<", cutoff)
    .where("stateCandidate", "==", "Perimeter")
    .limit(100);

  let query = beacons.get().then(snapshot => {
    if (snapshot.empty) {
      console.log("No matching Perimeter beacons to expire.");
      return;
    }

    snapshot.forEach(doc => {
      child = doc.data();
      if (i < 100) {
        if (child.timestamp < cutoff) {
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

exports.computeCounts = functions.https.onRequest(async (req, res) => {
  // This function is scheduled to run periodically
  //https://console.cloud.google.com/cloudscheduler?project=calendar-app-57e88&folder&organizationId&jobs-tablesize=50

  var countPerimeter = 0;
  var countExited = 0;
  var countEntered = 0;
  var countNotPresent = 0;
  var countOther = 0;

  const xdate = moment()
    .add(8, "hours")
    .format("YYYYMMDD");

  let ref = await admin
    .firestore()
    .collection("sais_edu_sg")
    .doc("beacon")
    .collection("beacons")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching Perimeter beacons to expire.");
        return;
      } else {
        snapshot.forEach(doc => {
          child = doc.data();
          switch (child.state) {
            case "Not Present":
              countNotPresent++;
              break;
            case "Perimeter":
              countPerimeter++;
              break;
            case "Entered":
              countEntered++;
              break;
            case "Exited":
              countExited++;
              break;
            default:
              countOther++;
              console.log(doc.id);
          }
        });
      }

      var dataDict = {
        countNotPresent,
        countPerimeter,
        countEntered,
        countExited,
        countOther,
        timestamp: Date.now(),
      };

      admin
        .firestore()
        .collection("sais_edu_sg")
        .doc("beacon")
        .collection("beaconHistory")
        .doc(xdate)
        .set(dataDict);
    });

  res.status(200).send(req.body);
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
          .update(dataDict);
      } else {
        if (beaconUpdates.indexOf(snapshot.mac) == -1) {
          beaconUpdates.push(snapshot.mac);
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
                var objAllUpdates = {},
                  objLocation = {},
                  objFirstSeen = {};
                beacon = doc.data();
                personState = dataDict.state;
                location = dataDict.location;
                gateway = dataDict.mac;

                var ibeaconUuidOld = beacon.ibeaconUuid === undefined ? "" : beacon.ibeaconUuid;
                var ibeaconMajorOld = beacon.ibeaconMajor === undefined ? 0 : beacon.ibeaconMajor;
                var ibeaconMinorOld = beacon.ibeaconMinor === undefined ? 0 : beacon.ibeaconMinor;
                var ibeaconTxPowerOld = beacon.ibeaconTxPower === undefined ? 0 : beacon.ibeaconTxPower;
                var rawOld = beacon.rawData === undefined ? "" : beacon.rawData;

                var ibeaconUuid = snapshot.ibeaconUuid === undefined ? ibeaconUuidOld : snapshot.ibeaconUuid;
                var ibeaconMajor = snapshot.ibeaconMajor === undefined ? ibeaconMajorOld : snapshot.ibeaconMajor;
                var ibeaconMinor = snapshot.ibeaconMinor === undefined ? ibeaconMinorOld : snapshot.ibeaconMinor;
                var ibeaconTxPower =
                  snapshot.ibeaconTxPower === undefined ? ibeaconTxPowerOld : snapshot.ibeaconTxPower;
                var raw = pickLatest(beacon.raw, snapshot.rawData, "");
                var battery = 100;

                var rssi = snapshot.rssi === undefined ? 0 : snapshot.rssi;

                var getwayMacdesc = "gateway-" + gateway;
                //master
                var objAllUpdates = {
                  location: location,
                  timestamp: Date.now(),
                  ibeaconUuid: ibeaconUuid,
                  ibeaconMajor: ibeaconMajor,
                  ibeaconMinor: ibeaconMinor,
                  rssi: rssi,
                  ibeaconTxPower: ibeaconTxPower,
                  raw: raw,
                  mac: snapshot.mac,
                  gatewayMostRecent: gateway,
                  [getwayMacdesc]: Date.now(),
                  timestamp: Date.now(),
                  battery: battery,
                };

                //nuances

                if (beacon.state == "Not Present") {
                  // first time today we are seeing this person
                  var objFirstSeen = {
                    timestampFirstSeenToday: Date.now(),
                    state: "Arriving",
                  };
                }

                if (personState == "Perimeter") {
                  objLocation = {
                    stateCandidate: "Perimeter",
                    timestampPerimeterCandidate: Date.now(),
                  };
                } else {
                  objLocation = {
                    state: "Entered",
                    timestampEntered: Date.now(),
                  };
                }
                let dataDictUpdate = { ...objAllUpdates, ...objLocation, ...objFirstSeen };

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
  var location = "";
  var personPictureURL = "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";

  switch (snapshot.mac) {
    case "AC233FC03164":
      location = "Woodleigh - Gate 1";
      state = "Perimeter";
      break;
    case "AC233FC031B8":
      location = "Woodleigh - Gate 2";
      state = "Perimeter";
      break;
    case "AC233FC039DB":
      location = "Smartcookies Office HQ";
      state = "Perimeter";
      break;
    case "AC233FC039C9":
      location = "Smartcookies Cove";
      state = "Perimeter";
      break;
    case "AC233FC039B2":
      location = "ELV Gate 1";
      state = "Perimeter";
      break;
    case "AC233FC039BE":
      location = "Woodleigh Parent Helpdesk";
      break;
    case "AC233FC039A7":
      location = "Woodleigh TBA 1";
      break;
    case "AC233FC03A44":
      location = "Woodleigh TBA 2";
      break;
    case "AC233FC039B1":
      location = "Woodleigh TBA 3";
      break;
    case "AC233FC039CA":
      location = "Woodleigh TBA 4";
      break;
    case "AC233FC039BB":
      location = "Woodleigh TBA 5";
      break;
    case "AC233FC039B8":
      location = "Woodleigh TBA 6";
      break;
    case "AC233FC03E1F":
      location = "Woodleigh - Gate 1 II";
      state = "Perimeter";
      break;
    case "AC233FC03E00":
      location = "Woodleigh - Gate 1 II";
      state = "Perimeter";
      break;
    case "AC233FC03E46":
      location = "Woodleigh Parent Helpdesk II";
      break;
    default:
      location = "Unknown - " + snapshot.mac;
      state = "Perimeter";
  }

  var dataDict = {
    //campus: personCampus,
    timestamp: Date.now(),
    location: location,
    state: state,
    mac: snapshot.mac,
    //picture: personPictureURL,
    //mac: snapshot.mac,
    gatewayFree: snapshot.gatewayFree,
    gatewayLoad: snapshot.gatewayLoad,
  };

  return dataDict;
}

function pickLatest(oldValue, potentialNewValue, fallback) {
  if (oldValue == undefined) {
    oldValue = fallback;
  }

  if (potentialNewValue === undefined) {
    potentialNewValue = fallback;
  }

  if (potentialNewValue === "") {
    potentialNewValue = fallback;
  }

  if (potentialNewValue == fallback) {
    ret = oldValue;
  } else {
    ret = potentialNewValue;
  }
  console.log(oldValue, potentialNewValue, fallback, ret);
  return ret;
}
