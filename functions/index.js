const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp(functions.config().firebase);

//const CUT_OFF_TIME = 2 * 60 * 60 * 1000;  - 2 hours

const CUT_OFF_TIME = 2 * 60 * 60 * 1000; //  - 2 hours

// https://firebase.google.com/docs/functions/get-started
// firebase deploy (from root)
// send the push notification

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

    const newPing = admin
      .database()
      .ref(
        `instance/0001-sais_edu_sg/chat/chatroom/` + beaconName + "/messages"
      );

    newPing.push({
      //mute: false,
      chatroom: beaconName,
      text: "Ping - Woodleigh - Gate 1 - Security Hub",
      createdAt: Date.now(),
      date: Date.now(),
      system: true,
      user: {
        name: "Gate 1 - Security Hub"
      }
    });

    return null;
  });

const moment = require("moment");
const cors = require("cors")({
  origin: true
});

exports.deleteOldItems = functions.database
  .ref("instance/0001-sais_edu_sg/beacon/{pushId}")
  .onWrite(async change => {
    const ref = change.after.ref.parent; // reference to the parent
    const now = Date.now();
    const cutoff = now - 100000; //CUT_OFF_TIME;
    const oldItemsQuery = ref.orderByChild("timestamp").endAt(cutoff);
    const snapshot = await oldItemsQuery.once("value");
    // create a map with all children that need to be removed

    const updates = {};

    snapshot.forEach(child => {
      if (child.child("timestamp").val() != null) {
        updates[child.key] = {
          lastSeen: Date.now(),
          timestamp: null
        };
      }
    });
    // execute all updates in one go and return the result to end the function
    return ref.update(updates);
  });

exports.registerBeacon = functions.https.onRequest((req, res) => {
  // https://us-central1-calendar-app-57e88.cloudfunctions.net/registerBeacon
  // https://script.google.com/macros/s/AKfycbwhrlEfQhiSgcsF6AM_AlaMWxU7SsEtJ-yQpvthyQTT1jui588E/exec

  if (req.method === "PUT") {
    return res.status(403).send("Forbidden!");
  }

  return cors(req, res, () => {
    let format = req.query.format;
    if (!format) {
      format = req.body.format;
    }
    const formattedDate = moment().format(format);
    // console.log("Sending Formatted date:", formattedDate);
    // console.log("Sending Formatted body:", req.body);

    var beacons = req.body;
    beacons.forEach(function(snapshot) {
      console.log("some data:", snapshot.mac);
      const beacon = admin
        .database()
        .ref(`instance/0001-sais_edu_sg/beacon/` + snapshot.mac);
      var personName = "";
      var personType = "";
      var personCampus = "";
      var personGrade = "";
      var personPictureURL = "";

      switch (snapshot.mac) {
        case "AC233F292EB0":
          personName = "Ryan Windebank";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "7";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-10-12.17.21.png";
          break;
        case "AC233F292E3E":
          personName = "Mohd Yusoff";
          personType = "Staff";
          personCampus = "Woodleigh - Gate 1";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Yusoff.jpeg";
          break;
        case "AC233F292E9A":
          personName = "Simon Cariss";
          personType = "Parent";
          personCampus = "Woodleigh - Gate 1";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/27993517_10156308333051494_4863829502063215688_o.jpg";

          break;
        case "AC233F29148B":
          personName = "Lucy Cariss";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "4";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/lucyprofilepic.jpeg";

          break;
        case "AC233F291488":
          personName = "Ben Cariss";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "2";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/benprofilepic.jpeg";

          break;
        case "AC233F292F52":
          personName = "Christina Thorsen";
          personType = "Parent";
          personCampus = "Woodleigh - Gate 1";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-19.07.22.png";
          break;
        case "AC233F29148A":
          personName = "Kayla Thorsen";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "4";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-19.10.12.png";

          break;
        case "AC233FC03164":
          personName = "GATEWAY 1";
          personType = "Asset";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "A";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/minew_G1.png";
          break;
        case "AC233F2916CD":
          personName = "Elliot Simpson";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "12";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-21.55.34.png";
          break;
        case "AC233F2916C8":
          personName = "张伟 Zhang Wei";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "4";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-21.57.10.png";
          break;
        case "AC233F2915A9":
          personName = "王秀英 Wang Xiu Ying";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "4";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-22.23.26.png";
          break;
        case "AC233F2915C5":
          personName = "Angeline Tomlissanra";
          personType = "Student";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "4";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-22.21.19.png";
          break;
        case "AC233F292FDD":
          personName = "Visitor Woodleigh";
          personType = "Visitor";
          personCampus = "Woodleigh - Gate 1";
          personGrade = "4";
          personPictureURL =
            "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-22.21.19.png";
          break;
        default:
          personName = "(Not registered with Name)";
          personType = snapshot.mac;
          personCampus = "Woodleigh - Gate 1";
      }

      beacon.update({
        //mute: false,
        beaconName: personName,
        beaconType: personType,
        beaconCampus: personCampus,
        beaconGrade: personGrade,
        beaconPictureURL: personPictureURL,
        timestamp: Date.now()
      });
    });

    res.status(200).send(req.body);
    // [END sendResponse]
  });
});
// [END all]
