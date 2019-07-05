
import { combineReducers } from 'redux';


import user from './user';
import drawer from './drawer';
import attendanceSearch from './attendanceSearch';

export default combineReducers({
  drawer, user, attendanceSearch
});
