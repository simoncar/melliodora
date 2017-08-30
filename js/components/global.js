
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


export function formatMonth(eventDate) {
  var ret = '';

  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var d = new Date(eventDate);

  if(eventDate === null && typeof eventDate === "object" ) {
    ret = ''
  } else {
    if (undefined != eventDate){
      var ret = monthNames[d.getMonth()] + " " + d.getDate();
  } else {
    ret = ''
    }

  }
  return (ret);
};
