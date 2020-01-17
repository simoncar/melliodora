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

      const user = firebase.auth().currentUser;

      if (!user) {
        this.signInAnonymously();
      }

    } catch (e) {
      console.log("catch error body:", e.message);
      //console.error(e.message);
    }
  }

  static async signInAnonymously() {
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

  static async initUser(user, isAnonymous) {
    var uid = user.uid;
    console.log("Auth = ", uid);

    // store the auth as a valid user
    global.uid = uid;
    await firebase
      .firestore()
      .collection(global.domain)
      .doc("user")
      .collection("usernames")
      .doc(uid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          var docData = doc.data();

          if (_.isString(docData.name)) {
            AsyncStorage.setItem("name", docData.name);
            global.name = docData.name;
          } else {
            global.name = "";
          }

          if (_.isString(docData.email)) {
            AsyncStorage.setItem("email", docData.email);
            global.email = docData.email;
          } else {
            global.email = "";
          }
          if (_.isBoolean(docData.authenticated)) {
            if (docData.authenticated) {
              global.authenticated = true;
            } else {
            }
          } else {
            global.authenticated = false;
          }

          if (_.isArray(docData.gradeNotify)) {
            for (var i = -4; i < 13; i++) {
              if (_.isNumber(docData.gradeNotify[i])) {
              }
            }
            AsyncStorage.setItem("gradeNotify", JSON.stringify(docData.gradeNotify));
          }
        }
      });

    var token = global.pushToken;

    if (_.isNil(token)) {
      token = "";
    }
    var safeToken = global.safeToken;

    if (_.isNil(safeToken)) {
      safeToken = "";
    }

    console.log("Auth2 = ", uid, global.authenticated, global.name, global.email);
    var version = _.isNil(Constants.manifest.revisionId) ? "unknown" : Constants.manifest.revisionId;
    var userDict = {
      uid: uid,
      token,
      safeToken,
      loginCount: firebase.firestore.FieldValue.increment(1),
      languageSelected: global.language,
      phoneLocale: Localization.locale,
      version: version,
      lastLogin: Date.now(),
      isAnonymous,
      email: user.email
    };
    console.log("uid=", uid);

    firebase
      .firestore()
      .collection(global.domain)
      .doc("user")
      .collection("usernames")
      .doc(uid)
      .set(userDict, { merge: true });
  }

  static SetupUser() {
    try {
      firebase.auth().onAuthStateChanged(async function (user) {
        const isAnonymous = user.isAnonymous;
        if (user && !isAnonymous) {
          console.log("global.domain node", global.domain);
          user.getIdTokenResult()
            .then((idTokenResult) => {
              console.log("claims", idTokenResult.claims)
              console.log("idTokenResult.claims[global.domain]", idTokenResult.claims[global.domain]);
              console.log("global.domain", global.domain);
              if (idTokenResult.claims[global.domain]) {
                Firebase.initUser(user, isAnonymous);
              } else {
                Firebase.signInAnonymously();
              }
            });
        } else if (user && isAnonymous) {

          Firebase.initUser(user, isAnonymous);
        } else {
          Firebase.signInAnonymously();
        }
      });
    } catch (e) {
      console.log("catch error body:", e.message);
    }
  }
}

export default Firebase;
