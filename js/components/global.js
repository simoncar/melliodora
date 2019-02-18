import { Constants } from 'expo';


export function formatTime(starttime, endtime) {
  var ret = '';

  if(starttime === null && typeof starttime === "object" ) {
    ret = ''
  } else {
    if (undefined != starttime && starttime.length > 0 ){
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


  if(eventDate === null && typeof eventDate === "object" ) {
    ret = ''
  } else {
    if (undefined != eventDate && eventDate.length > 1){
      var d = new Date(eventDate);
      var ret = monthNames[d.getMonth()] + " " + d.getDate();
  } else {
    ret = ''
    }

  }
  return (ret);
};

export function getAbbreviations(eventDetails) {
  var ret = '';

if (eventDetails.includes("UE")) {
ret = ret + '\nUE - Upper Elementary (Grade 3 to Grade 5) '
}

if (eventDetails.includes("LE")) {
ret = ret + '\nLE - Lower Elementary (Kindergarten 2 to Grade 2) '
}

if (eventDetails.includes("EY")) {
ret = ret + '\nEY - Early Years (Pre-Nursery to Kindergarten 1)  '
}

if (eventDetails.includes("SS")) {
ret = ret + '\nSS - Senior School (Grade 6 and up) '
}

if (eventDetails.includes("HS")) {
ret = ret + '\nHS - High School (Grades 9 - 12) '
}

if (eventDetails.includes("MS")) {
ret = ret + '\nMS - Middle School (Grades 6- 8)'
}

if (eventDetails.includes("AP") && !eventDetails.includes("MAP") ) {
ret = ret + '\nAP - Advanced Placement '
}

if (eventDetails.includes("DP")) {
ret = ret + '\nDP - Diploma Program '
}

if (eventDetails.includes("CCA")) {
ret = ret + '\nCCA - Co Curricular activities '
}

if (eventDetails.includes("PTA")) {
ret = ret + '\nPTA - Parent Teacher Association  '
}

if (eventDetails.includes("PYP")) {
ret = ret + '\nPYP - Primary Years Program '
}

if (eventDetails.includes("MYP")) {
ret = ret + '\nMYP - Middle Years Program '
}

if (eventDetails.includes("PTC")) {
ret = ret + '\nPTC - Parent Teacher Conferences '
}

if (eventDetails.includes("CIS")) {
ret = ret + '\nCIS - Community Information Session '
}

if (eventDetails.includes("MAP")) {
ret = ret + '\nMAP - Measure of Academic Progress '
}

if (eventDetails.includes("ELV")) {
ret = ret + '\nELV - Early Learning Village '
}


if (eventDetails.includes("S.E.A")) {
ret = ret + '\nSEA - South East Asia'
}


return (ret)
};



export function getParameterByName(name, url) {
  
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function isAdmin(sPass) {

   const adminDevices =
      [
        '3C57D89E-B681-48D0-B5A9-B2C2E5530F3B', 
        '7C62DC60-A3B6-41F1-BC09-0A2C9147C1BD',
        '439F507C-8227-4594-92B3-1779E6ED69D0',
        '5DDB6D11-46F0-4B6D-8530-8AA29F1C9B2C',
        'CA652277-05BA-45AB-9142-78F924613A29',
        '68855F63-EB66-4D78-A2C9-BCC042712EE7',
        '934476B1-9DEA-4D9A-A951-412FC3FBA849',
        'D3365EB3-FA2E-4092-9FEB-35FC26414A9E',   // simulator
        '1FD9DD3C-03A5-4596-8405-F943BB6A40D4',
      ];

    const installationId = (adminDevices.indexOf(Constants.installationId) > -1);
    const deviceId = (adminDevices.indexOf(Constants.deviceId) > -1);
    const adminPass = (sPass === 'cookies');

    console.log ("installationId=",installationId);
    console.log ("deviceId=",deviceId);
    console.log (Constants.deviceId);
    console.log ("return", installationId || deviceId);
    console.log ("adminPass", sPass);

    isAdminDevice = installationId || deviceId || adminPass;

  return isAdminDevice;
}
