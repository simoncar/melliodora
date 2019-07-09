import React, { Component } from "react";
import { WebView, Linking, View, TouchableOpacity, TouchableHighlight, Platform, Share } from "react-native";

import { Container, Content, Text, Icon } from "native-base";
import { Ionicons, Feather, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { Image } from "react-native-expo-image-cache";

import ParsedText from "react-native-parsed-text";
import Communications from "react-native-communications";
import { withMappedNavigationParams } from "react-navigation-props-mapper";

import styles from "./styles";
import call from "react-native-phone-call"; //TODO migration to communications

import Analytics from "../../lib/analytics";
import { Notifications } from "expo";

import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../global.js";

import * as firebase from "firebase";

var instID = Constants.manifest.extra.instance;

@withMappedNavigationParams()
class Story extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("eventTitle"),
  });

  constructor(props) {
    super(props);
    this.state = {};

    // analytics  -----
    const trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username,
      story: `${this.props.navigation.getParam("eventDate")} - ${this.props.navigation.getParam("eventTitle")}`,
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.EVENT_STORY, trackingOpts);
    // analytics --------
  }

  _shareMessage() {
    Share.share({
      message:
        "" +
        this.props.navigation.getParam("eventTitle") +
        "\n" +
        formatMonth(this.props.navigation.getParam("eventDate")) +
        "\n" +
        formatTime(this.props.navigation.getParam("eventStartTime")) +
        this.props.navigation.getParam("eventEndTime") +
        " \n" +
        this.props.navigation.getParam("location") +
        " \n" +
        this.props.navigation.getParam("eventDescription"),
      title: this.props.navigation.getParam("eventTitle"),
    })

      .then(this._showResult)
      .catch(error => this.setState({ result: `error: ${error.message}` }));
  }

  _call() {
    const args = {
      number: this.props.navigation.getParam("phone"), // String value with the number to call
      prompt: true, // Optional boolean property. Determines if the user should be prompt prior to the call
    };

    call(args).catch(console.error);
  }

  _email() {
    // TODO: only show email/phone links when there are values
    Communications.email([this.props.navigation.getParam("email")], null, null, null, null);
  }

  _handleOpenWithLinking = sURL => {
    let ret;

    if (sURL.indexOf("https://www.facebook.com/groups/") !== -1) {
      ret = sURL.substring(32);

      if (Platform.OS === "android") {
        sURL = `fb://group/${ret}`;
      } else {
        sURL = `fb://profile/${ret}`;
      }
    } else {
      ret = "";
    }

    console.log(sURL);

    Linking.openURL(sURL);
  };

  _formatWeb(sURL) {
    if (sURL.length > 0) {
      return <WebView source={{ uri: "https://github.com/facebook/react-native" }} javaScriptEnabled />;
    }
  }

  handleUrlPress(url) {
    LinkingIOS.openURL(url);
  }

  handlePhonePress(phone) {
    // AlertIOS.alert(`${phone} has been pressed!`);
  }

  handleNamePress(name) {
    // AlertIOS.alert(`Hello ${name}`);
  }

  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }

  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    const pattern = /\[(@[^:]+):([^\]]+)\]/i;
    const match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }

  setNotifyPreference() {
    // Get the token that uniquely identifies this device
    let token = "DENIED";

    // Get the token that uniquely identifies this device
    if (!Constants.isDevice) {
      token = "ExponentPushToken[YQNwZDOkv0QdHUlDV-T5HQ]"; // override simulator with simon's iphone
    } else {
      token = Notifications.getExpoPushTokenAsync();
    }

    this.notifyRef = firebase
      .database()
      .ref(`instance/${instID}/feature/${this.props.navigation.getParam("_key")}/notify/`);

    this.notifyRef.update({
      token: "sdvaiushviuasjbnviuasviasviivh",
    });
  }

  _drawImage(imageURI) {
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
    };
    const uri = imageURI;

    if (undefined !== imageURI && null !== imageURI && imageURI.length > 0) {
      return (
        <View>
          <Image style={styles.storyPhoto} {...{ preview, uri }} />
        </View>
      );
    }
  }

  _drawIconChat(chatroom) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("chat", {
            chatroom: chatroom,
          });
        }}
      >
        <Text style={styles.eventText}>
          <SimpleLineIcons name="bubble" style={styles.eventIcon} />{" "}
        </Text>
      </TouchableOpacity>
    );
  }

  _drawIconMore(url) {
    if (isValue(url)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this._handleOpenWithLinking(this.props.navigation.state.params.url);
          }}
        >
          <Text style={styles.eventText}>
            <Ionicons name="md-link" style={styles.eventIcon} />
          </Text>
        </TouchableOpacity>
      );
    }
  }

  _drawIconCalendar(params) {
    if (isValue(params.eventDate)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("phoneCalendar", {
              eventTitle: this.props.navigation.state.params.eventTitle,
              eventDescription: this.props.navigation.state.params.eventDescription,
              eventDate: this.props.navigation.state.params.eventDate,
              eventStartTime: this.props.navigation.state.params.eventStartTime,
              eventEndTime: this.props.navigation.state.params.eventEndTime,
              location: this.props.navigation.state.params.location,
              eventImage: this.props.navigation.state.params.eventImage,
              phone: this.props.navigation.state.params.phone,
              email: this.props.navigation.state.params.email,
              color: this.props.navigation.state.params.color,
              photo1: this.props.navigation.state.params.photo1,
              photo2: this.props.navigation.state.params.photo2,
              photo3: this.props.navigation.state.params.photo3,
              url: this.props.navigation.state.params.url,
            });
          }}
        >
          <Text style={styles.eventText}>
            <Ionicons name="ios-calendar" style={styles.eventIcon} />
          </Text>
        </TouchableOpacity>
      );
    }
  }

  _drawIconShare() {
    return (
      <TouchableOpacity onPress={() => this._shareMessage()}>
        <Text style={styles.eventText}>
          <Feather name="share" style={styles.eventIcon} />
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        {isAdmin(this.props.adminPassword) && (
          <TouchableHighlight
            style={styles.addButton}
            underlayColor="#ff7043"
            onPress={() =>
              this.props.navigation.navigate("storyForm", {
                eventTitle: this.props.navigation.getParam("eventTitle"),
                eventDescription: this.props.navigation.getParam("eventDescription"),
                eventDate: this.props.navigation.state.params.eventDate,
                eventStartTime: this.props.navigation.state.params.eventStartTime,
                eventEndTime: this.props.navigation.state.params.eventEndTime,
                location: this.props.navigation.state.params.location,
                eventImage: this.props.navigation.state.params.eventImage,
                phone: this.props.navigation.state.params.phone,
                email: this.props.navigation.state.params.email,
                color: this.props.navigation.state.params.color,
                photo1: this.props.navigation.state.params.photo1,
                photo2: this.props.navigation.state.params.photo2,
                photo3: this.props.navigation.state.params.photo3,
                url: this.props.navigation.state.params.url,
                displayStart: this.props.navigation.state.params.displayStart,
                displayEnd: this.props.navigation.state.params.displayEnd,
                photoSquare: this.props.navigation.state.params.photoSquare,
                _key: this.props.navigation.state.params._key,
                edit: true,
              })
            }
          >
            <MaterialIcons name="edit" style={{ fontSize: 25, color: "white" }} />
          </TouchableHighlight>
        )}

        <Content showsVerticalScrollIndicator={false}>
          {this._drawImage(this.props.navigation.getParam("photo1"))}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              padding: 5,
              paddingLeft: 10,
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 0,
              flex: 1,
              borderTopWidth: 1,
              borderTopColor: "#ddd",
            }}
          >
            {this._drawIconChat(this.props.navigation.state.params.eventTitle)}
            {this._drawIconMore(this.props.navigation.state.params.url)}
            {this._drawIconCalendar(this.props.navigation.state.params)}
            {this._drawIconShare()}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.newsContent}>
              <Text selectable style={styles.eventTitle}>
                {this.props.navigation.state.params.eventTitle}
              </Text>

              {isValue(this.props.navigation.getParam("eventDate")) && (
                <Text selectable style={styles.eventText}>
                  {formatMonth(this.props.navigation.getParam("eventDate"))}
                </Text>
              )}

              {isValue(this.props.navigation.getParam("eventStartTime")) && (
                <Text selectable style={styles.eventText}>
                  {formatTime(
                    this.props.navigation.getParam("eventStartTime"),
                    this.props.navigation.getParam("eventEndTime"),
                  )}
                </Text>
              )}

              <ParsedText
                style={styles.eventText}
                parse={[
                  {
                    type: "url",
                    style: styles.url,
                    onPress: this._handleOpenWithLinking,
                  },
                  {
                    type: "phone",
                    style: styles.phone,
                    onPress: this.handlePhonePress,
                  },
                  {
                    type: "email",
                    style: styles.email,
                    onPress: this.handleEmailPress,
                  },
                  {
                    pattern: /Bobbbbb|Davidfffff/,
                    style: styles.name,
                    onPress: this.handleNamePress,
                  },
                  {
                    pattern: /\[(@[^:]+):([^\]]+)\]/i,
                    style: styles.username,
                    onPress: this.handleNamePress,
                    renderText: this.renderText,
                  },
                  { pattern: /433333332/, style: styles.magicNumber },
                  { pattern: /#(\w+)/, style: styles.hashTag },
                ]}
                childrenProps={{ allowFontScaling: false }}
              >
                {this.props.navigation.getParam("eventDescription")}
              </ParsedText>

              {undefined !== this.props.navigation.getParam("location") &&
                this.props.navigation.getParam("location") !== null &&
                this.props.navigation.getParam("location").length > 0 && (
                  <Text selectable style={styles.eventText}>
                    {this.props.navigation.state.params.location}
                  </Text>
                )}

              {undefined !== this.props.navigation.state.params.phone &&
                this.props.navigation.state.params.phone !== null &&
                this.props.navigation.state.params.phone.length > 0 && (
                  <TouchableOpacity>
                    <Text style={styles.eventText}>
                      <MaterialIcons name="phone" style={styles.eventIcon} /> {this.props.navigation.state.params.phone}
                    </Text>
                  </TouchableOpacity>
                )}

              {undefined !== this.props.navigation.state.params.email &&
                this.props.navigation.state.params.email !== null &&
                this.props.navigation.state.params.email.length > 0 && (
                  <TouchableOpacity>
                    <Text style={styles.eventText}>
                      <MaterialIcons name="email" style={styles.eventIcon} /> {this.props.navigation.state.params.email}
                    </Text>
                  </TouchableOpacity>
                )}

              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text selectable style={styles.eventTextAbbreviation}>
                {getAbbreviations(this.props.navigation.getParam("eventTitle"))}
              </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>

              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Story;
