//import * as LoginActions from './login';
//import * as DrawerActions from './drawer';

import Api from '../lib/api'
import type { Action } from './types';

export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export function openDrawer():Action {
console.log ('OPEN_DRAWER');
  return {

    type: OPEN_DRAWER,
  };
}

export function closeDrawer():Action {
  return {
    type: CLOSE_DRAWER,
  };
}


export const actionCreators = Object.assign({},

);



export function setUsername(username) {
console.log('Actions > setUsername', username);

  return {
    type: "SET_LOGIN_DETAILS",
    payload: username
  };
}

export function setPassword(password) {
console.log('Actions > setPassword', password);

  return {
    type: "SET_PASSWORD",
    payload: password
  };
}



export function logIn(source: ?string): ThunkAction {
  return (dispatch) => {
console.log('Actions > login');
  // do some stuff

    return login;
  };
}



export function skipLogin(): Action {
  console.log('skip login - action');
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
