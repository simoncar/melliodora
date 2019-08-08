import React, { Component } from "react";
import { WebView, Linking, View, TouchableOpacity, TouchableHighlight, Platform, Share } from "react-native";
import { Container, Content, Text, Icon } from "native-base";
import { Ionicons, Feather, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "react-native-expo-image-cache";
import ParsedText from "react-native-parsed-text";
import Communications from "react-native-communications";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import styles from "./styles";
import call from "react-native-phone-call"; //TODO migration to communications
import Analytics from "../../lib/analytics";
import { Notifications } from "expo";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue, getLanguageString } from "../global.js";

import * as firebase from "firebase";

var instID = Constants.manifest.extra.instance;

@withMappedNavigationParams()
class Story extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("summaryMyLanguage"),
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
        this.props.summaryMyLanguage +
        "\n" +
        formatMonth(this.props.eventDate) +
        "\n" +
        formatTime(this.props.eventStartTime, this.props.eventEndTime) +
        " \n" +
        this.props.navigation.state.params.descriptionMyLanguage,
      title: this.props.summaryMyLanguage,
    })

      .then(this._showResult)
      .catch(error => this.setState({ result: `error: ${error.message}` }));
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

    Linking.openURL(sURL);
  };

  _formatWeb(sURL) {
    if (sURL.length > 0) {
      return <WebView source={{ uri: "https://github.com/facebook/react-native" }} javaScriptEnabled />;
    }
  }

  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    const pattern = /\[(@[^:]+):([^\]]+)\]/i;
    const match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
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

  _drawIconChat(chatroom, title) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("chat", {
            chatroom: chatroom,
            title: title,
          });
        }}
      >
        <Text style={styles.eventText}>
          <SimpleLineIcons name="bubble" style={styles.eventIcon} />{" "}
        </Text>
      </TouchableOpacity>
    );
  }

  _drawIconSend(chatroom) {
    if (isAdmin(this.props.adminPassword)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("push", this.props.navigation.state.params);
          }}
        >
          <Text style={styles.eventText}>
            <MaterialCommunityIcons name="send-lock" style={styles.eventIconSendLock} />{" "}
          </Text>
        </TouchableOpacity>
      );
    }
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
            this.props.navigation.navigate("phoneCalendar", this.props.navigation.state.params);
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
              this.props.navigation.navigate("storyForm", { ...{ edit: true }, ...this.props.navigation.state.params })
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
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 0,
              flex: 1,
              borderTopWidth: 1,
              borderTopColor: "#ddd",
            }}
          >
            {this._drawIconChat(this.props._key, this.props.summaryMyLanguage)}
            {this._drawIconMore(this.props.navigation.state.params.url)}
            {this._drawIconCalendar(this.props.navigation.state.params)}
            {this._drawIconShare()}

            {this._drawIconSend(this.props.navigation.state.params)}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.newsContent}>
              <Text selectable style={styles.eventTitle}>
                {this.props.navigation.state.params.summaryMyLanguage}
              </Text>

              {isValue(this.props.navigation.getParam("date_start")) && (
                <Text selectable style={styles.eventText}>
                  {formatMonth(this.props.navigation.getParam("date_start"))}
                </Text>
              )}

              {isValue(this.props.navigation.getParam("time_start_pretty")) && (
                <Text selectable style={styles.eventText}>
                  {formatTime(
                    this.props.navigation.getParam("time_start_pretty"),
                    this.props.navigation.getParam("time_end_pretty"),
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
                {this.props.descriptionMyLanguage}
              </ParsedText>

              {global.language != "en" && (
                <Text selectable style={styles.englishFallback}>
                  {"\n\n"}
                  {this.props.description}
                  {"\n\n"}
                </Text>
              )}
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text selectable style={styles.eventTextAbbreviation}>
                {getAbbreviations(
                  this.props.navigation.getParam("summary") + " " + this.props.navigation.getParam("description"),
                )}
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
