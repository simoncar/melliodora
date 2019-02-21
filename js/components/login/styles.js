const React = require('react-native');

const {Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  iosShadow: {
    flex: 1,
    width: (deviceHeight < 500) ? 80 : (deviceWidth / 4) + 12,
    resizeMode: 'contain',
    height: (deviceHeight < 500) ? 50 : (deviceHeight / 15),
    alignSelf: 'center',
    marginTop: (deviceWidth < 330) ? (deviceHeight / 15) : (deviceHeight / 6),
  },

  newsHeader: {
    color: 'green',
    fontWeight: 'bold',
  },
  aShadow: {
    flex: 1,
    resizeMode: 'contain',
    width: (deviceWidth / 3) + 8,
    height: (deviceHeight / 20),
    padding: 20,
    alignSelf: 'center',
    marginTop: (deviceWidth < 330) ? (deviceHeight / 15) : ((deviceHeight / 5) - 60),
  },
  inputGrp: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 25,
    borderWidth: 0,
    //width: 320,
    height: 40,
    borderColor: 'black',
  },
  input: {
    paddingLeft: 10,
    color: 'black',
    width: 290,
  },
  inputIcon: {
    color: 'blue',

  },

  textHeader: {
    fontSize: 34,
    lineHeight: 41,
    fontFamily: 'SFProTextBold',
    color:'black',
    alignSelf: 'center',
    paddingBottom: 40,
  },

  button: {
    fontSize: 24,
    lineHeight: 41,
    fontFamily: 'SFProTextBold',
    color:'black',
    alignSelf: 'center',
    paddingBottom: 40,

  },
  background: {
    flex: 1,
    width: null,
    height: deviceHeight,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  bg: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 150,
    //paddingBottom: 60,
    //marginTop: (deviceHeight < 500) ? (Platform.OS === 'android' ? 20 : 0) : (Platform.OS === 'android' ? ((deviceHeight / 6) - 45) : ((deviceHeight / 6) - 30)),

  },
  loginBtn: {
    marginTop: 10,
    height: 50,
    alignItems: 'center',

  },
  helpBtns: {
    opacity: 0.9,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF'
  },
  otherLinksContainer: {
    flexDirection: 'row',
  },
  logoHeader: {
    width: 20,
    height: 28,
    alignSelf: 'center',
  },
  text: {
    fontSize: 15,
    color: '#000',
    marginBottom: 10,
  },
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: (Platform.OS === 'ios') ? undefined : -30,
  },
  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  btnHeader: {
  },
  imageHeader: {
    height: 145,
    width: 225,
    resizeMode: 'contain',
  }
}
