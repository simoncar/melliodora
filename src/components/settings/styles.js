const React = require("react-native");

const { Dimensions, Platform } = React;

export default {
  header: {
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: Platform.OS === "ios" ? undefined : -30
  },
  rowHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingTop: Platform.OS === "android" ? 0 : 0
  },
  btnHeader: {
    alignSelf: "center"
  },

  newsContentLine: {
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
    color: "black"
  }
};
