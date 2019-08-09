import React, { Component } from "react";
import { Platform, Text, View, Alert, TouchableOpacity, AsyncStorage, Linking, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { ActionSheet, Container, Footer } from "native-base";

import { GiftedChat, Bubble, SystemMessage, Time, Send } from "react-native-gifted-chat";
import { SimpleLineIcons, MaterialIcons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import emojiUtils from "emoji-utils";
import Constants from "expo-constants";
import { bindActionCreators } from "redux";
import CustomActions from "./customActions";
import CustomView from "./customView";
import CustomImage from "./customImage";
import CustomVideo from "./customVideo";
import styles from "./styles";
import I18n from "../../lib/i18n";
import uuid from "uuid";

import { withMappedNavigationParams } from "react-navigation-props-mapper";
import _ from "lodash";
import * as ActionCreators from "../../actions";

import Backend from "./backend";

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

var localMessages = [];

@withMappedNavigationParams()
class chat extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      step: 0,
      muteState: false,
      language: "",
      user: null,
      authenticated: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.parsePatterns = this.parsePatterns.bind(this);

    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;

    console.log("global.authenticated FROM chat", global.authenticated, global.name, global.email);
    console.log("lodash = ", _.isBoolean(global.authenticated));
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    //const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    //this.props.navigation.navigate(userToken ? 'App' : 'Auth');

    if (_.isBoolean(global.authenticated) && global.authenticated) {
      // let me in
    } else {
    }
  };

  static navigationOptions = ({ navigation }) => ({
    headerBackTitle: null,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Entypo name="chevron-left" style={styles.chatHeadingLeft} />
      </TouchableOpacity>
    ),

    headerTitle: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params._showActionSheet();
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "600" }}>{navigation.getParam("title")}</Text>
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

  componentDidMount() {
    this.getPermissionAsync();

    this.props.navigation.setParams({
      _showActionSheet: this._showActionSheet,
    });

    Backend.setChatroom(this.props.chatroom, this.props.title);
    Backend.setMute(null);
    Backend.loadMessages(global.language, message => {
      if (!localMessages.includes(message._id)) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }));
      } else {
        console.log("ignoring message");
      }
    });
  }

  onSend(messages = []) {
    //console.log("previousState.messages=", previousState.messages);
    if (messages[0]._id == undefined) {
      messages[0]._id = uuid.v4();
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    //console.log(messages);
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
    Alert.alert(props.name);
  };

  onLoadEarlier() {
    this.setState(previousState => ({
      isLoadingEarlier: true,
    }));

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState(previousState => ({
          messages: GiftedChat.prepend(previousState.messages, require("./old_messages.js")),
          loadEarlier: false,
          isLoadingEarlier: false,
        }));
      }
    }, 2000); // simulating network
  }

  onReceive(text) {}

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
    var images = [];
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      //this.setState({ image: result.uri });
      //this._images = images;
      images[0] = {
        image: result.uri,
        filename: result.uri,
        user: {
          _id: global.uid, // `${Constants.installationId}${Constants.deviceId}`, // sent messages should have same user._id
          name: this.props.userX.nickname,
        },
      };

      this.onSend(images);
      //Backend.SendMessage(image);
      //uploadUrl = await uploadImageAsync(images.uri);
    }
  };

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
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

  renderBubble = props => {
    const username = this.props.userX.nickname;
    const color = this.getColor(username);

    var myimage = props.currentMessage.image;

    if (props.currentMessage.image) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: "white",
            },
            right: {
              backgroundColor: "white",
            },
          }}
        />
      );
    } else {
      return (
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: "white",
            },
          }}
        />
      );
    }
  };

  get user() {
    // Return our name and our UID for GiftedChat to parse

    return {
      name: this.props.userX.nickname,
      _id: Constants.installationId,
    };
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
      "#808588", // midnight blue
    ];
    return colors[sumChars % colors.length];
  }

  parsePatterns(linkStyle) {
    return [
      {
        pattern: /#(\w+)/,
        style: { ...linkStyle, color: "orange" },
        onPress: () => Linking.openURL("http://gifted.chat"),
      },
    ];
  }

  renderTime() {
    return (
      <Time
        textStyle={{
          right: {
            color: "blue",
            // fontFamily: 'Montserrat-Light',
            fontSize: 14,
          },
          left: {
            color: "green",
            // fontFamily: 'Montserrat-Light',
            fontSize: 14,
          },
        }}
      />
    );
  }

  _showActionSheet() {
    const BUTTONS = ["Mute conversation", "Unmute conversation", "Cancel"];
    const CANCEL_INDEX = 2;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: "Options",
      },

      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Backend.setMute(true);
            break;
          case 1:
            Backend.setMute(false);
            break;
        }
      },
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

  render() {
    console.log("IMA A LOADING....global.authenticated FROM chat ", global.authenticated);

    if (!global.authenticated) {
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

    return (
      <Container>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("selectLanguageChat", {
                chatroom: this.props.title,
                description: this.props.description,
                contact: this.props.contact,
                url: this.props.url,
              });
            }}
          >
            <View style={styles.topbar}>
              <Text style={styles.chatBanner}>{I18n.t("translationsGoogle")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: global.uid, // `${Constants.installationId}${Constants.deviceId}`, // sent messages should have same user._id
            name: global.name,
            email: global.email,
            // avatar: 'https://www.sais.edu.sg/sites/all/themes/custom/saissg/favicon.ico',
          }}
          renderActions={this.renderCustomActions}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderMessageImage={this.renderCustomImage}
          renderMessageVideo={this.renderCustomVideo}
          renderBubble={this.renderBubble}
          showUserAvatar
          bottomOffset={0}
          onPressAvatar={this.avatarPress}
          alwaysShowSend={true}
          renderSend={this.renderSend}
          placeholder={I18n.t("typeMessage")}
        />

        <Footer style={styles.footer} />
      </Container>
    );
  }
}

const _pickVideo = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
  });

  if (!result.cancelled) {
    //this.setState({ image: result.uri });
  }
};

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(chat);
