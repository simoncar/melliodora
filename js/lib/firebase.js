import * as firebase from "firebase";
import ApiKeys from "../ApiKeys";
import { AsyncStorage } from "react-native";
import _ from "lodash";

class Firebase {
  static async initialise() {
    try {
      if (!firebase.apps.length) {
        await firebase.initializeApp(ApiKeys.FirebaseConfig);
      }

      await firebase
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
      await firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          var uid = user.uid;
          console.log("Auth = ", uid);

          // store the auth as a valid user
          global.uid = uid;
          await firebase
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
                  console.log("firebase.js AsyncStorage.setItem('name', docData.name);", docData.name);
                  global.name = docData.name;
                } else {
                  global.name = "";
                }

                if (_.isString(docData.email)) {
                  AsyncStorage.setItem("email", docData.email);
                  console.log("firebase.js AsyncStorage.setItem('email', docData.email);", docData.email);
                  global.email = docData.email;
                } else {
                  global.email = "";
                }
                console.log("A");
                if (_.isBoolean(docData.authenticated)) {
                  console.log("B", _.isBoolean(docData.authenticated));

                  if (docData.authenticated) {
                    console.log("C", docData.authenticated);

                    AsyncStorage.setItem("authenticated", "true");
                    global.authenticated = true;
                  } else {
                    console.log("D");
                  }
                } else {
                  global.authenticated = false;
                }

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

          if (_.isNil(safeToken)) {
            safeToken = "";
          }

          console.log("Auth2 = ", uid, global.authenticated, global.name, global.email);

          var userDict = {
            uid: uid,
            token,
            safeToken,
            loginCount: firebase.firestore.FieldValue.increment(1),
          };

          try {
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
    }
  }
}

export default Firebase;
