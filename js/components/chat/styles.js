const React = require("react-native");
const { Dimensions, Platform } = React;

import { ifIphoneX } from "react-native-iphone-x-helper";

const primary = require("../../themes/variable").brandPrimary;

export default {
  header: {
    paddingTop: 10,
    paddingBottom: 10
  },
  container: {
    backgroundColor: "white"
  },
  icon: {
    fontSize: 25
  },
  chatRow: {
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    marginBottom: 20
  },
  chatHeadingLeft: {
    color: "#037AFF",
    alignSelf: "center",
    fontSize: 30,
    paddingBottom: 5,
    paddingRight: 10
  },
  chatHeading: {
    color: "black",
    alignSelf: "center",
    fontSize: 25,
    paddingBottom: 5,
    paddingRight: 10
  },
  nameText: {
    height: 24 * 2,
    margin: 24,
    paddingHorizontal: 24,
    color: "#000",
    marginTop: 100,
    fontSize: 24
  },
  chatTitle: {
    marginTop: 7,
    fontSize: 15,
    backgroundColor: "white",
    color: "#000",
    marginLeft: 15,
    marginBottom: 5
  },
  chatDescription: {
    fontSize: 13,
    backgroundColor: "white",
    color: "grey",
    fontSize: 16,
    marginLeft: 15
  },

  roundedButton: {
    alignItems: "center",
    borderRadius: 30,
    height: 60,
    backgroundColor: "#141b4d",
    marginLeft: 20,
    justifyContent: "center"
  },
  nameInput: {
    height: 24 * 2,
    margin: 24,
    paddingHorizontal: 24,
    borderColor: "#111111",
    borderWidth: 1,
    color: "#000",
    fontSize: 24
  },
  buttonText: {
    // 5.
    marginLeft: 24,
    paddingHorizontal: 24,
    fontSize: 24
  },

  viewHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  imageHeader: {
    height: 135,
    width: 225,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center"
  },
  heading: {
    color: "#707372",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    marginBottom: 30
  },
  chatHeading: {
    color: "black",
    alignSelf: "center",
    fontSize: 25,
    paddingBottom: 5,
    paddingRight: 10
  },
  chatHeadingLeft: {
    color: "#037AFF",
    alignSelf: "center",
    fontSize: 30,
    paddingBottom: 5,
    paddingRight: 10
  },
  chatBanner: {
    color: "black",
    alignSelf: "center",
    fontSize: 18,
    paddingTop: 5
  },
  chat: {
    color: "black",
    alignSelf: "center",
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 10
  },
  text: {
    color: "#707372",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 15
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  footerText: {
    fontSize: 14,
    color: "#000"
  },

  footer: {
    height: 10
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    margin: 8,
    borderRadius: 8
  },
  searchIcon: {
    padding: 10,
    paddingRight: 0
  },
  input: {
    flex: 1,
    padding: 5,
    paddingLeft: 0,
    fontSize: 16,
    backgroundColor: "transparent"
  },
  container: {
    backgroundColor: "white",
    flex: 1
  },
  userPhoto: {
    width: 40,
    height: 40,
    marginLeft: 5
  },
  friends: {
    minHeight: 75,
    padding: 10
  },
  friendDivider: {
    width: 30,
    height: "100%"
  },
  friendItemContainer: {
    alignItems: "center"
  },
  friendPhoto: {
    height: 60,
    borderRadius: 30,
    width: 60
  },
  friendName: {
    marginTop: 10,
    alignSelf: "center"
  },
  chats: {
    flex: 1,
    padding: 10
  },
  chatItemContainer: {
    flexDirection: "row",
    marginBottom: 20
  },
  chatItemIcon: {
    height: 70,
    // borderRadius: 45,
    width: 70
  },
  chatItemContent: {
    flex: 1,
    alignSelf: "center",
    marginLeft: 10
  },
  chatFriendName: {
    color: "blaco",
    fontSize: 17
  },
  content: {
    flexDirection: "row"
  },
  message: {
    flex: 2,
    color: "black"
  },
  time: {
    marginLeft: 5,
    color: "black"
  }
};
