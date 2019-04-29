import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";

import { Container, Content, Text, Button, Icon } from "native-base";
import styles from "./styles";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { isAdmin } from "../global.js";
import { Image } from "react-native-expo-image-cache";

const { width } = Dimensions.get("window");

class ChatroomItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //var photoSquare = this.props.item.item.photoSquare;
    //var photo1 = this.props.item.item.photo1;

    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
    };
   //const uri = this.props.item.item.photo1;

    return (
     
  //     return (<TouchableOpacity onPress={() => this.onPressChat(item)}>
  //     <View style={styles.chatItemContainer}>
  //         <ChatIconView style={styles.chatItemIcon} participants={item.participants} />
  //         <View style={styles.chatItemContent}>
  //             <Text style={styles.chatFriendName}>{title}</Text>
  //             <View style={styles.content}>
  //                 <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.message}>{this.formatMessage(item)} · {AppStyles.utils.timeFormat(item.lastMessageDate)}</Text>
  //             </View>
  //         </View>
  //     </View>
  // </TouchableOpacity>);


      
     <View style={styles.chatRow}>
        <TouchableOpacity  style={{ flexDirection: 'row' }}  onPress={() => {   this.props.navigation.navigate('chat',
                 { chatroom: this.props.title ,
                    description:this.props.description,
                    contact:this.props.contact,
                    url:this.props.url,
                }); 
                  }}>
        <Button
        
          transparent
          style={styles.roundedButton}
          onPress={() => { 
            this.props.navigation.navigate('chat',
                 { chatroom: this.props.title ,
                    description:this.props.description,
                    contact:this.props.contact,
                    url:this.props.url,
                }); 
             }}
        >
          <Icon style={styles.icon} name="ios-chatbubbles" />
        </Button>

        <View>
             <Text style={styles.chatTitle}>{this.props.title}</Text>
             <Text style={styles.chatDescription}>{this.props.description}</Text>
        </View>

        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = ChatroomItem;
