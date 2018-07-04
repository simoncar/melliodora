
const React = require('react-native');
const { Dimensions, Platform } = React;

import { ifIphoneX } from 'react-native-iphone-x-helper'

const primary = require('../../themes/variable').brandPrimary;

export default {
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
      imageHeader: {
        height: 135,
        width: 225,
        resizeMode: 'contain',
    
        justifyContent: 'center',
          alignItems: 'center',
      },
    heading: {
        color: '#707372',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 25,
    },
    chatHeading: {
        color: '#fff',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 25,
    },
    text: {
        color: '#707372',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: 15,
    },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#000',
    },

    footer: {
          height: 10
      },

};
