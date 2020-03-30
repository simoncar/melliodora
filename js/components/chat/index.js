import React, { Component } from "react";
import { Text, View, Alert, TouchableOpacity, AsyncStorage, Linking, Modal, FlatList } from "react-native";
import { ActionSheet, Container, Footer } from "native-base";
import { GiftedChat, Bubble, SystemMessage, Time, Send } from "react-native-gifted-chat";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import CustomView from "./customView";
import CustomImage from "./customImage";
import CustomVideo from "./customVideo";
import styles from "./styles";
import I18n from "../../lib/i18n";
import uuid from "uuid";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import _ from "lodash";
import Backend from "./backend";
import Analytics from "../../lib/analytics";
import * as firebase from "firebase";
import { ListItem } from "react-native-elements";
import { LinearGradient } from 'expo-linear-gradient';
import { SettingsListItem } from "../settings/SettingsListItem";
import { connectActionSheet, ActionSheetProvider } from '@expo/react-native-action-sheet';
import stylesGlobal from "../../themes/globalTheme";
import { connect } from 'react-redux';
import { compose } from 'redux'

var localMessages = [];

class chat extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerTitle: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._showActionSheet(navigation);
        }}>
        <Text style={{ fontSize: stylesGlobal.navbarFontSize, fontWeight: "bold" }}>{navigation.getParam("title")}</Text>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._showActionSheet(navigation);
        }}>
        <View style={styles.chatHeading}>
          <Entypo name="cog" style={styles.chatHeading} />
        </View>
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      step: 0,
      muteState: false,
      user: null,
      authenticated: false,
      modalVisible: false,
      chatroomUsers: []
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.parsePatterns = this.parsePatterns.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    localMessages = [];

    this.communityDomain = this.props.community.selectedCommunity.node;
    console.log("this.this.communityDomain", this.communityDomain)
    this.userInfo = this.props.auth.userInfo;
  }

  componentDidMount() {
    console.log("this.props.navigation", this.props.navigation.state);
    this.props.navigation.setParams({
      _showActionSheet: this._showActionSheet,
      refresh: this.refresh
    });

    this.chatroom = this.props.navigation.getParam("chatroom");
    this.title = this.props.navigation.getParam("title");

    this.ref = firebase
      .firestore()
      .collection(this.communityDomain)
      .doc("chat")
      .collection("chatrooms")
      .doc(this.chatroom);

    this.unsubscribe = this.ref.onSnapshot(doc => {
      const item = doc.data();
      this.props.navigation.setParams({
        title: this.title
      });
    });

    Backend.setLanguage(this.props.auth.language);
    Backend.setChatroom(this.chatroom, this.title);
    Backend.setMute(null);
    Backend.loadMessages(message => {

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }));

    });

    this.loadChatUsers();

    Analytics.track("Chat", { chatroom: this.props.title });
  }
  _getInterestGroupUsers = async () => {
    const data = [];
    const querySnapshot = await firebase
      .firestore()
      .collection(this.communityDomain)
      .doc("user")
      .collection("registered")
      .where("interestGroups", "array-contains", this.props.title)
      .limit(5000)
      .get();

    querySnapshot.docs.forEach(doc => {
      data.push(doc.data());
    });
    return data;
  };

  _getPrivateChatUsers = async members => {
    const data = [];
    const querySnapshot = await firebase
      .firestore()
      .collection(this.communityDomain)
      .doc("user")
      .collection("registered")
      .where("uid", "in", members)
      .get();

    querySnapshot.docs.forEach(doc => {
      data.push(doc.data());
    });
    return data;
  };

  loadChatUsers = () => {
    if (this.props.type == "interestGroup") {
      this._getInterestGroupUsers().then(data => this.setState({ chatroomUsers: data }));
    } else if (this.props.type == "private") {
      this._getPrivateChatUsers(this.props.members).then(data => this.setState({ chatroomUsers: data }));
    }
  };

  _renderUsersItem({ item, index }) {
    const avatarTitle = item.email.slice(0, 2);
    const fullName = item.firstName + " " + item.lastName;
    const avatar = item.photoURL ? { source: { uri: item.photoURL } } : { title: avatarTitle };
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ modalVisible: false });
          this.props.navigation.navigate("UserProfile", { uid: item.uid, user: item });
        }}>
        <ListItem
          leftAvatar={{
            rounded: true,
            ...avatar
          }}
          title={
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ flex: 1, fontSize: 16 }}>{item.displayName || fullName || item.email}</Text>
            </View>
          }
          chevron={true}
          // rightElement={
          //   <TouchableOpacity onPress={() => {
          //     // console.log("item.uid", item.uid, global.uid)
          //     this.privateMessageUser(item.uid, global.uid, fullName)
          //   }}>
          //     <MaterialIcons name="message" style={{ fontSize: 25 }} />
          //   </TouchableOpacity>
          // }
          subtitle={
            <View style={{ flex: 1, flexDirection: "column", paddingTop: 3 }}>
              <Text style={{ color: "gray" }}>{fullName}</Text>
              <Text style={{ color: "gray" }}>{item.email}</Text>
            </View>
          }
        />
      </TouchableOpacity>
    );
  }

  onSend(messages = []) {
    if (messages[0]._id == undefined) {
      messages[0]._id = uuid.v4();
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    localMessages.push(messages[0]._id);
    Backend.SendMessage(messages);
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    Backend.closeChat();
  }

  avatarPress = props => {
    Alert.alert(props.email);
  };

  onLoadEarlier() {
    this.setState(previousState => ({
      isLoadingEarlier: true
    }));

    setTimeout(() => {
      // if (this._isMounted === true) {
      //   this.setState(previousState => ({
      //     messages: GiftedChat.prepend(previousState.messages, require("./old_messages.js")),
      //     loadEarlier: false,
      //     isLoadingEarlier: false,
      //   }));
      // }
    }, 2000); // simulating network
  }

  onReceive(text) { }

  renderCustomActions(props) {
    return (
      <TouchableOpacity style={styles.photoContainer} onPress={this._pickImage}>
        <View>
          <Entypo name="camera" style={{ fontSize: 25, color: "#0284FF" }} />
        </View>
      </TouchableOpacity>
    );
  }

  _pickImage = async () => {
    this.getPermissionAsync();

    var images = [];
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (!result.cancelled) {
      images[0] = {
        image: result.uri,
        filename: result.uri,
        user: {
          _id: this.userInfo.uid, // `${Constants.installationId}${Constants.deviceId}`, // sent messages should have same user._id
          name: this.userInfo.firstName
        }
      };

      this.onSend(images);
    }
  };

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15
        }}
        textStyle={{
          fontSize: 14
        }}
      />
    );
  }

  renderCustomView(props) {
    return <CustomView {...props} />;
  }

  renderCustomImage(props) {
    return <CustomImage {...props} />;
  }

  renderCustomVideo(props) {
    return <CustomVideo {...props} />;
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      );
    }
    return null;
  }

  getColor(username) {
    let sumChars = 0;
    for (let i = 0; i < 10; i++) {
      sumChars += 5;
    }

    const colors = [
      "#d6cfc7", // carrot
      "#c7c6c1", // emerald
      "#bebdb8", // peter  river
      "#bdb7ab", // wisteria
      "#d9dddc", // alizarin
      "#b9bbb6", // turquoise
      "#808588" // midnight blue
    ];
    return colors[sumChars % colors.length];
  }

  parsePatterns(linkStyle) {
    return [{ type: "url", style: styles.url, onPress: this._handleOpenWithLinking }];
  }

  _handleOpenWithLinking = sURL => {
    let ret;

    if (sURL.indexOf("https://mystamford.edu.sg") == -1) {
      Linking.openURL(sURL);
    } else {
      this.props.navigation.navigate("authPortalStory", {
        url: sURL
      });
    }
  };

  refresh = ({ title }) => {
    console.log("nav refresh AAA ", title);
    this.props.navigation.setParams({ title: title });
    console.log("nav refresh BBB ", title);
  };



  _showActionSheet = () => {


    const options = ["Chatroom info", "Edit Chatroom", "Mute Conversation", "Unmute Conversation", "Cancel"];

    const cancelButtonIndex = options.length - 1;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.setState({ modalVisible: true });
            break;
          case 1:
            navigation.push("chatTitle", {
              title: this.props.navigation.getParam("title"),
              chatroom: this.props.navigation.getParam("chatroom"),
              type: this.props.navigation.getParam("type"),
              edit: true,
              onGoBack: this.refresh
            });
            break;
          case 2:
            Backend.setMute(true);
            break;
          case 3:
            Backend.setMute(false);
            break;
        }
      }
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 10 }}>
          <MaterialIcons name="send" style={{ fontSize: 25, color: "#0284FF" }} />
        </View>
      </Send>
    );
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  render() {
    if (this.communityDomain == "sais_edu_sg" && !this.props.authPortal.authEmail) {
      const { goBack } = this.props.navigation;
      goBack(null);
      setTimeout(() => {
        // Alert.alert(I18n.t("login"));
        this.props.navigation.navigate("authPortal");
      }, 100);

      this.props.navigation.navigate("chatRooms");
      return (
        <View>
          <Text>{I18n.t("login")}</Text>
        </View>
      );
    }

    let userDetails = {};
    if (this.userInfo.isAnonymous) {
      userDetails = {
        name: "Guest" + this.userInfo.uid
      };
    } else {
      userDetails = {
        name: this.userInfo.firstName,
        email: this.userInfo.email,
        ...(this.userInfo.photoURL && { avatar: this.userInfo.photoURL })
      };
    }

    return (
      <Container>
        <View>
          <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
            <View style={{ marginTop: 22, backgroundColor: "#f2f2f2", flex: 1 }}>
              <LinearGradient
                colors={["#4c669f", "#3b5998", "#192f6a"]}
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 100,
                  padding: 12
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalVisible: false });
                  }}>
                  <AntDesign size={32} color={"#f2f2f2"} name="closecircleo" />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 24,
                    color: "#fff",
                    fontWeight: "bold",
                    textShadowOffset: { width: 1, height: 0.8 },
                    textShadowRadius: 1,
                    textShadowColor: "#000",
                    fontWeight: "bold"
                  }}>
                  {this.props.title}
                </Text>
              </LinearGradient>

              <View style={{ backgroundColor: "#fff", marginTop: 12 }}>
                <Text style={{ padding: 12, fontSize: 18 }}>Chatroom users ({this.state.chatroomUsers.length})</Text>
                {this.renderSeparator()}

                {["users", "public"].indexOf(this.props.navigation.getParam("type")) > -1 ? (
                  <SettingsListItem
                    title={"All Users"}
                    onPress={() => {
                      this.setState({ modalVisible: false });
                      this.props.navigation.navigate("UserSearch");
                    }}
                  />
                ) : (
                    <FlatList
                      style={{ height: "70%" }}
                      data={this.state.chatroomUsers}
                      renderItem={this._renderUsersItem.bind(this)}
                      keyExtractor={(_, idx) => "user" + idx}
                      ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderSeparator}
                    />
                  )}
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("selectLanguageChat", {
                chatroom: this.props.title,
                // description: this.props.description,
                // contact: this.props.contact,
                url: this.props.url
              });
            }}>
            <View style={styles.topbar}>
              <Text style={styles.chatBanner}>{I18n.t("translationsGoogle")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: this.userInfo.uid, // `${Constants.installationId}${Constants.deviceId}`, // sent messages should have same user._id
            ...userDetails
          }}
          renderActions={this.renderCustomActions}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderMessageImage={this.renderCustomImage}
          renderMessageVideo={this.renderCustomVideo}
          showUserAvatar={true}
          bottomOffset={0}
          onPressAvatar={this.avatarPress}
          alwaysShowSend={true}
          renderSend={this.renderSend}
          placeholder={I18n.t("typeMessage")}
          parsePatterns={this.parsePatterns}
          renderUsernameOnMessage={true}
        />

        <Footer style={styles.footer} />
      </Container>
    );
  }
}



const mapStateToProps = state => ({
  communityCreation: state.communityCreation,
  community: state.community,
  auth: state.auth,
  authPortal: state.authPortal
});
const ConnectedApp = compose(
  connectActionSheet,
  connect(mapStateToProps),
)(chat);

export default class ActionSheetContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerTitle: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._showActionSheet();
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>{navigation.getParam("title")}</Text>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._showActionSheet();
        }}
      >
        <View style={styles.chatHeading}>
          <Entypo name="cog" style={styles.chatHeading} />
        </View>
      </TouchableOpacity>
    ),
  });

  render() {
    return (
      <ActionSheetProvider>
        <ConnectedApp navigation={this.props.navigation} />
      </ActionSheetProvider>
    )
  }
}