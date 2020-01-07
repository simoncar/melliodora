import * as firebase from "firebase";
import ApiKeys from "../ApiKeys";
import { AsyncStorage } from "react-native";
import _ from "lodash";
import * as Localization from "expo-localization";
import Constants from "expo-constants";

class Firebase {
  static async initialise() {
    try {
      if (!firebase.apps.length) {
        await firebase.initializeApp(ApiKeys.FirebaseConfig);
      }


      this.SetupUser();

    } catch (e) {
      console.log("catch error body:", e.message);
      //console.error(e.message);
    }
  }

  static SetupUser() {
    try {
      firebase.auth().onAuthStateChanged(async function (user) {
        if (user && !user.isAnonymous) {
          console.log("global.domain node", global.domain);
          user.getIdTokenResult()
            .then((idTokenResult) => {
              console.log("claims", idTokenResult.claims)
              console.log("idTokenResult.claims[global.domain]", idTokenResult.claims[global.domain]);
              console.log("global.domain", global.domain);
              if (idTokenResult.claims[global.domain]) {
                console.log("xx", user.email);
                global.email = user.email;
              }
            });
        } else {
          console.log("not sign in xxxx");
          await firebase
            .auth()
            .signInAnonymously()
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // ...
            });
        }
      });
    } catch (e) {
      console.log("catch error body:", e.message);
    }
  }
}

export default Firebase;
