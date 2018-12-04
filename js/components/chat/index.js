import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import { connect } from 'react-redux';

import { Expo, Constants } from 'expo';

import { Actions as NavigationActions } from 'react-native-router-flux';
import { GiftedChat, Actions, Bubble, SystemMessage } from 'react-native-gifted-chat';
import { Container, Content, Header, Footer, Button, Icon, Body } from 'native-base';
import emojiUtils from 'emoji-utils';
import CustomActions from './customActions';
import CustomView from './customView';
import styles from './styles';

import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions';

import Backend from './backend';
import SlackMessage from './slackMessage';

class chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      step: 0,
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
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidMount() {
    Backend.setChatroom(this.props.chatroom);

    Backend.loadMessages((message) => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    Backend.closeChat();
  }

  onLoadEarlier() {
    this.setState(previousState => ({
      isLoadingEarlier: true,
    }));

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState(previousState => ({
          messages: GiftedChat.prepend(previousState.messages, require('./old_messages.js')),
          loadEarlier: false,
          isLoadingEarlier: false,
        }));
      }
    }, 2000); // simulating network
  }

  onSend(messages = []) {
    Backend.SendMessage(messages);
  }

  onReceive(text) {

  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      Cancel: () => { },
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
              backgroundColor: '#f0f0f0',
            },
        }}
      />
    );
  }

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
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
              {this.state.typingText}
            </Text>
        </View>
      );
    }
    return null;
  }


  renderMessage(props) {
    const { currentMessage: { text: currText } } = props;

    let messageTextStyle;

        // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
            // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return (
      <SlackMessage {...props} messageTextStyle={messageTextStyle} />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderBubble2 = (props) => {
    const username = props.currentMessage.user.name;
    const color = this.getColor(username);

    return (

      <Bubble
        {...props}
        textStyle={{
          right: {
              color: 'white',
            },
        }}
        wrapperStyle={{
          left: {
              backgroundColor: color,
            },
        }}
      />
    );
  }

  getColor(username) {
    let sumChars = 0;
    for (let i = 0; i < username.length; i++) {
      sumChars += username.charCodeAt(i);
    }

    const colors = [
      '#d6cfc7', // carrot
      '#c7c6c1', // emerald
      '#bebdb8', // peter  river
      '#bdb7ab', // wisteria
      '#d9dddc', // alizarin
      '#b9bbb6', // turquoise
      '#808588', // midnight blue
    ];
    return colors[sumChars % colors.length];
  }

  parsePatterns(linkStyle) {
    return [
      {
        pattern: /#(\w+)/,
        style: { ...linkStyle, color: 'orange' },
        onPress: () => Linking.openURL('http://gifted.chat'),
      },
    ];
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <View style={styles.viewHeader}>
              <View>
                  <Button transparent onPress={() => NavigationActions.pop()}>
                      <Icon
                          active
                          name="arrow-back"
                          style={styles.headerIcons}
                        />
                    </Button>
                </View>
              <Body>
                  <Text style={styles.chatHeading}>{this.props.chatroom}{Constants.installationId}{Constants.deviceId}</Text>

                </Body>
              <View>
                  <Button transparent onPress={() => { NavigationActions.imageUploadTest(); }}>
                      <Icon
                          active
                          name="arrow-back"
                          style={styles.headerIcons}
                        />
                    </Button>
                </View>
              <View>
                  <Button transparent onPress={() => { NavigationActions.form(); }}>
                      <Icon
                          active
                          name="arrow-back"
                          style={styles.headerIcons}
                        />
                    </Button>
                </View>
            </View>
        </Header>

        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
                    // loadEarlier={this.state.loadEarlier}
                    // onLoadEarlier={this.onLoadEarlier}
                    // isLoadingEarlier={this.state.isLoadingEarlier}

          user={{
              _id: `${Constants.installationId}${Constants.deviceId}`, // sent messages should have same user._id
              name: this.props.userX.nickname,
              avatar: 'https://www.sais.edu.sg/sites/all/themes/custom/saissg/favicon.ico',
            }}

          //renderActions={this.renderCustomActions}
          //renderBubble={this.renderBubble}
                    // renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
                    // renderFooter={this.renderFooter}
          showAvatarForEveryMessage
          showUserAvatar
          parsePatterns={this.parsePatterns}
          //renderMessage={this.renderBubble}
        />

        <Footer style={styles.footer} />
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  username: state.username,
  userX: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(chat);

