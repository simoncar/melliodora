import { combineReducers } from "redux";

import user from "./user";
import attendanceSearch from "./attendanceSearch";

export default combineReducers({
  user,
  attendanceSearch,
});
