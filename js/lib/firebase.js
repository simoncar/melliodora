import * as firebase from "firebase";
import ApiKeys from "../ApiKeys";
import { AsyncStorage } from "react-native";
import _ from "lodash";

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
          console.log("Auth = ", uid);

          // store the auth as a valid user
          global.uid = uid;

          let ref = firebase
            .firestore()
            .collection("sais_edu_sg")
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

                console.log("GLOBAL EMAIL - ", global.email);

                if (_.isArray(docData.gradeNotify)) {
                  for (var i = -4; i < 13; i++) {
                    if (_.isNumber(docData.gradeNotify[i])) {
                      console.log("loop=", docData.gradeNotify[i]);
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
          console.log("safeToken=", safeToken);

          if (_.isNil(safeToken)) {
            safeToken = "";
          }

          var userDict = {
            uid: uid,
            token,
            safeToken,
            loginCount: firebase.firestore.FieldValue.increment(1),
          };

          try {
            console.log(safeToken);
            firebase
              .firestore()
              .collection("sais_edu_sg")
              .doc("user")
              .collection("usernames")
              .doc(uid)
              .set(userDict, { merge: true });
          } catch (error) {
            console.log(error);
            // Error saving data
          }
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
