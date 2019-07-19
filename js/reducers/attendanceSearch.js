/* js/reducers/user.js */

const initialState = {
  attendanceSearchTerm: ""
};

// some ES6 initialisation technique if state is not passed to reducer

function attendanceSearchReducer(state = initialState, action) {
  if (action.type === "SET_ATTENDANCE_SEARCH") {
    console.log("SET_ATTENDANCE_SEARCH payload", action.payload);
    return {
      ...state,
      attendanceSearchTerm: action.payload
    };
  }
  return state;
}

export default attendanceSearchReducer;
