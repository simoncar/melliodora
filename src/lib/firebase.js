import * as firebase from "firebase";
import ApiKeys from "../ApiKeys";

class Firebase {
	static initialise() {

		return new Promise(function (resolve) {
			try {
				if (!firebase.apps.length) {
					firebase.initializeApp(ApiKeys.FirebaseConfig);
					resolve(1);
				} else {
					resolve(1);
				}
			} catch (e) {
				//console.error(e.message);
			}
		});

	}
}

export default Firebase;
