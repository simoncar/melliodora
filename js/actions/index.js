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
