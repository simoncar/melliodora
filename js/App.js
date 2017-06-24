import React, { Component } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators  from './actions'
import AppNavigator from './AppNavigator';

console.log("AC=", actionCreators)

class App extends Component {
  render() {
    return <AppNavigator {...this.props}/>;
  }
}

//export default App;



function mapDispatchToProps(dispatch) {
  return bindActionCreators (actionCreators, dispatch);
}

export default connect((state) => { return {} }, mapDispatchToProps)(App);
