export const SET_ATTENDANCE_SEARCH = "SET_ATTENDANCE_SEARCH";

export function setAttendanceSearch(searchTerm) {
  console.log("Actions > setAttendanceSearch", searchTerm);

  return {
    type: SET_ATTENDANCE_SEARCH,
    payload: searchTerm
  };
}
