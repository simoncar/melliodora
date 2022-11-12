import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

import ApiKeys from "../ApiKeys";

firebase.apps.length === 0 && firebase.initializeApp(ApiKeys.FirebaseConfig);

export default firebase;
