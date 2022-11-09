import "expo-firestore-offline-persistence";
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw",
	authDomain: "calendar-app-57e88.firebaseapp.com",
	databaseURL: "https://calendar-app-57e88.firebaseio.com",
	projectId: "calendar-app-57e88",
	storageBucket: "calendar-app-57e88.appspot.com",
	messagingSenderId: "sender-id",
	appId: "1:991350571487:web:64e8030d8ad0c20969c46a",
	measurementId: "G-0T769CEZVP"
};

const app = initializeApp(firebaseConfig);

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

export default app;
