const React = require("react-native");

const { Platform, Dimensions } = React;

const deviceWidth = Dimensions.get("window").width;
const primary = require("../../themes/variable").brandPrimary;

export default {
  container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: "white",
    color: "#c6c6c6",
  },
  beta: {
    backgroundColor: "white",
    color: "#c6c6c6",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
    fontSize: 20,
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
    color: "black",
  },
  version: {
    backgroundColor: "white",
    color: "#666",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    textAlign: "center",
    fontSize: 12,
    paddingBottom: 20,
    paddingTop: 0,
  },
  user: {
    backgroundColor: "white",
    color: "#666",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    textAlign: "center",
    fontSize: 12,
    paddingBottom: 0,
    paddingTop: 0,
  },
  addButton: {
    backgroundColor: "#ff5722",
    borderColor: "#ff5722",
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    zIndex: 1,
  },

  betaView: {
    backgroundColor: "#707372",
    alignSelf: "center",
    flexDirection: "row",
  },
  betaButton: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "white",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    //color: '#141b4d'
  },
  storyPhoto: {
    width: null,
    height: 200,
    flex: 1,
  },

  footer: {
    backgroundColor: "white",
  },

  footerTab: {
    backgroundColor: "white",
    paddingTop: 3,
  },

  buttonLabelFooter: {
    color: "#707372",
    alignSelf: "center",
    paddingTop: 2,
    paddingBottom: 4,
    fontSize: 10,
  },
  profileInfoContainer: {
    backgroundColor: primary,
    paddingTop: 10,
  },
  profileUser: {
    alignSelf: "center",
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  profileUserInfo: {
    alignSelf: "center",
    opacity: 0.8,
    fontWeight: "bold",
    color: "#FFF",
  },
  profilePic: {
    height: 0,
  },
  roundedButton: {
    alignSelf: "center",
    alignItems: "center",
    //backgroundColor: 'rgba(0,0,0,0.1)'
    backgroundColor: "#141b4d",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
  },
  roundedButtonCalendar: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#C6F1F0",
    borderRadius: 1,
    width: 60,
    height: 60,
  },

  profileInfo: {
    alignSelf: "center",
    paddingTop: 5,
    paddingBottom: 10,
  },
  linkTabs: {
    backgroundColor: "#fff",
  },
  linkTabs_header: {
    padding: 15,
    alignSelf: "center",
  },
  linkTabs_tabCounts: {
    fontSize: 31,
    fontWeight: "bold",
    color: primary,
    alignSelf: "center",
    paddingBottom: Platform.OS === "android" ? 3 : 0,
  },
  buttonLabel: {
    color: "#707372",
    alignSelf: "center",
    paddingTop: 10,
  },
  iconLabel: {
    color: "#707372",
    alignSelf: "center",
    paddingTop: 10,
    fontSize: 15,
  },

  icon: {
    alignSelf: "center",
    marginRight: 0,
    marginLeft: 0,
    fontWeight: "bold",
    fontSize: 32,
    color: "white",
  },
  iconWithText: {
    alignSelf: "center",
    marginRight: 0,
    marginLeft: 0,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  icon2: {
    fontWeight: "bold",
  },

  newsImage: {
    borderTopWidth: 1,
  },

  tenYearLogo: {
    height: 200,
    width: "80%",
    resizeMode: "contain",
  },
  sclogo: {
    width: 40,
    height: 40,
    borderTopWidth: 1,
    alignSelf: "center",
  },
  newsImage2: {
    width: 340,
    height: 200,
    alignSelf: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  newsContentLine: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  newsContent: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  newsContentNoLine: {
    flexDirection: "column",
    paddingTop: 0,
    paddingBottom: 0,

    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  newsHeader: {
    paddingTop: 10,
    paddingBottom: 5,
    color: "#444",
    fontWeight: "bold",
  },

  featureTitle: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 16,
    color: "#444",
    fontWeight: "bold",
  },

  featureDescription: {
    paddingTop: 10,
    paddingBottom: 5,
    color: "#444",
    paddingLeft: 5,
    paddingRight: 5,
  },

  newsLink: {
    flex: 1,
    textAlign: "left",
    color: "#666",
    fontSize: 12,
    fontWeight: "bold",
    paddingTop: 3,
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    alignSelf: "flex-end",
  },
  newsTypeText: {
    textAlign: "left",
    color: "#666",
    fontSize: 12,
    fontWeight: "bold",
    paddingTop: 0,
  },
};
