import PropTypes from "prop-types";
import React, { Component } from "react";
import { FlatList } from "react-native";
import { connect } from "react-redux";

import { Container, Content, Text, Button, Icon } from "native-base";

import Modal from "react-native-simple-modal";
import Swiper from "react-native-swiper";
import { openDrawer } from "../../actions/drawer";

import HeaderContent from "./../headerContent/header/";
import Analytics from "../../lib/analytics";
import { Constants, Notifications } from "expo";
import Backend from './backend';

import { SimpleLineIcons } from "@expo/vector-icons";

import styles from "./styles";

const ChatroomItem = require('./chatroomItem');

const primary = require("../../themes/variable").brandPrimary;

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

class chatRooms extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animationType: "slideInDown",
      open: false,
      userChatrooms: {},
    };
  }

  static navigationOptions = {
    title: "Chat",
    tabBarColor: "green",
    tabBarIcon: tabBarIcon("bubble"),
    headerTintColor: "blue",
    headerStyle: {
      backgroundColor: "green"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  componentDidMount() {

    this.state.userChatrooms = [];

    Backend.userRooms((chatRooms) => {
    
      this.state.userChatrooms.push({
        title: chatRooms.chatroom
      })
    });
  }
  
  keyExtractor = item => item._key;

  _renderItem(title,description, contact, url) {
    // {this._renderItem('2JLIU','Jia Liu - Level 3 Washington','jia.liu@sais.edu.sg','https://mystamford.edu.sg/homeroom-2/grade-2/jia-liu-g2-jliu/class-update')}
    // {this._renderItem('4DAYE','Daisy Ye - Level 5 Washington','daisy.ye@sais.edu.sg ','https://mystamford.edu.sg/homeroom-2/grade-4/daisy-ye-g4-daye/class-update')}
    // {this._renderItem('Grade 6','Grade 6 Group Chat','middleschool@sais.edu.sg','https://mystamford.edu.sg/browse-resources/secondary')}
    console.log("rrrrrrrrr", this.props.navigation)
    //ken{YQNwZDOkv0QdHUlDV-T5HQ}  - Simon
    return (
      <ChatroomItem 
        navigation={this.props.navigation} 
        title={title}
        description={description}
        contact={contact}
        url={url}
      />
    );
  }

  _renderItem2(item) {
    // {this._renderItem('2JLIU','Jia Liu - Level 3 Washington','jia.liu@sais.edu.sg','https://mystamford.edu.sg/homeroom-2/grade-2/jia-liu-g2-jliu/class-update')}
    // {this._renderItem('4DAYE','Daisy Ye - Level 5 Washington','daisy.ye@sais.edu.sg ','https://mystamford.edu.sg/homeroom-2/grade-4/daisy-ye-g4-daye/class-update')}
    // {this._renderItem('Grade 6','Grade 6 Group Chat','middleschool@sais.edu.sg','https://mystamford.edu.sg/browse-resources/secondary')}
console.log("ffffffffff", this.props.navigation)
    //ken{YQNwZDOkv0QdHUlDV-T5HQ}  - Simon
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
        <HeaderContent navigation={this.props.navigation} />
        <Content>
          <Text style={styles.heading}>PTA Messages </Text>
          {this._renderItem('PTA Volunteer Q&A','Be a part of the community')}
          {this._renderItem('Lost and Found','Most Mon-Wed-Fri')}
          {this._renderItem('Stamford 10 Year Gala','May 4th - Sold Out')}

          <FlatList
              data={this.state.userChatrooms}
              renderItem={this._renderItem2.bind(this)}
              keyExtractor={this.keyExtractor}
            />

        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer())
  };
}

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user
});

export default connect(
  mapStateToProps,
  bindAction
)(chatRooms);
