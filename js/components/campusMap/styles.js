
const React = require('react-native');

const { Platform } = React;

const primary = require('../../themes/variable').brandPrimary;

export default {

    mapImage: {
        height: 200,
        resizeMode: 'contain',
    },

    mapImageLegend: {

        height: 1100,
        resizeMode: 'contain',
    },
    mapImageELV: {
        height: 200,
        resizeMode: 'contain',
    },

    mapImageLegendELV: {

        height: 1100,
        resizeMode: 'contain',
    },
    heading: {
      color: '#707372',
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
    text2: {
      color: '#707372',
      alignSelf: 'center',
      paddingBottom: 10,
      fontSize: 15,
    },
};
