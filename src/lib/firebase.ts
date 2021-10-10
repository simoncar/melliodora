//import "expo-firestore-offline-persistence";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import ApiKeys from "../ApiKeys";

firebase.apps.length === 0 && firebase.initializeApp(ApiKeys.FirebaseConfig);

//Firebase Firestore Persistance
//.enablePersistence()

firebase.firestore();
// 	// .then(() => {
// 	// 	//console.log("enablePersistence SUCCESS");
// 	// })
// 	.catch(function (err) {
// 		if (err.code === "failed-precondition") {
// 			// Multiple tabs open, persistence can only be enabled
// 			// in one tab at a a time.
// 			// ...
// 			console.log("Multiple tabs open, persistence can only be enabled");
// 		} else if (err.code === "unimplemented") {
// 			// The current browser does not support all of the
// 			// features required to enable persistence
// 			// ...
// 			console.log("The current browser does not support ");
// 		}
// 	});

export default firebase;
