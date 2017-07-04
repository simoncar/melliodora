
export function formatTime(starttime, endtime) {
  var ret = '';

  if(starttime === null && typeof starttime === "object" ) {
    ret = ''
  } else {
    if (undefined != starttime){
      var ret = starttime + ' - ' + endtime;
  } else {
    ret = ''
    }

  }
  return (ret);
};
