import React, { Component } from "react";
import { FlatList, View, AsyncStorage, TouchableOpacity, TouchableHighlight } from "react-native";
import * as firebase from "firebase";
import { Container, Content, Text } from "native-base";
import { SimpleLineIcons, Entypo, AntDesign } from "@expo/vector-icons";
import styles from "./styles";

import I18n from "../../lib/i18n";
import ChatroomItem from "./chatroomItem";
import Analytics from "../../lib/analytics";
import _ from "lodash";
import { buildChatroomList } from "../../store/community";
import { connect } from "react-redux";

var specialChatrooms = {};

class chatRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userChatrooms: {},
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      refresh: this.refresh,
    });

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      console.log("chatRooms is focused");
      this.props.dispatch(buildChatroomList());
    });

    Analytics.track("Chatrooms");
  }

  componentWillUnmount() {
    // Remove the event listener
    //this.focusListener.remove();
  }

  refresh = ({ title }) => {
    //this.props.navigation.setParams({ title: title });
  };

  keyExtractor = (item) => item.chatroom;

  _renderItem({ item }) {
    return <ChatroomItem {...item} navigation={this.props.navigation} card={true} />;
  }
  _renderItemNoCard({ item }) {
    return <ChatroomItem {...item} navigation={this.props.navigation} card={false} />;
  }

  render() {
    const card = this.props.card === false ? false : true;
    return (
      <Container style={styles.homeContainer}>
        <TouchableHighlight
          style={styles.addButton}
          underlayColor="#ff7043"
          onPress={() => {
            this.props.navigation.navigate("chatTitle", {
              edit: false,
              chatroom: "New Chatroom",
              onGoBack: this.refresh,
            });
          }}
        >
          <Text style={{ fontSize: 44, color: "white", position: "absolute", left: "20%", top: "-20%" }}>+</Text>
        </TouchableHighlight>
        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.newsContentLine}>
            <View>
              <View style={card && styles.card}>
                <View style={{ flexDirection: "row", paddingRight: 4, justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
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
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <AntDesign style={styles.iconLeftPlus} name="pluscircleo" />
                      <Text style={styles.cardTitle}>New Chat Group</Text>
                      <Entypo style={styles.iconRight} name="chevron-right" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <FlatList style={styles.card} data={this.props.community.userChatrooms} renderItem={this._renderItemNoCard.bind(this)} keyExtractor={this.keyExtractor} />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  community: state.community,
});
export default connect(mapStateToProps)(chatRooms);
