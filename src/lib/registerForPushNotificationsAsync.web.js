
class registerForPush {
	static reg(user) {
		registerForPushNotificationsAsync(user);
	}
}

async function registerForPushNotificationsAsync(user) {
	// Android remote notification permissions are granted during the app
	// install, so this will only ask on iOS

	let token = "DENIED-WEB";

	let safeToken = token.replace("[", "{");
	safeToken = safeToken.replace("]", "}");

	global.pushToken = token;
	global.safeToken = safeToken;
}

export default registerForPush;
