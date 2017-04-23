const React = require('react-native');

const { Dimensions, Platform } = React;

const primary = require('../../themes/variable').brandPrimary;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  header: {
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    marginLeft: (Platform.OS === 'ios') ? undefined : -30,
  },
  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingTop: Platform.OS === 'android' ? 7 : 10,
  },
  btnHeader: {
    paddingTop: 10,
  },
  imageHeader: {
    height: 25,
    width: 95,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  overviewHeader: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'android' ? 5 : 0,
  },
  overviewHeaderContainer: {
    padding: 30,
    paddingTop: Platform.OS === 'android' ? 35 : 40,
    alignItems: 'center',
    backgroundColor: primary,
  },
  mainWidget: {
    height: (deviceHeight / 2) - 70,
    width: null,
    paddingBottom: 10,
  },
  mainWidgetContainer: {
    flex: 10,
    flexDirection: 'row',
    padding: 20,
  },
  weather: {
    fontWeight: '700',
    fontSize: Platform.OS === 'android' ? 80 : 120,
    lineHeight: Platform.OS === 'android' ? 80 : 120,
    paddingBottom: Platform.OS === 'android' ? 0 : 0,
    marginTop: Platform.OS === 'android' ? -10 : 10,
  },
  weatherInfoContainer: {
    flex: 9,
    padding: 20,
    marginTop: 100,
    alignItems: 'center',
  },
  weatherInfo: {
    fontWeight: '900',
    fontSize: 18,
  },
  weatherTime: {
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.8,
  },
  otherWidget: {
    height: (deviceHeight / 3) + 20,
    width: deviceWidth / 2,
    flex: 1,
  },
  widgetName: {
    color: '#222',
    fontWeight: '700',
    fontSize: 12,
  },
  otherWidgetContainer: {
    flex: 2,
    padding: 20,
    paddingTop: 10,
  },
  blueRatingPerc: {
    fontSize: 32,
    fontWeight: '800',
    paddingTop: 10,
    paddingBottom: 10,
    lineHeight: Platform.OS === 'android' ? 30 : 0,
    color: 'blue',
  },
  redRatingPerc: {
    fontSize: 32,
    fontWeight: '800',
    paddingTop: 10,
    paddingBottom: 10,
    lineHeight: Platform.OS === 'android' ? 30 : 0,
    color: 'red',
  },
  ratingNum: {
    color: '#ccc',
    fontWeight: '800',
  },
  detailsBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'center',
    marginTop: deviceHeight / 10,
  },
};
