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

    } catch (e) {
      console.log("catch error body:", e.message);
      //console.error(e.message);
    }
  }
}

export default Firebase;
