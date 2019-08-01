import * as firebase from "firebase";
import ApiKeys from "../ApiKeys";

class Firebase {
  static initialise() {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(ApiKeys.FirebaseConfig);
      }

      firebase
        .auth()
        .signInAnonymously()
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    } catch (e) {
      console.log("catch error body:", e.message);
      //console.error(e.message);
    }
    
    try {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
        } else {
          // User is signed out.
        }
      });
    } catch (e) {
      console.log("catch error body:", e.message);
      //console.error(e.message);
    }
  }
}

export default Firebase;
