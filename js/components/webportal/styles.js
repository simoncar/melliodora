const React = require('react-native');

const {
  Dimensions, Platform
} = React;

const primary = require('../../themes/variable').brandPrimary;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  settingsMessage: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    height: 800,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingsMessageText: {
    fontSize: 22,
    paddingBottom: 10,
    paddingTop: 60,
    color: 'white'
  },
  settingsMessageTextLogin: {
    fontSize: 22,
    paddingBottom: 10,
    paddingTop: 100,
    color: 'white',
    textAlign: 'center'
  },

  settingsMessageIcon: {
    fontSize: 30,
    width: 30,
    color: 'white'
  },
  roundedButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
    width: 60,
    height: 60,
  },


};
