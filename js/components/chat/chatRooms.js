import React, { Component } from "react";
import { FlatList, AsyncStorage } from "react-native";
import * as firebase from "firebase";
import { Container, Content } from "native-base";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import styles from "./styles";
import I18n from "../../lib/i18n";
import ChatroomItem from "./chatroomItem";
import Constants from "expo-constants";

var specialChatrooms = {};

@withMappedNavigationParams()
class chatRooms extends Component {
  static navigationOptions = {
    title: I18n.t("chat"),
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 28,
    },
    tabBarIcon: <SimpleLineIcons style={{ backgroundColor: "transparent" }} name={"bubble"} color={"grey"} size={24} />,
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userChatrooms: {},
    };
  }

  componentWillMount() {
    var userChatrooms = [];

    if (global.email == "christinathorsen@gmail.com") {
      specialChatrooms = {
        chatroom: "sealysicochat",
        title: "App Developers Chat",
      };
      userChatrooms.push(specialChatrooms);
    }
    this.loadFromAsyncStorage();

    firebase
      .firestore()
      .collection(global.domain)
      .doc("chat")
      .collection("chatrooms")
      .where("type", "==", "public")
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
    console.log(this.state.userChatrooms);
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
