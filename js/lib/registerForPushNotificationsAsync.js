import React, { Component } from "react";
import { Permissions, Notifications } from "expo";
import Constants from "expo-constants";
import * as firebase from "firebase";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../actions";

let instID = Constants.manifest.extra.instance;

const PUSH_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwhrlEfQhiSgcsF6AM_AlaMWxU7SsEtJ-yQpvthyQTT1jui588E/exec";
const installationID = Constants.installationId;

class registerForPush {
  static reg(user) {
    registerForPushNotificationsAsync(user);
    ActionCreators.setPushToken("token");
  }
}

async function registerForPushNotificationsAsync(user) {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS

  let token = "DENIED";

  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // Get the token that uniquely identifies this device
  if (!Constants.isDevice) {
    token = "ExponentPushToken[YQNwZDOkv0QdHUlDV-T5HQ]"; // override simulator with simon's iphone
  } else {
    token = await Notifications.getExpoPushTokenAsync();

    // Stop here if the user did not grant permissions
    if (status !== "granted") {
      return;
    }
  }

  global.pushToken = token;

  let safeToken = token.replace("[", "{");
  safeToken = safeToken.replace("]", "}");
  global.safeToken = safeToken;

  this.storyRef = firebase
    .database()
    .ref(`instance/${instID}/user/${safeToken}`);
  this.storyRef.update({
    token,
    user
  });

  var userDict = {
    id: safeToken,
    email: global.username,
  };

  firebase
    .firestore()
    .collection("sais_edu_sg")
    .doc("user")
    .collection("usernames")
    .doc(safeToken)
    .set(userDict);

  firebase
    .firestore()
    .collection("sais_edu_sg")
    .doc("user")
    .collection("loginHistory")
    .doc(safeToken)
    .set(userDict);

  console.log("jhere=", safeToken);
  console.log("jhere=", user);
  console.log ("username=",global.username);

  // POST the token to our backend so we can use it to send pushes from there
  return fetch(`${PUSH_ENDPOINT}?token=${token}&user=${user}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: {
        value: token
      },
      user: {
        username: user
      },
      installationID: {
        installationID
      }
    })
  });
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  userX: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(registerForPush);
