import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators  from './actions'
import { Permissions, Notifications } from 'expo';


import AppNavigator from './AppNavigator';
import registerForPushNotificationsAsync from './lib/registerForPushNotificationsAsync';

console.log("AC=", actionCreators);

class App extends Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }
  render() {

      console.log("_app.js in js folder");

    return <AppNavigator {...this.props}/>;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

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



function mapDispatchToProps(dispatch) {
  return bindActionCreators (actionCreators, dispatch);
}

export default connect((state) => { return {} }, mapDispatchToProps)(App);
