import React, { Component } from "react";
import { FlatList, AsyncStorage } from "react-native";
import * as firebase from "firebase";
import { Container, Content } from "native-base";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import styles from "./styles";
import I18n from "../../lib/i18n";
import ChatroomItem from "./chatroomItem";

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

@withMappedNavigationParams()
class chatRooms extends Component {
  static navigationOptions = {
    title: I18n.t("chat"),
    tabBarIcon: tabBarIcon("bubble"),
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userChatrooms: {},
    };
  }

  componentWillMount() {
    this.loadFromAsyncStorage();
    var userChatrooms = [];
    firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("chat")
      .collection("chatrooms")
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No notifications");
          return;
        }
        snapshot.forEach(doc => {
          item = doc.data();
          userChatrooms.push({
            chatroom: doc.id,
            title: doc.data().title,
          });
        });

        AsyncStorage.setItem("userChatrooms", JSON.stringify(userChatrooms));

        this.setState({
          userChatrooms,
        });
      });
  }

  keyExtractor = item => item.chatroom;

  loadFromAsyncStorage() {
    AsyncStorage.getItem("userChatrooms").then(fi => {
      var userChatrooms = JSON.parse(fi);
      this.setState({
        userChatrooms,
        loading: false,
      });
    });
  }

  _renderItem(item) {
    return (
      <ChatroomItem
        navigation={this.props.navigation}
        chatroom={item.item.chatroom}
        title={item.item.title}
        description={item.item.description}
        contact={item.item.contact}
        url={item.item.url}
        item={item}
      />
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content style={{ paddingTop: 20 }}>
          <FlatList
            data={this.state.userChatrooms}
            renderItem={this._renderItem.bind(this)}
            keyExtractor={this.keyExtractor}
          />
        </Content>
      </Container>
    );
  }
}

export default chatRooms;
