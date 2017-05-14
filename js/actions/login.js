import * as types from './types'
import Api from '../lib/api'

export function fetchReceipes(ingredients) {
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
export function setSearchedRecipes({ recipes }) {
  return {
    type: types.SET_SEARCHED_RECIPES,
    recipes,
  }
}

export function addRecipe() {
  return {
    type: types.ADD_RECIPE,
  }
}

export function setLoginDetails(username) {
console.log(username);
  return {
    type: types.SET_LOGIN_DETAILS

  }
}
