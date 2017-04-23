

const React = require('react-native');

const { Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const primary = require('../../themes/variable').brandPrimary;

export default {
  signupContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: (deviceWidth < 330) ? (Platform.OS === 'android' ? ((deviceHeight / 9) - 10) : ((deviceHeight / 9) - 10)) : (Platform.OS === 'android' ? ((deviceHeight / 7) - 10) : ((deviceHeight / 5) - 10)),
  },
  signupHeader: {
    alignSelf: 'center',
    fontSize: 22,
    padding: 10,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: Platform.OS === 'android' ? (deviceHeight / 6) : ((deviceHeight / 6) + 10),
  },
  background: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: primary,
  },
  inputGrp: {
    flexDirection: 'row',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  input: {
    paddingLeft: 10,
    color: '#FFF',
  },
  signupBtn: {
    height: 50,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  termsText: {
    alignSelf: 'center',
    opacity: 0.8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EFF',
  },
};
