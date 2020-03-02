import firebase from "firebase";
import _ from "lodash";
import moment from "moment";

exports.logToCalendar = async function(key, title, body) {
  try {
    const p = new Promise(function(resolve, reject) {
      const timestamp = firebase.firestore.Timestamp.now();

      var dataDict = {
        summary: _.isNil(title) ? "" : title,
        description: _.isNil(body) ? "" : body,
        dtstamp: "202020202020202",
        date_start: moment().format("YYYY-MM-DD"),
        icon: "ios-play",
        color: "blue",
        location: body,
        number: firebase.firestore.FieldValue.increment(1)
      };

      firebase
        .firestore()
        .collection("smartcookies_system_hero")
        .doc("calendar")
        .collection("calendarItems")
        .doc(moment().format("YYYYMMDD") + "-" + key)
        .set(dataDict, { merge: true });
      console.log("LOGGING COMPLETE AAA");
    });

    console.log("LOGGING COMPLETE BBB");

    const result = await p;
    return result;
  } catch (err) {
    console.log("sytsem hero error", err);
  }
};
