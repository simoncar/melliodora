import React, { Component } from "react";
import { FlatList, View, AsyncStorage, Text, TouchableOpacity } from "react-native";
import * as firebase from "firebase";
import { Container, Content } from "native-base";
import { SimpleLineIcons, Entypo, AntDesign } from "@expo/vector-icons";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import styles from "./styles";
import I18n from "../../lib/i18n";
import ChatroomItem from "./chatroomItem";

var specialChatrooms = {};

@withMappedNavigationParams()
class chatRooms extends Component {
  static navigationOptions = {
    title: I18n.t("chat"),
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 28,
    },
    tabBarIcon: <SimpleLineIcons style={{ backgroundColor: "transparent" }} name={"bubble"} color={"blue"} size={24} />,
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userChatrooms: {},
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      refresh: this.refresh,
    });

    this.buildChatroomList();
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      console.log("chatRooms is focused");
      this.buildChatroomList();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  refresh = ({ title }) => {
    console.log("nav refresh BBBB ", title);
    //this.props.navigation.setParams({ title: title });
  };

  keyExtractor = item => item.chatroom;

  buildChatroomList() {
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
      .orderBy("title")
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No notifications");
          return;
        }
        snapshot.forEach(doc => {
          item = doc.data();
          if (doc.data().type == "public" || doc.data().type == "user") {
            if (doc.data().visible != false) {
              userChatrooms.push({
                chatroom: doc.id,
                title: doc.data().title,
                type: doc.data().type,
              });
            }
          }
        });

        AsyncStorage.setItem("userChatrooms", JSON.stringify(userChatrooms));

        this.setState({
          userChatrooms,
        });
      });
  }

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
        type={item.item.type}
        item={item}
      />
    );
  }

  render() {
    console.log(this.state.userChatrooms);
    return (
      <Container style={styles.container}>
        <Content style={{ paddingTop: 20 }}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              this.props.navigation.navigate("chatTitle", {
                edit: false,
                chatroom: "New Chatroom",
                onGoBack: this.refresh,
              });
            }}
          >
            <View style={styles.rowView}>
              <AntDesign style={styles.iconLeft} name="pluscircleo" />
              <Text style={styles.chatTitle}>New Chat Group</Text>
              <Entypo style={styles.iconRight} name="chevron-right" />
            </View>
          </TouchableOpacity>

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
