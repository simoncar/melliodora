const React = require("react-native");

const { Dimensions, Platform } = React;

const primary = require("../../themes/variable").brandPrimary;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  settingsMessage: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "blue",
  },
  settingsMessageText: {
    fontSize: 22,
    paddingBottom: 10,
    color: "white",
  },
  settingsMessageIcon: {
    fontSize: 30,
    width: 30,
    color: "white",
  },

  navIcon: {
    paddingLeft: 10,
    paddingRight: 10,
    color: "#FFF",
    fontSize: 20,
  },

  roundedButton: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  url: {
    color: "#FFF",
    width: 250,
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingTop: 15 /* Padding to push below the navigation bar */,
    backgroundColor: "#F5FCFF",
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "grey",
  },
  topbarTextDisabled: {
    color: "green",
  },
};
