const React = require('react-native');

const { Dimensions, Platform } = React;

const primary = require('../../themes/variable').brandPrimary;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  container: {
    flex: 1,
    width: null,
    height: null,
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
  newsHeader: {
    color: '#222',
    fontWeight: '500',
    fontSize: 14,
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
    alignSelf: 'flex-end',
  },
  newsTypeText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  newsPoster: {
    width: null,
    flex: 1,
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
  headerIcons: {
    fontSize: 30,
    backgroundColor: 'transparent',
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
