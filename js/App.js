import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ActionCreators from './actions';
import { Permissions, Notifications, Constants } from 'expo';
import Analytics from './lib/analytics';

import AppNavigator from './AppNavigator';
import registerForPush from './lib/registerForPushNotificationsAsync';

let instID = Constants.manifest.extra.instance;

console.log('AC=', ActionCreators);

class App extends Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }
  
  render() {
    if (undefined != global.loggedLoginAnalytics) {
      if (global.loggedLoginAnalytics == 1) {
        if (this.props.userX.name.length > 0) {
          var username = this.props.userX.name;
        } else {
          var username = 'no username';
        }

        const trackingOpts = {
          instId: instID,
          emailOrUsername: username,
        };

        Analytics.identify(username, trackingOpts);
        Analytics.track(Analytics.events.APP_STARTED, trackingOpts);
        global.username = username;

        global.loggedLoginAnalytics = 2;
      }
    }

    if (!global.loggedLoginAnalytics) {
      global.loggedLoginAnalytics = 1;
    }


    switch (Constants.manifest.extra.instance) {
      case '0001-sais_edu_sg':
        global.switch_address = 'Locations: \nFranklin Ground Floor (level 2), by Stamford Yard \nEarly Learning Village, Level 1\nHours: 8 am to 5 pm';
        global.switch_helpEmail = 'pta.comms@sais.edu.sg';
        global.switch_contactEmail = 'help@sais.edu.sg';
        global.switch_portalName = 'myStamford';
        global.switch_portalURL = 'https://mystamford.edu.sg/login/login.aspx?prelogin=http%3a%2f%2fmystamford.edu.sg%2f&kr=iSAMS:ParentPP';
        global.switch_call = '+65 6709 4800';
        global.header_logo = `../../../resources/${  Constants.manifest.extra.instance  }/headerLogo.png`;
        global.header_logoID = require('../resources/0001-sais_edu_sg/headerLogo.png');
        break;
      case '0002-singaporepoloclub':
        global.switch_address = 'Polo Club \nSingapore  00000';
        global.switch_helpEmail = 'simoncar+spc@gmail.com';
        global.switch_contactEmail = 'test@test.com';
        global.switch_portalName = 'Polo Contacts';
        global.switch_portalURL = 'https://polocontacts.com/';
        global.switch_call = '+65 0000 0000';
        global.header_logo = `../../../resources/${  Constants.manifest.extra.instance  }/headerLogo.png`;
        global.header_logoID = require('../resources/0002-singaporepoloclub/headerLogo.png');
        break;
      default:
        global.switch_address = 'not specified -';
    }


    return <AppNavigator {...this.props} />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    

    registerForPush.reg(this.props.userX.name);

      console.log("registerForPushNotificationsAsync" + this.props.userX.name);

      // Watch for incoming notifications
      this._notificationSubscription = Notifications.addListener(
        this._handleNotification
      );
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}

// export default App;

const mapDispatchToProps = (dispatch) => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
