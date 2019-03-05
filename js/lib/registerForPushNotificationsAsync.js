import React, { Component } from 'react';
import { Permissions, Notifications, Constants } from 'expo';
import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as ActionCreators from '../actions';

var instID = Constants.manifest.extra.instance;

const PUSH_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwhrlEfQhiSgcsF6AM_AlaMWxU7SsEtJ-yQpvthyQTT1jui588E/exec';
const installationID = Constants.installationId;

class registerForPush {

 static reg(user) {
    console.log ("Here")
    this._here;
    registerForPushNotificationsAsync(user);

  };

  _here() {
    console.log("there")
  }
}

async function registerForPushNotificationsAsync (user) {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS

  let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log('REGISTER PUSH TOKEN=', token);

  let safeToken = token.replace("[", "{");
  safeToken = safeToken.replace("]", "}");

  this.storyRef = firebase.database().ref('instance/' + instID + '/user/' + safeToken);
  this.storyRef.update({
    token: token,
    user: user,
  });

  this.props.setNickname('test')

  // POST the token to our backend so we can use it to send pushes from there
  return fetch(PUSH_ENDPOINT + '?token=' + token + '&user=' + user, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
      user: {
        username: user,
      },
      installationID: {
        installationID: installationID,
      },
    }),
  });
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch)
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(registerForPush);
