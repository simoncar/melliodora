
import { combineReducers } from 'redux';
import * as loginReducer from './login';

import user from './user';
import drawer from './drawer';

export default combineReducers({
  drawer, user
});
