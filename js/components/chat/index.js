import React, { Component } from 'react';
import {
  Platform, Text, View, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions as NavigationActions } from 'react-native-router-flux';
import {
  GiftedChat, Actions, Bubble, SystemMessage, Time,
} from 'react-native-gifted-chat';
import {
  Container, Header, Footer, Button, Icon, Body,
} from 'native-base';
import emojiUtils from 'emoji-utils';
import Constants from 'expo';
import { bindActionCreators } from 'redux';
import CustomActions from './customActions';
import CustomView from './customView';
import styles from './styles';
import HeaderContent from './../headerContent/header/';

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
    if (this.props.userX.nickname) {
      // we have a value, good

    } else {
      this.noNickname();
      NavigationActions.login();
    }


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


  noNickname() {
    Alert.alert(
      'Chat Name',
      'Please enter a Name to Chat',
      [

        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

    avatarPress = (props) => {
      console.log(props._id);
      console.log(props.name);

      Alert.alert(
        props.name,
      );
    };

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

    renderBubble3(props) {
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

    renderBubble2 = (props) => {
      const username = this.props.userX.nickname;
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

    get user() {
      // Return our name and our UID for GiftedChat to parse

      return {
        name: this.props.userX.nickname,
        _id: Expo.Constants.installationId,
      };
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

    /** render the chat bubble */
    renderBubble(props) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: 'pink',
            },
            right: {
              backgroundColor: 'blue',
            },
          }}
          textStyle={{
            right: {
              color: 'white',
              // fontFamily: 'Montserrat-Light',
              fontSize: 14,
            },
            left: {
              color: 'black',
              // fontFamily: 'Montserrat-Light',
              fontSize: 14,
            },
          }}
        />
      );
    }

    /** render the time labels in the bubble */
    renderTime() {
      return (
        <Time
          textStyle={{
            right: {
              color: 'blue',
              // fontFamily: 'Montserrat-Light',
              fontSize: 14,
            },
            left: {
              color: 'green',
              // fontFamily: 'Montserrat-Light',
              fontSize: 14,
            },
          }}
        />
      );
    }

    render() {
      return (
        <Container>

          <HeaderContent
            showBack
          />

          <Text style={styles.chatHeading}>{this.props.chatroom}</Text>

          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
                    // loadEarlier={this.state.loadEarlier}
                    // onLoadEarlier={this.onLoadEarlier}
                    // isLoadingEarlier={this.state.isLoadingEarlier}

            user={{
                _id: Expo.Constants.installationId, // `${Constants.installationId}${Constants.deviceId}`, // sent messages should have same user._id
                name: this.props.userX.nickname,
                // avatar: 'https://www.sais.edu.sg/sites/all/themes/custom/saissg/favicon.ico',
              }}

                    // renderActions={this.renderCustomActions}
                    // renderBubble={this.renderBubble}
                    // renderSystemMessage={this.renderSystemMessage}
            renderCustomView={this.renderCustomView}
                    // renderFooter={this.renderFooter}
                    // showAvatarForEveryMessage
                    // showUserAvatar
                    // parsePatterns={this.parsePatterns}
                    // renderMessage={this.renderBubble}

                    // renderBubble={this.renderBubble.bind(this)}
                    // renderAvatar={this.renderAvatar.bind(this)}
                    // renderTime={this.renderTime.bind(this)}
            showUserAvatar
                    // showAvatarForEveryMessage={true}
            chatId={this.chatId}
                    // minInputToolbarHeight={50}
            bottomOffset={0}
            onPressAvatar={this.avatarPress}
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
