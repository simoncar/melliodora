import React, { Component } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from './actions'
import AppNavigator from './AppNavigator';

class App extends Component {
  render() {
    return <AppNavigator {...this.props}/>;
  }
}

//export default App;



function mapDispatchToProps(dispatch) {
  return bindActionCreators (ActionCreators, dispatch);
}
export default connect((state) => { return {} }, mapDispatchToProps)(App);
