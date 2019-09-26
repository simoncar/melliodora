const ical = require("cal-parser");
const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");
const fetch = require("node-fetch");
var i = 0;

exports.importCalendarToFirestore = async function(admin) {
  //mystamford.edu.sg/parent-dashboard/cal/688/1.ics?secret=5f3746529c14ec40b265e4143278e83c

  https: await clearCalendar(admin, "sais_edu_sg");

  //a-day, b-day
  var myCalendarString = await fetch(
    "https://calendar.google.com/calendar/ical/saisstudent.sg_s67q8ba2vds7omhs96jef3kjhg%40group.calendar.google.com/public/basic.ics",
  ).then(res => res.text());

  await processCalendar(admin, myCalendarString, "red", "sais_edu_sg");

  //events
  var myCalendarString = await fetch(
    "https://calendar.google.com/calendar/ical/saisstudent.sg_ffuma3kaadsjk7p9hvbdd49j50%40group.calendar.google.com/public/basic.ics",
  ).then(res => res.text());

  await processCalendar(admin, myCalendarString, "blue", "sais_edu_sg");

  myCalendarString = await fetch(
    "https://calendar.google.com/calendar/ical/smartcookies.io_eav9rqklnch2nkn2c8c54o57s8%40group.calendar.google.com/private-f39395a3ff51af2a4ea43b4278b30f8d/basic.ics",
  ).then(res => res.text());

  await processCalendar(admin, myCalendarString, "purple", "sais_edu_sg");

  console.log("Clear calendar");
  await clearCalendar(admin, "ais_edu_sg");

  myCalendarString = await fetch(
    "https://calendar.google.com/calendar/ical/smartcookies.io_g2fai3cplgqia62uvia4lhqtug%40group.calendar.google.com/public/basic.ics",
  ).then(res => res.text());

  await processCalendar(admin, myCalendarString, "purple", "ais_edu_sg");

  myCalendarString = await fetch(
    "https://connect.ais.com.sg/parent-dashboard/cal/175/1.ics?secret=48e52b0d3f7b3b4ca76cd496d6577bbf",
  ).then(res => res.text());

  await processCalendar(admin, myCalendarString, "blue", "ais_edu_sg");
};

async function clearCalendar(admin, domain) {
  await admin
    .firestore()
    .collection(domain)
    .doc("calendar")
    .collection("calendarItems")
    .get()
    .then(async snapshot => {
      for (const doc of snapshot.docs) {
        userItem = doc.data();
        await admin
          .firestore()
          .collection(domain)
          .doc("calendar")
          .collection("calendarItems")
          .doc(doc.id)
          .delete();
      }
    });
}
async function processCalendar(admin, myCalendarString, color, domain) {
  //console.log(myCalendarString);

  const parsed = ical.parseString(myCalendarString);

  // Read Calendar Metadata
  //console.log(JSON.stringify(parsed.calendarData));

  // Read Events
  //console.log(JSON.stringify(parsed.events));

  //delete calendar collection first

  for (const doc of parsed.events) {
    i++;
    // if (
    //   doc.summary.value == "School Photos" ||
    //   doc.summary.value == "Middle School Back to School Night" ||
    //   doc.summary.value == "CCA Semester 1 Allocation" ||
    //   doc.summary.value == "College Application Workshops G12" ||
    //   doc.summary.value == "Upper Elementary Back to School Night" ||
    //   doc.summary.value == "Activities Bus Registration Opens"
    // ) {
    var eventCore = {
      summary: _.isNil(doc.summary) ? "" : doc.summary.value,
      location: _.isNil(doc.location) ? "" : doc.location.value,
      description: _.isNil(doc.description) ? "" : doc.description.value,
      dtstamp: _.isNil(doc.dtstamp) ? "" : doc.dtstamp,
      uid: _.isNil(doc.uid) ? "" : doc.uid.value,
      icon: "ios-play",
      color: color,
    };

    //console.log("AAA:", JSON.stringify(doc.summary), JSON.stringify(doc));
    if (!_.isNil(doc.dtend) && !_.isNil(doc.dtend.params) && doc.dtend.params.value == "DATE") {
      var dateEnd = moment(doc.dtend.value);
      var dateStart = moment(doc.dtstart.value);
      var days = dateEnd.diff(dateStart, "days"); // 1
    } else {
      var dateEnd = "";
      days = 1;
    }
    //console.log("doc.dtstart.value=", doc.dtstart.value);
    //Thu Aug 29 2019 02:50:00 GMT-0500 (Central Daylight Time)

    if (_.isNil(doc.dtstart.params)) {
      // time event
      var singleDayEventWithTime = {
        date_time_start: doc.dtstart.value,
        time_start_pretty: moment(doc.dtstart.value)
          .add(+8, "hours")
          .format("h:mm a"),
        time_end_pretty: _.isNil(doc.dtend)
          ? ""
          : moment(doc.dtend.value)
              .add(+8, "hours")
              .format("h:mm a"),
      };
    } else {
      var singleDayEventWithTime = { date_time_start: doc.dtstart.value };
    }

    for (i = 0; i < days; i++) {
      var b = moment(doc.dtstart.value)
        .add(+8, "hours")
        .add(i, "day");
      // console.log("XDATE = ", moment(b).format("YYYY-MM-DD"));
      var dateCore = {
        date_start: moment(b).format("YYYY-MM-DD"),
      };
      const fullEvent = { ...eventCore, ...dateCore, ...singleDayEventWithTime };
      //console.log(JSON.stringify(fullEvent, null, 2));

      await admin
        .firestore()
        .collection(domain)
        .doc("calendar")
        .collection("calendarItems")
        .add(fullEvent);

      console.log("Firebase ADDED");
    }

    // date_start: moment(doc.dtstart.value).format("YYYY-MM-DD"),

    //   console.log(i);
    //   console.log("--------");
    //   console.log("summary:", _.isNil(doc.summary.value) ? "" : doc.summary.value);
    //   console.log("location:", _.isNil(doc.location) ? "" : doc.location.value);
    //   //console.log("description:", _.isNil(doc.description) ? "" : doc.description.value);
    //   console.log("start:", _.isNil(doc.dtstart) ? "" : doc.dtstart.value);
    //   console.log("end1:", _.isNil(doc.dtend) ? "" : doc.dtend.value);
    //   console.log("end2:", moment(dateEnd));
    //   console.log("--------  SSSS >>>> ");
    //   console.log(JSON.stringify(doc, null, 2));
    //   console.log("--------  TTTT >>>> ");
    //   console.log("DAYS = ", days);
    //   console.log(JSON.stringify(doc, null, 2));
    //   console.log(" ---------- ");
    //   console.log(" ");
  }
  //}
}

