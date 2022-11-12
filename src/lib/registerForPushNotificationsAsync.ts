import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import firebase from "../lib/firebase";
import _ from "lodash";

class registerForPush {
	static reg(user) {
		registerForPushNotificationsAsync(user);
	}
}

async function registerForPushNotificationsAsync(user) {
	let token = "DENIED";

	console.log("PERMISSIONS : registerForPushNotificationsAsync");

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
	} else {
		//alert("Must use physical device for Push Notifications");
		token = "ExponentPushToken[YQNwZDOkv0QdHUlDV-T5HQ]"; // override simulator with simon's iphone
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C"
		});
	}

	let safeToken = token.replace("[", "{");
	safeToken = safeToken.replace("]", "}");

	global.pushToken = token;
	global.safeToken = safeToken;

	if (undefined == global.name) {
		global.name = "";
	}
	if (!_.isNil(global.uid)) {
		var userDict = {
			token,
			safeToken
		};

		firebase.firestore().collection(global.domain).doc("user").collection("usernames").doc(global.uid).set(userDict, { merge: true });
	}
}

export default registerForPush;
