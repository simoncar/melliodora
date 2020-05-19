import React, { Component } from "react";
import { Linking, View, TouchableOpacity, TouchableHighlight, Share } from "react-native";
import { Container, Content, Text } from "native-base";
import { Ionicons, Feather, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import ParsedText from "react-native-parsed-text";
import styles from "./styles";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../global.js";
import _ from "lodash";
import Analytics from "../../lib/analytics";
import { connect } from "react-redux";

class Story extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Analytics.track("Story", { story: this.props.route.params.summaryMyLanguage });
  }

  _shareMessage() {
    Share.share({
      message:
        "" +
        this.props.route.params.summaryMyLanguage +
        "\n" +
        formatMonth(this.props.route.params.date_start) +
        "\n" +
        formatTime(this.props.route.params.time_start_pretty, this.props.route.params.time_end_pretty) +
        " \n" +
        this.props.route.params.descriptionMyLanguage,
      title: this.props.route.params.summaryMyLanguage,
    })

      .then(this._showResult)
      .catch((error) => this.setState({ result: `error: ${error.message}` }));
  }

  _handleOpenWithLinking = (sURL) => {
    let ret;

    if (sURL.indexOf("https://mystamford.edu.sg") == -1) {
      Linking.openURL(sURL);
    } else {
      this.props.route.params.navigation.navigate("authPortalStory", {
        url: sURL,
      });
    }
  };

  _handleEmailPress(email, matchIndex /*: number*/) {
    Linking.openURL("mailto:" + email);
  }

  handlePhonePress(phone, matchIndex /*: number*/) {
    Linking.openURL("tel:" + email);
  }

  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    const pattern = /\[(@[^:]+):([^\]]+)\]/i;
    const match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }

  _drawImage(imageURI) {
    if (_.isNil(imageURI)) {
      var uri =
        "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2Fxdesk-calendar-980x470-20181016.jpg.pagespeed.ic.BdAsh-Nj_6.jpg?alt=media&token=697fef73-e77d-46de-83f5-a45540694274";
    } else {
      var uri = imageURI;
    }
    const preview = {
      uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
    };

    if (undefined !== uri && null !== uri && uri.length > 0) {
      return (
        <View>
          <Image style={styles.storyPhoto} {...{ preview, uri }} />
        </View>
      );
    }
  }

  _drawIconChat(chatroom, title) {
    if (_.isNil(chatroom) || this.props.route.params.showIconChat === false) {
      return;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.route.params.navigation.navigate("chat", {
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
    if (isAdmin(this.props.route.params.adminPassword)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.route.params.navigation.navigate("push", this.props.route.params);
          }}
        >
          <Text style={styles.eventTextSend}>
            <MaterialCommunityIcons name="send-lock" style={styles.eventIconSendLock} />{" "}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  _drawIconCalendar(params) {
    if (isValue(params.date_start)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.route.params.navigation.navigate("phoneCalendar", this.props.route.params);
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
    if (this.props.route.params.showIconShare === false) {
      return;
    }

    return (
      <TouchableOpacity onPress={() => this._shareMessage()}>
        <Text style={styles.eventText}>
          <Ionicons name="ios-share-alt" style={styles.eventIcon} />
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        {isAdmin(this.props.route.params.adminPassword) && this.props.route.params.source == "feature" && (
          <TouchableHighlight
            style={styles.addButton}
            underlayColor="#ff7043"
            onPress={() =>
              this.props.route.params.navigation.navigate("storyForm", {
                ...{ edit: true },
                ...this.props.route.params,
              })
            }
          >
            <MaterialIcons name="edit" style={{ fontSize: 25, color: "white" }} />
          </TouchableHighlight>
        )}

        <Content showsVerticalScrollIndicator={false}>
          {this._drawImage(this.props.route.params.photo1)}

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
            {this._drawIconChat(this.props.route.params._key, this.props.route.params.summaryMyLanguage)}
            {this._drawIconCalendar(this.props.route.params)}
            {this._drawIconShare()}
            {this._drawIconSend(this.props.route.params)}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.newsContent}>
              <Text selectable style={styles.eventTitle}>
                {this.props.route.params.summaryMyLanguage}
              </Text>

              <Text selectable style={styles.eventText}>
                {formatMonth(this.props.route.params.date_start)}
              </Text>

              {isValue(this.props.route.params.time_start_pretty) && (
                <Text selectable style={styles.eventTextTime}>
                  {formatTime(this.props.route.params.time_start_pretty, this.props.route.params.time_end_pretty)}
                </Text>
              )}

              <ParsedText
                style={styles.eventTextBody}
                parse={[
                  {
                    pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,12}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*/i,
                    style: styles.url,
                    onPress: this._handleOpenWithLinking,
                  },
                  {
                    type: "phone",
                    style: styles.phone,
                    onPress: this._handlePhonePress,
                  },
                  {
                    type: "email",
                    style: styles.email,
                    onPress: this._handleEmailPress,
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
                {this.props.route.params.descriptionMyLanguage}
              </ParsedText>

              {this.props.auth.language != "en" && (
                <Text selectable style={styles.englishFallback}>
                  {"\n\n"}
                  {this.props.route.params.description}
                  {"\n\n"}
                </Text>
              )}
              <Text selectable style={styles.englishFallback}>
                {this.props.route.params.location}
              </Text>
              <Text> </Text>
              <Text> </Text>
              <Text selectable style={styles.eventTextAbbreviation}>
                {getAbbreviations(this.props.route.params.summary)}
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Story);
