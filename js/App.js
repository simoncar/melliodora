import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators  from './actions'

import AppNavigator from './AppNavigator';



console.log("AC=", actionCreators);

class App extends Component {

  render() {

      console.log("_app.js in js folder");

    return <AppNavigator {...this.props}/>;
  }
}

//export default App;



function mapDispatchToProps(dispatch) {
  return bindActionCreators (actionCreators, dispatch);
}

export default connect((state) => { return {} }, mapDispatchToProps)(App);
