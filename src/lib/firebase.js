import * as firebase from "firebase";
import ApiKeys from "../ApiKeys";
import { AsyncStorage } from "react-native";
import _ from "lodash";
import * as Localization from "expo-localization";
import Constants from "expo-constants";

class Firebase {
  static initialise() {

    return new Promise(function (resolve, reject) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(ApiKeys.FirebaseConfig);
          resolve(1);
        } else {
          resolve(1);
        }
      } catch (e) {
        console.log("firebase catch error:", e.message);
        //console.error(e.message);
      }
    });

  }
}

export default Firebase;
