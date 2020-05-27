const React = require("react-native");
const { Platform, Dimensions } = React;
import stylesGlobal from "../../themes/globalTheme";
const deviceWidth = Dimensions.get("window").width;

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
    color: "#fff",
  },
  iconRight: {
    fontSize: 25,
    color: "#777777",
    marginRight: 15,
    lineHeight: 60,
  },
  iconLeft: {
    fontSize: 35,
    color: "#999999",
    margin: 12,
  },
  iconLeftPlus: {
    fontSize: 35,
    color: "#999999",
    margin: 12,
  },

  card: {
    backgroundColor: "#fff",
    elevation: 1,
    marginBottom: 12,
    width: "98%",
    alignSelf: "center",
    borderRadius: 15,
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
  rowView: {
    flexDirection: "row",
    flex: 1,
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  url: {
    textDecorationLine: "underline",
    color: "blue",
  },
  newsContentLine: {
    backgroundColor: "#f2f2f2",
    paddingTop: 10,
  },
  chatRow: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    marginBottom: 20,
  },

  nameText: {
    height: 24 * 2,
    margin: 24,
    paddingHorizontal: 24,
    color: "#000",
    marginTop: 100,
    fontSize: 24,
  },

  cardTitle: {
    width: deviceWidth - 120,
    justifyContent: "center",
    alignItems: "center",
    fontSize: stylesGlobal.headingFontSize,
    color: "#111111",
  },
  cardLocation: {
    width: deviceWidth - 120,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    color: "#555555",
    fontWeight: "500",
  },
  chatTitleRight: {
    marginTop: 7,
    fontSize: 15,
    backgroundColor: "white",
    color: "#000",
    marginLeft: 15,
    marginBottom: 5,
  },
  chatDescription: {
    fontSize: 13,
    backgroundColor: "white",
    color: "grey",
    marginLeft: 15,
  },

  roundedButton: {
    alignItems: "center",
    borderRadius: 30,
    height: 50,
    backgroundColor: "#5D6870",
    marginLeft: 20,
    justifyContent: "center",
  },
  nameInput: {
    height: 24 * 2,
    margin: 24,
    paddingHorizontal: 24,
    borderColor: "#111111",
    borderWidth: 1,
    color: "#000",
    fontSize: 24,
  },
  buttonText: {
    // 5.
    marginLeft: 24,
    paddingHorizontal: 24,
    fontSize: 24,
  },

  viewHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageHeader: {
    height: 135,
    width: 225,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#707372",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    marginBottom: 30,
  },
  chatHeading: {
    color: "black",
    alignSelf: "center",
    fontSize: 25,
    paddingBottom: 5,
    paddingRight: 10,
    flex: 1,
    flexDirection: "row",
  },
  chatHeadingText: {
    color: "black",
    alignSelf: "center",
    fontSize: 16,
    paddingBottom: 5,
    paddingRight: 10,
    flex: 1,
    flexDirection: "row",
    fontWeight: "bold",
  },
  chatHeadingLeft: {
    color: "#037AFF",
    alignSelf: "center",
    fontSize: 30,
    paddingBottom: 5,
    paddingRight: 10,
  },
  chatBanner: {
    alignSelf: "center",
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    color: "grey",
    fontSize: 14,
  },
  topbar: {
    alignItems: "center",
    height: 30,
    backgroundColor: "white",
  },

  chat: {
    color: "black",
    alignSelf: "center",
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },
  text: {
    color: "#707372",
    alignSelf: "center",
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
  homeContainer: {
    backgroundColor: "#f2f2f2",
  },
  footerText: {
    fontSize: 14,
    color: "#000",
  },
  photoContainer: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  footer: {
    height: 10,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    margin: 8,
    borderRadius: 8,
  },
  searchIcon: {
    padding: 10,
    paddingRight: 0,
  },
  input: {
    flex: 1,
    padding: 5,
    paddingLeft: 0,
    fontSize: 16,
    backgroundColor: "transparent",
  },

  userPhoto: {
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  friends: {
    minHeight: 75,
    padding: 10,
  },
  friendDivider: {
    width: 30,
    height: "100%",
  },
  friendItemContainer: {
    alignItems: "center",
  },
  friendPhoto: {
    height: 60,
    borderRadius: 30,
    width: 60,
  },
  friendName: {
    marginTop: 10,
    alignSelf: "center",
  },
  chats: {
    flex: 1,
    padding: 10,
  },
  chatItemContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  chatItemIcon: {
    height: 70,
    // borderRadius: 45,
    width: 70,
  },
  chatItemContent: {
    flex: 1,
    alignSelf: "center",
    marginLeft: 10,
  },
  chatFriendName: {
    color: "blaco",
    fontSize: 17,
  },
  content: {
    flexDirection: "row",
  },
  message: {
    flex: 2,
    color: "black",
  },
  time: {
    marginLeft: 5,
    color: "black",
  },
};
