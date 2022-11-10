import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";




import ApiKeys from "../ApiKeys";

firebase.apps.length === 0 && firebase.initializeApp(ApiKeys.FirebaseConfig);

// //Firebase Firestore Persistance
// firebase
// 	.firestore()
// 	.enablePersistence()
// 	.then(() => {
// 		//console.log("enablePersistence SUCCESS");
// 	})
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
