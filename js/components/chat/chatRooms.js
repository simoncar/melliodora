import React, { Component } from "react";
import { FlatList } from "react-native";
import * as firebase from "firebase";
import { Container, Content } from "native-base";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import styles from "./styles";
import I18n from "../../lib/i18n";

const ChatroomItem = require("./chatroomItem");

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

@withMappedNavigationParams()
class chatRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userChatrooms: {},
    };

    this.ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("chat")
      .collection("chatrooms");
  }

  static navigationOptions = {
    title: I18n.t("chat"),
    tabBarIcon: tabBarIcon("bubble"),
    headerBackTitle: null,
  };

  componentDidMount() {
    try {
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    } catch (e) {
      console.error(e.message);
    }
  }

  onCollectionUpdate = chatRooms => {
    var userChatrooms = [];
    chatRooms.forEach(doc => {
      userChatrooms.push({
        title: doc.data().title,
        _key: doc.data().key,
      });
    });

    this.setState({
      userChatrooms,
    });
  };

  keyExtractor = item => item._key;

  _renderItem(item) {
    return (
      <ChatroomItem
        navigation={this.props.navigation}
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
