
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default {
  header: {
   
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    ...ifIphoneX({
      paddingTop: 0,
      height: 60
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
  rowHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingTop: Platform.OS === 'android' ? 5 : 0,
  },
  btnHeader: {
    alignSelf: 'center',
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  imageHeader: {
    height: 135,
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
