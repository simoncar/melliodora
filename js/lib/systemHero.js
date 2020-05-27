import firebase from "firebase";
import _ from "lodash";
import moment from "moment";

export const logToCalendar = async function (key, title, body, email = "") {
	try {
		const p = new Promise(function (resolve, reject) {
			const timestamp = firebase.firestore.Timestamp.now();

			var dataDict = {
				summary: _.isNil(title) ? "" : title,
				description: _.isNil(body) ? "" : body + "\n\nMost Recent User : " + email,
				dtstamp: "202020202020202",
				date_start: moment().format("YYYY-MM-DD"),
				icon: "ios-play",
				color: "blue",
				location: body,
				number: firebase.firestore.FieldValue.increment(1),
			};

			firebase
				.firestore()
				.collection("smartcookies_system_hero")
				.doc("calendar")
				.collection("calendarItems")
				.doc(moment().format("YYYYMMDD") + "-" + key)
				.set(dataDict, { merge: true });
		});

		const result = await p;
		return result;
	} catch (err) {
		console.log("system hero error", err);
	}
};
