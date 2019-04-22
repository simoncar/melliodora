import React, { Component } from 'react';
import {
  Platform, Text, View, Alert, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { ActionSheet } from 'native-base';

import {
  GiftedChat, Actions, Bubble, SystemMessage, Time,
} from 'react-native-gifted-chat';
import { SimpleLineIcons } from '@expo/vector-icons';

import {
  Container, Header, Footer, Button, Icon, Body,
} from 'native-base';
import emojiUtils from 'emoji-utils';
import Constants from 'expo';
import { bindActionCreators } from 'redux';
import CustomActions from './customActions';
import CustomView from './customView';
import CustomImage from './customImage';
import styles from './styles';
import HeaderContent from './../headerContent/header/';

import * as ActionCreators from '../../actions';

import Backend from './backend';
import SlackMessage from './slackMessage';

const BUTTONS = ['Mute conversation', 'Unmute conversation', 'Cancel'];
const CANCEL_INDEX = 2;

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

class chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      step: 0,
      muteState: false,
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

  static navigationOptions = {
    title: 'Chat',
    tabBarColor: '#5AD167',
    tabBarIcon: tabBarIcon('bubble'),
    headerTintColor: 'blue',
    headerStyle: {
      backgroundColor: 'green', 
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentWillMount() {
    if (this.props.userX.nickname) {
      // we have a value, good

    } else {
      this.noNickname();
      this.props.navigation.navigate('login')
    }

    this._isMounted = true;
  }

  componentDidMount() {
    Backend.setChatroom(this.props.navigation.getParam('chatroom'));

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
      console.log ("backend messages = ", messages)
      Backend.SendMessage(messages);
    }

    onReceive(text) {

    }

    renderCustomActions(props) {

        return (
          <CustomActions
            {...props}
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

    renderCustomImage(props) {
      return (
        <CustomImage
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

    renderBubble = (props) => {
      const username = this.props.userX.nickname;
      const color = this.getColor(username);

      myimage = props.currentMessage.image

      if (props.currentMessage.image) {
      return (

        <Bubble
          {...props}       
          wrapperStyle={{
            left: {
              backgroundColor: 'white',
            },
            right: {
              backgroundColor: 'white',
            },
          }}
        />

      ) } else {
        return (

          <Bubble
            {...props}
            textStyle={{
              right: {
                color: 'white',
              },
            }}
          />
        ) 
      }
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

    _showActionSheet() {
      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          // destructiveButtonIndex: DESTRUCTIVE_INDEX,
          title: 'Mute options',
        },
        (buttonIndex) => {
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

    render() {
      return (

        <Container>
          <HeaderContent
            showBack="true"
            showHome="false"
            navigation={this.props.navigation} 
          />
          <View>
          <Text style={styles.chatBanner}>{this.props.navigation.getParam('description')}</Text>
            <Text style={styles.chatBanner}>{this.props.navigation.getParam('contact')}</Text>
          </View>
          <TouchableOpacity onPress={this._showActionSheet}>
            <Text style={styles.chatHeading}>{this.props.navigation.getParam('chatroom')}</Text>

          </TouchableOpacity>

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

           renderActions={this.renderCustomActions}
                    // renderSystemMessage={this.renderSystemMessage}
            renderCustomView={this.renderCustomView}
            renderMessageImage={this.renderCustomImage}
                    // renderFooter={this.renderFooter}
                    // showAvatarForEveryMessage
                    // showUserAvatar
                    // parsePatterns={this.parsePatterns}
                    // renderMessage={this.renderBubble}

            renderBubble={this.renderBubble}
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
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(chat);
