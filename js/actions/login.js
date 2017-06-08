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

function setLoginDetails(username) {
console.log('Actions > setLoginDetails', username);

  return {
    type: types.SET_LOGIN_DETAILS

  }

}


function logIn(source: ?string): ThunkAction {
  return (dispatch) => {

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

module.exports = {setLoginDetails, skipLogin, logOut,addRecipe,setSearchedRecipes,fetchReceipes};
