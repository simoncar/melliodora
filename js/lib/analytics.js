/**
 * @flow
 */

import { Amplitude, Constants } from 'expo';
import Environment from './environment';
import { normalizeTrackingOptions } from './analyticsUtil';


var release = Constants.manifest.revisionId || 'UNVERSIONED';

const events = {

  APP_STARTED: 'APP_STARTED',
  PORTAL_LOGIN: 'PORTAL_LOGIN',

  PAGE_CONTACT: 'PAGE_CONTACT',
  PAGE_CALENDAR: 'PAGE_CALENDAR',
  PAGE_ATHLETICS: 'PAGE_ATHLETICS',
  PAGE_PTA: 'PAGE_PTA',
  PAGE_MAP: 'PAGE_MAP',
  PAGE_CHAT: 'PAGE_CHAT',
  EVENT_STORY: 'EVENT_STORY',
  EVENT_FORM: 'EVENT_FORM',
  CALENDAR_EVENT_STORY: 'CALENDAR_EVENT_STORY',
  ADD_TO_CALENDAR_SUCCESS: 'ADD_TO_CALENDAR_SUCCESS',
  ADD_TO_CALENDAR_FAILED: 'ADD_TO_CALENDAR_FAILED',
  SHARE_STORY: 'SHARE_STORY',
};

let isInitialized = false;
const { manifest } = Constants;
const apiKey = manifest.extra && manifest.extra.amplitudeApiKey;
const initialize = () => {
  if (!apiKey) {
    return;
  }

  Amplitude.initialize(apiKey);
  isInitialized = true;

};

const maybeInitialize = () => {
  if (apiKey && !isInitialized) {
    initialize();
  }
};

const identify = (id: ?string, options?: ?Object = null) => {
  maybeInitialize();
  options = normalizeTrackingOptions(options);

  if (id) {
    Amplitude.setUserId(id);
    if (options) {
      Amplitude.setUserProperties(options);
    }
  } else {
    Amplitude.clearUserProperties();
  }
};

const track = (event: string, options: any = null) => {
  maybeInitialize();
  options = normalizeTrackingOptions(options);

  //if (Environment.isProduction) {


    if (options) {
      Amplitude.logEventWithProperties(event, options);
    } else {
      Amplitude.logEvent(event);
    }

  //}

};

export default {
  events,
  track,
  identify,
};