
const React = require('react-native');
const { Dimensions, Platform } = React;

import { ifIphoneX } from 'react-native-iphone-x-helper';

const primary = require('../../themes/variable').brandPrimary;

export default {
  header: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    container: {
      backgroundColor: "white",
    },
    icon: {
      fontSize: 25,

    },
    chatRow: {
      
        height: 60,
        backgroundColor: "white",
        flexDirection: "row",
        marginBottom: 20,
    },
    nameText: { 
        height: 24 * 2,
        margin: 24,
        paddingHorizontal: 24,
        color: '#000',
        marginTop: 100,
        fontSize: 24,
      },
      chatTitle: { 
    
        fontSize: 14,
        backgroundColor: 'white',
        color: '#000',
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 15,
        marginBottom: 5,
      },
      chatDescription: { 
    
        fontSize: 14,
        backgroundColor: 'white',
        color: 'grey',
        fontSize: 16,
        marginLeft: 15,
      },
      roundedButton: {
        alignSelf: 'left',
        alignItems: 'centre',
        borderRadius: 30,
        height: 60,
        backgroundColor: '#141b4d',
        marginLeft: 20,
        justifyContent: 'center',

      },
  nameInput: { 
        height: 24 * 2,
        margin: 24,
        paddingHorizontal: 24,
        borderColor: '#111111',
        borderWidth: 1,
        color: '#000',
        fontSize: 24,

      },
      buttonText: { // 5.
        marginLeft: 24,
        paddingHorizontal: 24,
        fontSize: 24,
      },

  viewHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
      marginBottom: 30,
      
    },
  chatHeading: {
      color: 'black',
      alignSelf: 'center',
      fontSize: 25,
      paddingTop: 10,
      paddingBottom: 10,
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
      height: 10,
    },

};
