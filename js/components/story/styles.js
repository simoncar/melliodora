const React = require('react-native');

const { Dimensions, Platform } = React;
import { ifIphoneX } from 'react-native-iphone-x-helper'

const primary = require('../../themes/variable').brandPrimary;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export default {

  header: {
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    ...ifIphoneX({
      paddingTop: 0,
      height: 80,
    }, {
      paddingTop: 0,
      height: 60,
    })
  },
  viewHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...ifIphoneX({
     paddingTop: 30
      }, {
     paddingTop: 20
      })
  },
  btnHeader: {
    alignSelf: 'center',
    justifyContent: 'center', 
    alignItems: 'center' ,
    color: 'black',
    fontSize: 34,
  },
  saveBtn: {
    width: windowWidth,
    height: 44,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "#6B9EFA"
  },
  buttonText: {
    fontWeight: "500",
  },

  textHeader: {
    fontSize: 34,
    lineHeight: 41,
    fontFamily: 'SFProTextBold',
    color:'black',
  },
  title: {
    fontWeight: "400",
    lineHeight: 22,
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    height: 25 + 32,
    padding: 16,
    paddingLeft: 0
  },
  quote: {
    fontSize: 17,
    lineHeight: 38,
    fontFamily: 'Helvetica Neue',
    color: "#333333",
    padding: 16,
    paddingLeft: 0,
    flex: 1,
    height: 200,
    marginBottom: 50,
    borderTopWidth: 1,
    borderColor: "rgba(212,211,211, 0.3)",
  },

  switchContainer: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },

  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1  }],
    alignSelf: 'flex-end',
    marginTop: Platform.OS === 'android' ? -2 : -5,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: Platform.OS === 'android' ? 0 : 10,
  },

  addButton: {
    backgroundColor: '#ff5722',
    borderColor: '#ff5722',
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  viewHeader: {

    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...ifIphoneX({
     paddingTop: 30
      }, {
     paddingTop: 20
      })

  },
  container: {
    flex: 1,
    width: null,
    height: null
    },


    storyPhoto: {
      width: null,
      height: 200,
      flex: 1,
    },

  newsContent: {
    flexDirection: 'column',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  eventTitle: {
    color: '#222',
    fontSize: 22,
    paddingBottom: 20,
    fontWeight: 'bold',
  },
  eventText: {
    color: '#222',
    fontSize: 18,
    paddingRight: 25,

  },
  eventTextAbbreviation: {
    color: 'grey',
    fontSize: 18,
    paddingBottom: 10,
  },
  url: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  email: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  calendarText: {

  },
  calendarButton:{
    marginTop: 0,
    marginBottom: 100,
  },
  eventIcon: {
    color: '#222',
    fontSize: 30,
    marginRight: 200,
    paddingRight: 200,
  },

  abbreviations: {
    color: 'grey',
    fontSize: 12,
    paddingTop: 20,
  },
  eventPhone: {
    color: '#222',
    fontSize: 18,
    marginLeft: 200,
    paddingLeft: 200,
  },
  newsCommentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    borderLeftWidth: 2,
    borderLeftColor: primary,
  },
  newsComment: {
    color: primary,
    fontWeight: '500',
    fontSize: 14,
  },
  newsLink: {
    color: '#666',
    fontSize: 12,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  newsTypeText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  newsPoster: {
    height: 215,
    width: null,
    resizeMode: 'contain',

  },
  newsPosterHeader: {
    fontWeight: '900',
  },
  newsPosterContent: {
    marginTop: (deviceHeight / 3),
    flexDirection: 'column',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  timeIcon: {
    fontSize: 20,
    marginLeft: Platform.OS === 'android' ? 15 : 0,
    paddingLeft: Platform.OS === 'android' ? 0 : 20,
    paddingRight: 10,
    marginTop: Platform.OS === 'android' ? -1 : -3,
    color: '#666',
  },
  nightButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  dayButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  modal: {
    backgroundColor: primary,
    position: 'absolute',
    width: deviceWidth,
    height: null,
    bottom: deviceHeight/2.5
  },
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  wrapper: {
    flex: 1,
  },

  imageHeader: {
    height: 135,
    width: 225,
    resizeMode: 'contain',

    justifyContent: 'center',
      alignItems: 'center',
  },
  headerIcons: {
    fontSize: 30,
    backgroundColor: 'transparent',
    color: 'black',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -5,
    marginLeft: (Platform.OS === 'android') ? -5 : undefined,
  },
  headerBtns: {
    padding: 10,
  },
  headerTextIcon: {
    fontSize: 28,
    paddingTop: 10,
    marginTop: Platform.OS === 'android' ? -10 : 0,
  },
  swiperDot: {
    backgroundColor: 'rgba(0,0,0,.8)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  swiperActiveDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  modalContentBox: {
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === 'android' ? '#fff' : 'rgba(255,255,255,0.5)',
  },
  modalSmallText: {
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
  modalLargeText: {
    alignSelf: 'flex-end',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
        // paddingBottom: Platform.OS === 'android' ? 10 : 0,
        // marginTop: Platform.OS === 'android' ? -10 : 0
  },
  nextStoryBtn: {
    color: primary,
    fontWeight: '900',
  },
  forwardBtn: {
    color: primary,
    fontSize: 26,
  },
};
