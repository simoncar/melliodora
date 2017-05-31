
import { combineReducers } from 'redux';
import * as loginReducer from './login';
import * as userReducer from './user';

import drawer from './drawer';

export default combineReducers({
  drawer, userReducer
});
