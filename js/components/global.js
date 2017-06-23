
export function formatTime(starttime, endtime) {
  var ret = '';

  if(starttime === null && typeof starttime === "object") {
    ret = ''
  } else {
    var ret = starttime + ' - ' + endtime;
  }
  return (ret);
};
