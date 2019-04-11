import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image, View, Platform, Slider } from "react-native";
import { connect } from "react-redux";

import { Actions } from "react-navigation";
import { Container, Content, Text, Button, Icon } from "native-base";

import Modal from "react-native-simple-modal";
import Swiper from "react-native-swiper";
import { openDrawer } from "../../actions/drawer";

import HeaderContent from "./../headerContent/header/";
import Analytics from "../../lib/analytics";
import { Constants, Notifications } from "expo";

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

class campusMap extends Component {
  static propTypes = {
    navigation: PropTypes.shape({ key: PropTypes.string }),
    username: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      animationType: "slideInDown",
      open: false
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

  _renderItem(item,description) {
    return (
      <ChatroomItem 
        navigation={this.props.navigation} 
        item={item} 
        description={description}
      />
    );
  }

  render() {
    return (
      <Container>
        <HeaderContent navigation={this.props.navigation} />
        <Content showsVerticalScrollIndicator showsHorizontalScrollIndicator>
          <Text style={styles.heading}>PTA and School Messages</Text>



          {this._renderItem('PTA Volunteer Q&A','Be a part of the community')}


          {this._renderItem('Parent Helpdesk','Open 9-3pm School days')}


          {this._renderItem('Lost and Found','Most Mon-Wed-Fri')}


          {this._renderItem('10 Year Gala','May 4th - Sold Out')}


          {this._renderItem('4DAYE - Daisy Ye','Level 5 Washington')}



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
)(campusMap);
