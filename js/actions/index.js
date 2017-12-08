//import * as LoginActions from './login';
//import * as DrawerActions from './drawer';

import Api from '../lib/api'
import type { Action } from './types';


export function openDrawer():Action {
  return {
    type: 'OPEN_DRAWER',
  };
}

export function closeDrawer():Action {
  return {
    type: 'CLOSE_DRAWER',
  };
}

export function setffauth_device_id(ffauth_device_id) {
  return {
    type: "SET_AUTH_DEVICE_ID",
    payload: ffauth_device_id
  };
}

export function setffauth_secret(ffauth_secret) {
  return {
    type: "SET_AUTH_SECRET",
    payload: ffauth_secret
  };
}

export function setUsername(username) {
  return {
    type: "SET_LOGIN_DETAILS",
    payload: username
  };
}

export function setPassword(password) {
  return {
    type: "SET_PASSWORD",
    payload: password
  };
}

export function setCalendarItems(items) {
console.log('saved setCalendarItems')
  return {
    type: "SET_CALENDAR_ITEMS",
    payload: items
  };
}

export function logIn(source: ?string): ThunkAction {
  return (dispatch) => {
    return login;
  };
}

export function skipLogin(): Action {
  return {
    type: 'SKIPPED_LOGIN',
  };
}

export function logOut(): ThunkAction {
  return (dispatch) => {
    Parse.User.logOut();
    FacebookSDK.logout();
    updateInstallation({user: null, channels: []});

    // TODO: Make sure reducers clear their state
    return dispatch({
      type: 'LOGGED_OUT',
    });
  };
}