// var icon
// if (eventDetails.indexOf('music') !== -1) {

//   icon = 'ios-musical-notes'
//   //Logger.log('icon = ' + icon);
// } else if (eventDetails.indexOf("swim")  !== -1) {
//   icon = 'ios-play'
// } else if (eventDetails.indexOf("auditions")  !== -1) {
//   icon = 'ios-bowtie'
// } else if (eventDetails.indexOf("gym")  !== -1) {
//   icon = 'ios-body'
// } else if (eventDetails.indexOf("CCA")  !== -1) {
//   icon = 'ios-play'
// } else if (eventDetails.indexOf("tennis")  !== -1) {
//   icon = 'ios-play'
// } else if (eventDetails.indexOf("assembly")  !== -1) {
//   icon = 'ios-megaphone'
// } else if (eventDetails.indexOf("swim")  !== -1) {
//   icon = 'MaterialCommunityIcons/swim'
// } else if (eventDetails.indexOf("testing")  !== -1) {
//   icon = 'ios-bookmarks'
// } else if (eventDetails.indexOf("football")  !== -1) {
//   icon = 'ios-football'
// } else if (eventDetails.indexOf("tennis")  !== -1) {
//   icon = 'ios-tennisball'
// } else if (eventDetails.indexOf("basketball")  !== -1) {
//   icon = 'ios-basketball'
// } else if (eventDetails.indexOf("coffee")  !== -1) {
//   icon = 'ios-cafe'
// } else if (eventDetails.indexOf("photos")  !== -1) {
//   icon = 'ios-camera'
// } else if (eventDetails.indexOf("global")  !== -1) {
//   icon = 'ios-globe'
// } else if (eventDetails.indexOf("art")  !== -1) {
//   icon = 'ios-color-palette'
// } else if (eventDetails.indexOf("speech")  !== -1) {
//   icon = 'ios-megaphone'
// } else if (eventDetails.indexOf("test")  !== -1) {
//   icon = 'ios-bookmarks'
// } else if (eventDetails.indexOf("cross")  !== -1) {
//   icon = 'Materialicons/directions-run'
// } else if (eventDetails.indexOf("test")  !== -1) {
//   icon = 'ios-bookmarks'

// } else {
//   icon = 'ios-play'
// }
//   return  icon
