import React, { Component } from "react";
import { FlatList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import * as firebase from "firebase";
import { Container, Content, Text, Button, Icon } from "native-base";
import HeaderContent from "./../headerContent/header/";
import Analytics from "../../lib/analytics";
import { Constants } from "expo";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationProps } from "react-navigation-props-mapper";

import styles from "./styles";


const ChatroomItem = require("./chatroomItem");
let instID = Constants.manifest.extra.instance;

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

@withMappedNavigationProps()
class chatRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userChatrooms: {},
      user: null
    };

    // this.chatRoomsFirebase = firebase.database().ref(`instance/${  instID  }/user/${ global.safeToken}/chatrooms`);

    this.chatRoomsFirebase = firebase.database().ref(`instance/${  instID  }/user/${ global.safeToken}/chatrooms`);
    
    // analytics  -----
    const trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.PAGE_CHAT, trackingOpts);
    // analytics --------
  }

  static navigationOptions = {
    title: "Chat",
    tabBarColor: "green",
    tabBarIcon: tabBarIcon("bubble")
  };

  componentDidMount() {
    this.listenLoadFromFirebase(this.chatRoomsFirebase);
  }

  keyExtractor = item => item._key;

  listenLoadFromFirebase(chatRooms) {

    chatRooms.on("value", dataSnapshot2 => {
      this.props.setUserChatrooms(dataSnapshot2);
      dataSnapshot = dataSnapshot2;
      this.state.userChatrooms = [];

      dataSnapshot.forEach((child) => {
        this.state.userChatrooms.push({
          title: child.key,
          _key: child.key
        });
      });
      this.setState({
        chatRooms,
      });

    });
    
  }

  _renderItem(title, description, contact, url) {
    // {this._renderItem('2JLIU','Jia Liu - Level 3 Washington','jia.liu@sais.edu.sg','https://mystamford.edu.sg/homeroom-2/grade-2/jia-liu-g2-jliu/class-update')}
    // {this._renderItem('4DAYE','Daisy Ye - Level 5 Washington','daisy.ye@sais.edu.sg ','https://mystamford.edu.sg/homeroom-2/grade-4/daisy-ye-g4-daye/class-update')}
    // {this._renderItem('Grade 6','Grade 6 Group Chat','middleschool@sais.edu.sg','https://mystamford.edu.sg/browse-resources/secondary')}

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


    console.log (item);

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
    
          <FlatList
            data={this.state.userChatrooms}
            renderItem={this._renderItem2.bind(this)}
            keyExtractor={this.keyExtractor}
          />

          {this._renderItem('PTA Volunteer Q&A','Be a part of the community')}
          {this._renderItem('Lost and Found','Most Mon-Wed-Fri')}
          {this._renderItem('Stamford 10 Year Gala','May 4th - Sold Out')}


        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(chatRooms);
