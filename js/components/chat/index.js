import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import { Expo, Constants } from 'expo';

import { Actions as NavigationActions } from 'react-native-router-flux';
import { GiftedChat, Actions, Bubble, SystemMessage } from 'react-native-gifted-chat';
import { Container, Content, Header, Footer, Button, Icon, Body } from 'native-base';
import CustomActions from './customActions';
import CustomView from './customView';
import styles from './styles';

import Backend from './backend';

export default class Chat extends React.Component {
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
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.append(previousState.messages, message)
                };
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        Backend.closeChat();
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });

        setTimeout(() => {
            if (this._isMounted === true) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.prepend(previousState.messages, require('./old_messages.js')),
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    };
                });
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
            'Cancel': () => { },
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
                    }
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
                                    style={styles.headerIcons} />
                            </Button>
                        </View>
                        <Body>
                            <Text style={styles.chatHeading}>{this.props.chatroom}</Text>

                        </Body>
                        <View>

                        </View>
                    </View>
                </Header>

                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend}
                    //loadEarlier={this.state.loadEarlier}
                    //onLoadEarlier={this.onLoadEarlier}
                    //isLoadingEarlier={this.state.isLoadingEarlier}

                    user={{
                        _id: Constants.deviceId, // sent messages should have same user._id
                        name: 'simon test',
                    }}

                    //renderActions={this.renderCustomActions}
                    //renderBubble={this.renderBubble}
                    //renderSystemMessage={this.renderSystemMessage}
                    renderCustomView={this.renderCustomView}
                    //renderFooter={this.renderFooter}
                    parsePatterns={this.parsePatterns}
                    showAvatarForEveryMessage={true}
                />

                <Footer style={styles.footer}>
                </Footer>
            </Container>
        );
    }
}

