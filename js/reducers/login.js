import createReducer from '../lib/createReducer'
import * as types from '../actions/types'



export const recipeCount = createReducer(0, {
  [types.SET_SEARCHED_RECIPES](state,action){
        console.log('reducer - SET_SEARCHED_RECIPES');
    return action.recipes.length;
  },

  [types.ADD_RECIPE](state,action){
        console.log('reducer - ADD_RECIPE');
    return state+1;
  },

  [types.SET_LOGIN_DETAILS](state,action){
        console.log('reducer - SET_LOGIN_DETAILS');
    return state+1;
  },


    [types.SET_NAME](state,action){
          console.log('reducer - SET_NAME');
      return 'Max';
    },

})



export const name = createReducer(0, {
  

    [types.SET_NAME](state,action){
          console.log('reducer - SET_NAME');
      return 'Max';
    },

})
