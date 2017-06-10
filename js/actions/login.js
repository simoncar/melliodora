import * as types from './types'
import Api from '../lib/api'

function fetchReceipes(ingredients) {
  return (dispatch, getState) => {

    const params = [
         `i=${encodeURIComponent(ingredients)}`,
         'p=1'
       ].join('&')
       return Api.get(`/api/?${params}`).then(resp => {
         dispatch(setSearchedRecipes({recipes: resp}));
       }).catch( (ex) => {
         console.log(ex);
       });

  }
}

function setSearchedRecipes({ recipes }) {
  return {
    type: types.SET_SEARCHED_RECIPES,
    recipes,
  }
}

function addRecipe() {
  return {
    type: types.ADD_RECIPE,
  }
}

function setUsername(username) {
console.log('Actions > setUsername', username);

  return {
    type: "SET_LOGIN_DETAILS",
    payload: username
  };
}

function setPassword(password) {
console.log('Actions > setPassword', password);

  return {
    type: "SET_PASSWORD",
    payload: password
  };
}



function logIn(source: ?string): ThunkAction {
  return (dispatch) => {
console.log('Actions > login');
  // do some stuff

    return login;
  };
}



function skipLogin(): Action {
  console.log('skip login - action');
  return {
    type: 'SKIPPED_LOGIN',
  };
}



function logOut(): ThunkAction {
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

module.exports = {setUsername,setPassword, skipLogin, logOut,addRecipe,setSearchedRecipes,fetchReceipes};
