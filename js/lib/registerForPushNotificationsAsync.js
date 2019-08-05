import React, { Component } from "react";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as firebase from "firebase";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../actions";
import _ from "lodash";

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
    //  ExponentPushToken{LQTd3QIbBBfGdHT6JluSWy}    // simon android - expo
    //  ExponentPushToken{7vlNCrIXB7fBC2d_CDdCbA}    // simon iphone - expo
  } else {
    token = await Notifications.getExpoPushTokenAsync();

    // Stop here if the user did not grant permissions
    if (status !== "granted") {
      return;
    }
  }
  let safeToken = token.replace("[", "{");
  safeToken = safeToken.replace("]", "}");

  global.pushToken = token;
  global.safeToken = safeToken;
  console.log("safeToken2=", safeToken, global.uid);

  if (undefined == global.username) {
    global.username = "";
  }
  if (!_.isNil(global.uid)) {
    var userDict = {
      token,
      safeToken,
    };

    firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("user")
      .collection("usernames")
      .doc(uid)
      .set(userDict, { merge: true });
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  userX: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(registerForPush);
