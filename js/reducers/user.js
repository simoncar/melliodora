/* js/reducers/user.js */

import type {Action} from '../actions/types';


const initialState = {
  isLoggedIn: false,
  hasSkippedLogin: false,
  sharedSchedule: null,
  id: null,
  name: '',
  password: '',
  pushToken: '',
  items: []
};

// some ES6 initialisation technique if state is not passed to reducer

function userReducer(state: State = initialState, action: Action): State {
  if (action.type === 'LOGGED_IN') {
    let {id, name, sharedSchedule} = action.data;
    console.log('reducer - LOGGED_IN');
    return {
      isLoggedIn: true,
      hasSkippedLogin: false,
      sharedSchedule,
      id,
      name,
      password,
      pushToken,
      items
    };
  }
  if (action.type === 'SKIPPED_LOGIN') {
    console.log('reducer - SKIPPED_LOGIN');
    return {
      isLoggedIn: false,
      hasSkippedLogin: true,
      sharedSchedule: null,
      id: null,
      name: '',
      password: '',
      pushToken: '',
      items
    };
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }

  if (action.type === 'SET_NAME') {
    return initialState;
  }

  if (action.type === 'SET_AUTH_SECRET') {
      console.log('user reducer - SET_AUTH_SECRET ' + action.payload);
    return {
      ...state,
      authSecret: action.payload,
    };
  }

  if (action.type === 'SET_LOGIN_DETAILS') {
      console.log('user reducer - SET_LOGIN_DETAILS');
    return {
      ...state,
      name: action.payload,
    };
  }
  if (action.type === 'SET_NICKNAME_DETAILS') {
    console.log('user reducer - SET_NICKNAME_DETAILS');
  return {
    ...state,
    nickname: action.payload,
  };
  }
  if (action.type === 'SET_PUSH_TOKEN') {
    console.log('user reducer - SET_PUSH_TOKEN');
  return {
    ...state,
    pushToken: action.payload,
  };
  }
  if (action.type === 'SET_ADMINPASSWORD_DETAILS') {
    console.log('user reducer - SET_ADMINPASSWORD_DETAILS');
  return {
    ...state,
    adminPassword: action.payload,
  };
  }

  if (action.type === 'SET_PASSWORD') {
      console.log('user reducer - SET_PASSWORD');
    return {
      ...state,
      password: action.payload,
    };
  }
  if (action.type === 'SET_AUTH_DEVICE_ID') {
      console.log('reducer - SET_AUTH_DEVICE_ID');
    return {
      ...state,
      ffauth_device_id: action.payload,
    };
  }
  if (action.type === 'SET_AUTH_SECRET') {
      console.log('reducer - SET_AUTH_SECRET');
    return {
      ...state,
      ffauth_secret: action.payload,
    };
  }


  if (action.type === 'SET_CALENDAR_ITEMS') {
      console.log('user reducer - SET_CALENDAR_ITEMS');
    return {
      ...state,
      items: action.payload,
    };
  }

  if (action.type === 'SET_SWITCHES') {
    console.log('user reducer - SET_SWITCHES');
  return {
    ...state,
    items: action.payload,
  };
}



  if (action.type === 'SET_SHARING') {
    return {
      ...state,
      sharedSchedule: action.enabled,
    };
    // immutable state - return new state with old values of state + update to sharedSchedule only
    // https://www.youtube.com/watch?v=7bMTJxvEJiE
  }
  return state;
}

module.exports = userReducer;
