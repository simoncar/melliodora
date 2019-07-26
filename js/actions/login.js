import * as types from "./types";

function setUsername(username) {
  console.log("Actions > setUsername", username);

  return {
    type: "SET_LOGIN_DETAILS",
    payload: username,
  };
}

function setAdminPassword(adminPassword) {
  console.log("Actions > setAdminPassword", adminPassword);

  return {
    type: "SET_ADMINPASSWORD_DETAILS",
    payload: adminPassword,
  };
}

function setNickname(nickname) {
  console.log("Actions > setNickname", nickname);

  return {
    type: "SET_NICKNAME_DETAILS",
    payload: nickname,
  };
}

function setPushToken(pushToken) {
  console.log("Actions > setPushToken", pushToken);

  return {
    type: "SET_PUSH_TOKEN",
    payload: pushToken,
  };
}

function setauthSecret(authSecret) {
  console.log("Actions > setauthSecret", authSecret);

  return {
    type: "SET_AUTH_SECRET",
    payload: authSecret,
  };
}

function setPassword(password) {
  console.log("Actions > setPassword", password);

  return {
    type: "SET_PASSWORD",
    payload: password,
  };
}

function logIn(source: ?string): ThunkAction {
  return dispatch => {
    console.log("Actions > login");
    // do some stuff

    return login;
  };
}

function skipLogin(): Action {
  console.log("skip login - action");
  return {
    type: "SKIPPED_LOGIN",
  };
}

function logOut(): ThunkAction {
  return dispatch => {
    Parse.User.logOut();
    FacebookSDK.logout();
    updateInstallation({ user: null, channels: [] });

    // TODO: Make sure reducers clear their state
    return dispatch({
      type: "LOGGED_OUT",
    });
  };
}

module.exports = {
  setUsername,
  setPushToken,
  setPassword,
  setAdminPassword,
  setauthSecret,
  skipLogin,
  logOut,
  addRecipe,
  setSearchedRecipes,
  fetchReceipes,
};
