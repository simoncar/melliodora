import Constants from "expo-constants";

export default {
	FirebaseConfig: {
		apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw",
		measurementId: Constants.manifest?.web?.config?.firebase?.measurementId,
		authDomain: Constants.manifest?.web?.config?.firebase?.authDomain,
		databaseURL: Constants.manifest?.web?.config?.firebase?.databaseURL,
		projectId: "calendar-app-57e88",
		storageBucket: Constants.manifest?.web?.config?.firebase?.storageBucket,
		appId: Constants.manifest?.web?.config?.firebase?.appId
	}
};
