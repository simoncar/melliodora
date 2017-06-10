
import { combineReducers } from 'redux';


import user from './user';
import drawer from './drawer';

export default combineReducers({
  drawer, user
});
