import Constants from "expo-constants";



export default {
	FirebaseConfig: {
		apiKey: Constants.manifest.web.config.firebase.apiKey,
		measurementId: Constants.manifest.web.config.firebase.measurementId,
		authDomain: Constants.manifest.web.config.firebase.authDomain,
		databaseURL: Constants.manifest.web.config.firebase.databaseURL,
		projectId: Constants.manifest.web.config.firebase.projectId,
		storageBucket: Constants.manifest.web.config.firebase.storageBucket,
		appId: Constants.manifest.web.config.firebase.appId
	}
};
