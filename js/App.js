import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators  from './actions'
import { Permissions, Notifications, Constants } from 'expo';

import AppNavigator from './AppNavigator';
import registerForPushNotificationsAsync from './lib/registerForPushNotificationsAsync';

console.log("AC=", ActionCreators);

class App extends Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }
  render() {


    switch(Constants.manifest.extra.instance) {
      case '0001-sais_edu_sg':
          global.switch_address =''
          global.switch_helpEmail ='pta.comms@sais.edu.sg'
          global.switch_portalName ='myStamford'
          global.switch_portalURL ='https://mystamford.edu.sg/login/login.aspx?prelogin=http%3a%2f%2fmystamford.edu.sg%2f&kr=iSAMS:ParentPP'
          break;
      case '0002-singaporepoloclub':
          global.switch_address =''
          global.switch_helpEmail ='simoncar+spc@gmail.com'
          global.switch_portalName ='SPC Website'
          global.switch_portalURL ='https://www.singaporepoloclub.org/'
          break;
      default:
          global.switch_address ='not specified -'
  }

    return <AppNavigator {...this.props}/>;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync(this.props.userX.name);


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

//export default App;

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators (ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  userX: state.user,
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
