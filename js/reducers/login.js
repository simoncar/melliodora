import createReducer from '../lib/createReducer'
import * as types from '../actions/types'



export const recipeCount = createReducer(0, {
  [types.SET_SEARCHED_RECIPES](state,action){
    return action.recipes.length;
  },

  [types.ADD_RECIPE](state,action){
    return state+1;
  },

})
