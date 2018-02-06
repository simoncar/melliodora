const React = require('react-native');

import { ifIphoneX } from 'react-native-iphone-x-helper'

const {
  Dimensions, Platform
} = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  newsContent: {
    flexDirection: 'column',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  header: {
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    ...ifIphoneX({
      paddingTop: 0,
      height: 80
    }, {
      paddingTop: 0,
      height: 60
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

  headerIcons: {
    fontSize: 30,
    backgroundColor: 'transparent',
  },

  roundedButton: {
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 1,
    height: 10,
  },

  newsHeader: {
    color: '#444',
    fontWeight: 'bold',
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
    height: null,
    width: null,
    resizeMode: 'cover',
    flex: 1,
    position: 'relative',
  },
  newsPosterHeader: {
    fontWeight: '900',
  },
  newsPosterLink: {
    opacity: 0.8,
    fontSize: 12,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  newsPosterTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    alignSelf: 'flex-end',
  },
  newsPosterTypeText: {
    opacity: 0.8,
    fontSize: 12,
    fontWeight: 'bold',
    paddingBottom: 5,
  },

  buttonLabel: {
    color: '#707372',
    alignSelf: 'center',
    paddingTop: 10
  },





  icon: {
    alignSelf: 'center',
    marginRight: 0,
    marginLeft: 0,
    fontWeight: 'bold',
    fontSize: 30,
    color:'green',
  },

  buttonLabel: {
    color: '#707372',
    alignSelf: 'center',
    paddingTop: 10,
    fontSize: 10,
  },

  timeIcon: {
    fontSize: 20,
    marginLeft: Platform.OS === 'android' ? 15 : 0,
    paddingLeft: Platform.OS === 'android' ? 0 : 20,
    paddingRight: 10,
    marginTop: Platform.OS === 'android' ? -1 : -3,
    color: '#666',
  },
  headertimeIcon: {
    fontSize: 20,
    marginLeft: Platform.OS === 'android' ? 15 : 0,
    paddingLeft: Platform.OS === 'android' ? 0 : 20,
    paddingRight: 10,
    marginTop: Platform.OS === 'android' ? -1 : 0,
    color: '#fff',
  },
  slide: {
    flex: 1,
    width: null,
    backgroundColor: 'transparent',
  },
  swiperTextContent: {
    position: 'absolute',
    bottom: -5,
    padding: 20,
  },
  swiperDot: {
    backgroundColor: 'rgba(0,0,0,.8)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 0,
  },
  swiperActiveDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 0,
  },
  swiperContentBox: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  imageHeader: {
    height: 135,
    width: 225,
    resizeMode: 'contain',

    justifyContent: 'center',
      alignItems: 'center',
  },
  logoHeader: {
    width: 20,
    height: 28,
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
        paddingTop: 5,
  },


  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },

  agendaItem: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5,
    alignSelf: 'stretch',
    borderRightWidth: 5,


  },
  agendaItemSystemMonth: {
    backgroundColor: 'gray',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  agendaDateSystemMonth: {
    color: 'white',
    fontSize: 20,
    marginBottom: 0,
    marginTop: 10,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  agendaDate: {
    color: 'gray',
    fontSize: 12,

    marginBottom: 3,
  },

  agendaLocation: {
     color: 'gray',
     fontSize: 12,
     marginTop: 5,
     borderBottomWidth: 1,
     borderBottomColor: '#666',
   },



};
