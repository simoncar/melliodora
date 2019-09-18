import React, { Component } from "react";
import { Notifications } from "expo";
import Constants from "expo-constants";
import AppNavigator from "./AppNavigator";
import registerForPush from "./lib/registerForPushNotificationsAsync";

class App extends Component {
  componentWillMount() { }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _handleNotification = ({ origin, data }) => { };

  _registerForPushNotifications() {
    registerForPush.reg(global.name);

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  render() {
    switch (Constants.manifest.extra.instance) {
      case "sais_edu_sg":
        global.switch_address =
          "Locations: \nFranklin Ground Floor (level 2), by Stamford Yard \nEarly Learning Village, Level 1\nHours: 8 am to 5 pm";
        global.switch_helpEmail = "pta.comms@sais.edu.sg";
        global.switch_contactEmail = "help@sais.edu.sg";
        global.switch_portalName = "myStamford";
        global.switch_portalURL =
          "https://mystamford.edu.sg/login/login.aspx?prelogin=http%3a%2f%2fmystamford.edu.sg%2f&kr=iSAMS:ParentPP";
        global.switch_call = "+65 6709 4800";
        break;
      case "0002-singaporepoloclub":
        global.switch_address = "Polo Club \nSingapore  00000";
        global.switch_helpEmail = "simoncar+spc@gmail.com";
        global.switch_contactEmail = "test@test.com";
        global.switch_portalName = "Polo Contacts";
        global.switch_portalURL = "https://polocontacts.com/";
        global.switch_call = "+65 0000 0000";
        break;
      default:
        global.switch_address = "not specified -";
    }

    return <AppNavigator {...this.props} />;
  }
}

export default App;
