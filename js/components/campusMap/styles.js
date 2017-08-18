
const React = require('react-native');

const { Platform } = React;

const primary = require('../../themes/variable').brandPrimary;

export default {

    mapImage: {
        height: 200,
        resizeMode: 'contain',
    },

    mapImageLegend: {

        height: 900,
        resizeMode: 'contain',
    },
    text: {
      color: '#707372',
      alignSelf: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      fontSize: 25,
    },
};
