/**
 * @flow
 */

//import * as Amplitude from "expo-analytics-amplitude";
import * as Analytics from "expo-firebase-analytics";

import Constants from "expo-constants";
import { normalizeTrackingOptions } from "./analyticsUtil";

var release = Constants.manifest.revisionId || "UNVERSIONED";

const events = {
  APP_STARTED: "APP_STARTED",
  PORTAL_LOGIN: "PORTAL_LOGIN",
  PAGE_CONTACT: "PAGE_CONTACT",
  PAGE_CALENDAR: "PAGE_CALENDAR",
  PAGE_CHAT: "PAGE_CHAT",
  PAGE_ATHLETICS: "PAGE_ATHLETICS",
  PAGE_PTA: "PAGE_PTA",
  PAGE_MAP: "PAGE_MAP",
  EVENT_STORY: "EVENT_STORY",
  EVENT_FORM: "EVENT_FORM",
  CALENDAR_EVENT_STORY: "CALENDAR_EVENT_STORY",
  ADD_TO_CALENDAR_SUCCESS: "ADD_TO_CALENDAR_SUCCESS",
  ADD_TO_CALENDAR_FAILED: "ADD_TO_CALENDAR_FAILED",
  SHARE_STORY: "SHARE_STORY",
};

let isInitialized = false;
const { manifest } = Constants;
const apiKey = manifest.extra && manifest.extra.amplitudeApiKey;
const initialize = () => {
  if (!apiKey) {
    return;
  }

  //Amplitude.initialize(apiKey);

  let trackingOpts = {
    uid: global.uid,
    name: global.name,
    email: global.email,
  };

  trackingOpts = normalizeTrackingOptions(trackingOpts);
  console.log("identifyidentifyidentifyidentifyidentify");
  if (trackingOpts.uid) {
    //Amplitude.setUserId(trackingOpts.uid);
    if (trackingOpts) {
      //Amplitude.setUserProperties(trackingOpts);
    }
  } else {
    // Amplitude.clearUserProperties();
  }

  isInitialized = true;
};

const maybeInitialize = () => {
  if (apiKey && !isInitialized) {
    //initialize();
  }
};

const track = (event: string, options: any = null) => {
  //maybeInitialize();

  console.log("Amplitude: ", event, options);
  options = normalizeTrackingOptions(options);

  // if (options) {
  //   Amplitude.logEventWithProperties(event, options);
  // } else {
  //   Amplitude.logEvent(event);
  // }

  Analytics.logEvent(event, {
    contentType: "text",
    itemId: "Expo rocks!",
    method: "facebook",
  });

  //}
};

export default {
  events,
  track,
};
