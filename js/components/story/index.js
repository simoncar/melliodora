import React, { Component } from "react";
import { Linking, View, TouchableOpacity, TouchableHighlight, Share } from "react-native";
import { Container, Content, Text } from "native-base";
import { Ionicons, Feather, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import ParsedText from "react-native-parsed-text";
import { useIsFocused } from "@react-navigation/native";
import styles from "./styles";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../global.js";
import _ from "lodash";
import Analytics from "../../lib/analytics";
import { connect } from "react-redux";
import { compose } from "redux";
import { myFunction } from "./myfunction";

class Story extends Component {
  constructor(props) {
    super(props);

    const { _key, summary, summaryMyLanguage, descriptionMyLanguage, description, photo1, visible, visibleMore, showIconChat, order } = this.props.route.params;

    this.state = {
      photo1: photo1 !== undefined ? photo1 : null,
      summary: summary,
      summaryMyLanguage: summaryMyLanguage,
      descriptionMyLanguage: descriptionMyLanguage,
      description: description,
      visible: visible,
      visibleMore: visibleMore,
      showIconChat: showIconChat,
      order: order,
      _key: _key,
    };
    this.refreshFunction = this.refreshFunction.bind(this);
  }

  navigationSubscription() {
    console.log("navigationSubscription");
  }

  componentDidMount() {
    // Analytics.track("Story", { story: this.props.route.params.summaryMyLanguage });

    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      //console.log("Add LIstender FFFFFFFF FOCUS");
      // this.setState({ summaryMyLanguage: "QQQQQQQ" });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _shareMessage() {
    Share.share({
      message:
        "" +
        this.state.summaryMyLanguage +
        "\n" +
        formatMonth(this.props.route.params.date_start) +
        "\n" +
        formatTime(this.props.route.params.time_start_pretty, this.props.route.params.time_end_pretty) +
        " \n" +
        this.state.descriptionMyLanguage,
      title: this.state.summaryMyLanguage,
    })

      .then(this._showResult)
      .catch((error) => this.setState({ result: `error: ${error.message}` }));
  }

  _handleOpenWithLinking = (sURL) => {
    let ret;

    if (sURL.indexOf("https://mystamford.edu.sg") == -1) {
      Linking.openURL(sURL);
    } else {
      this.props.navigation.navigate("authPortalEmbed", {
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

  _drawIconSend(chatroom) {
    if (isAdmin(this.props.route.params.adminPassword)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.state.summaryMyLanguage;
            this.props.navigation.navigate("push", this.state);
          }}
        >
          <Text style={styles.eventTextSend}>
            <MaterialCommunityIcons name="send-lock" style={styles.eventIconSendLock} />{" "}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  _drawIconChat(chatroom, title) {
    // if (_.isNil(chatroom) || this.state.showIconChat === false) {
    //   return;
    // }
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("chatStory", {
            chatroom: chatroom,
            title: title,
          });
        }}
      >
        <Text style={styles.eventText}>{this.state.showIconChat && <SimpleLineIcons name="bubble" style={styles.eventIcon} />} </Text>
      </TouchableOpacity>
    );
  }

  _drawIconCalendar(params) {
    if (isValue(params.date_start)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("phoneCalendar", this.state);
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
          <Ionicons name="ios-share-alt" style={styles.eventIcon} />
        </Text>
      </TouchableOpacity>
    );
  }
  refreshFunction(newState) {
    this.setState({ newState, summaryMyLanguage: newState.summary, descriptionMyLanguage: newState.description });
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        {isAdmin(this.props.route.params.adminPassword) && this.props.route.params.source == "feature" && (
          <TouchableHighlight
            style={styles.addButton}
            underlayColor="#ff7043"
            onPress={() => {
              this.props.navigation.navigate("Form", {
                edit: true,
                ...this.state,
                refreshFunction: this.refreshFunction,
              });
            }}
          >
            <MaterialIcons name="edit" style={{ fontSize: 25, color: "white" }} />
          </TouchableHighlight>
        )}

        <Content showsVerticalScrollIndicator={false}>
          {this._drawImage(this.state.photo1)}

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
            {this._drawIconChat(this.state._key, this.state.summaryMyLanguage)}
            {this._drawIconCalendar(this.state)}
            {this._drawIconShare()}
            {this._drawIconSend(this.state)}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.newsContent}>
              <Text selectable style={styles.eventTitle}>
                {this.state.summaryMyLanguage}
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
                {this.state.descriptionMyLanguage}
              </ParsedText>

              {this.props.auth.language != "en" && (
                <Text selectable style={styles.englishFallback}>
                  {"\n\n"}
                  {this.state.description}
                  {"\n\n"}
                </Text>
              )}
              <Text selectable style={styles.englishFallback}>
                {this.state.location}
              </Text>
              <Text> </Text>
              <Text> </Text>
              <Text selectable style={styles.eventTextAbbreviation}>
                {getAbbreviations(this.state.summary)}
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
//export default compose(myFunction, connect(mapStateToProps)(Story));
