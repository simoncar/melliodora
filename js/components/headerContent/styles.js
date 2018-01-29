
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default {
  header: {
    height: 100,
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: (Platform.OS === 'ios') ? undefined : -30,
    ...ifIphoneX({
      paddingTop: 30
  }, {
      paddingTop: 0
  })
  },
  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingTop: Platform.OS === 'android' ? 5 : 0,
  },
  btnHeader: {
    alignSelf: 'center'
  },
  imageHeader: {
    height: 145,
    width: 225,
    resizeMode: 'contain',

    justifyContent: 'center',
      alignItems: 'center',
  },


    footer: {
      backgroundColor: 'white',
  },


    footerTab: {
      backgroundColor: 'white',
      paddingTop:3
    },

    roundedButtonFooter: {
      alignSelf: 'center',
      alignItems: 'center',
      //backgroundColor: 'rgba(0,0,0,0.1)'
      backgroundColor: '#141b4d',
      borderRadius: 20,
      width: 35,
      height: 35,
      justifyContent: 'center',
      paddingTop: 5,
      marginRight: 0,
      marginLeft: 0,

    },
      iconFooter: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color:'white',
      },

      buttonLabelFooter: {
        color: '#707372',
        alignSelf: 'center',
        paddingTop: 2,
        paddingBottom: 4,
        fontSize: 10,
      },
};
