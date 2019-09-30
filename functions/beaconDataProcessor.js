const _ = require("lodash");
const moment = require("moment");
const ONE_MINUTE = 1000 * 60;

exports.cardsAtSecurity = function(beacon, gateway) {
  console.log("Processing Beacon Transition");

  //find cards that are left at the security hub
  if (gateway.location != beacon.location) {
    //card moved to a new location (used to find card sitting lost for a very long time one place)
    console.log("cardsAtSecurity Logic A = ", beacon.mac);
    return { transitionLatest: gateway.timestamp };
  }

  var objTransition = "";
  // have they been sitting here a really long time?

  const cutoff = Date.now() - ONE_MINUTE * 30;

  if (beacon.state == "Security") {
    console.log("cardsAtSecurity Logic B = ", beacon.mac);
    //ignore Level 1 lift lobby (false alarms from here)
    if (gateway.location == "Washington Level 1 - Lift Lobby") {
      console.log("cardsAtSecurity Logic C = ", beacon.mac);
      return { state: "Security" };
    }
  }

  if (beacon.transitionLatest < cutoff) {
    console.log("LONG TIME SITTER @ SECURITY", beacon.mac);
    console.log("cardsAtSecurity Logic D = ", beacon.mac);
    if (gateway.location == "Gate 2") {
      console.log("cardsAtSecurity Logic E = ", beacon.mac);
      return { state: "Security" };
    } else {
      console.log("cardsAtSecurity Logic F = ", beacon.mac);
    }
  } else {
    console.log("cardsAtSecurity Logic G = ", beacon.mac);
  }

  return;
};

exports.firstSeen = function(beacon, gateway, admin) {
  if (beacon.state == "Not Present") {
    if (beacon.mac == "AC233F29148A") {
      var dataDict = {
        pushToken: "ExponentPushToken{vU0ZNfL6RQo5_JScermePb}",
        text: "Kayla is arriving at " + gateway.campus,
        from: "Arrival",
        timestamp: gateway.timestamp,
        sent: false,
      };

      let queueItem = admin
        .firestore()
        .collection("sais_edu_sg")
        .doc("push")
        .collection("queue")
        .add(dataDict);
    }

    if (gateway.state == "Perimeter") {
      return {
        timestampFirstSeenToday: gateway.timestamp,
        state: "Arriving",
      };
    } else {
      return {
        timestampFirstSeenToday: gateway.timestamp,
        state: "Entered",
      };
    }
  }
  return;
};

exports.location = function(beacon, gateway) {
  const hour =
    moment()
      .add(8, "hours")
      .format("HH") + "00";
  console.log("HOUR = ", hour);

  var objLocation = {};

  if (gateway.state == "Perimeter") {
    objLocation = {
      stateCandidate: "Perimeter",
      timestampPerimeterCandidate: gateway.timestamp,
    };

    console.log("Location Logic A = ", beacon.mac);
  } else {
    if (beacon.stateCandidate != "Perimeter") {
      objLocation = {
        state: "Entered",
        timestampEntered: gateway.timestamp,
        stateCandidate: "",
        timestampPerimeterCandidate: "",
      };
      console.log("Location Logic B = ", beacon.mac);
    } else {
      //we are likely leaving
      objLocation = {
        stateCandidate: "Perimeter",
      };
      console.log("Location Logic C = ", beacon.mac);
      //stateCandidate == "Perimeter"
      //gateway == "On Campus"

      if (hour <= 9) {
        objLocation = {
          state: "Entered",
          timestampEntered: gateway.timestamp,
          stateCandidate: "",
          timestampPerimeterCandidate: "",
        };
        console.log("Location Logic D = ", beacon.mac);
      } else if (hour >= 3) {
        if (gateway.state == "FYI Only") {
          // ignore problematic afternoon gateways
          objLocation = { state: "Entered", timestampEntered: gateway.timestamp };
          console.log("Location Logic E = ", beacon.mac);
        } else {
          if (beacon.timestampPerimeterCandidate < Date.now() - ONE_MINUTE * 3) {
            // dont record as entered for at least 2 minuts after a gate 1 ping in the afternoon
            // give them time to leave

            objLocation = {
              state: "Entered",
              timestampEntered: gateway.timestamp,
              stateCandidate: "",
              timestampPerimeterCandidate: "",
            };
            console.log("Location Logic F = ", beacon.mac);
          }
        }
      } else {
        //midday leavers - need to look carefully at these and possibly send alerts
        if (beacon.timestampPerimeterCandidate < Date.now() - ONE_MINUTE * 1) {
          // dont record as entered for at least 2 minuts after a gate 1 ping in the afternoon
          // give them time to leave

          objLocation = {
            state: "Entered",
            timestampEntered: gateway.timestamp,
            stateCandidate: "",
            timestampPerimeterCandidate: "",
          };
          console.log("Location Logic G = ", beacon.mac);
        } else {
          console.log("Location Logic H = ", beacon.mac);
        }
      }
    }
  }

  return objLocation;
};
