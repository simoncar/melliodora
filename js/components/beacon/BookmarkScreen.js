import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, AsyncStorage, FlatList, TouchableOpacity } from 'react-native'
import firebase from "firebase";
import moment from "moment";
import { ListItem } from 'react-native-elements';
import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

import useGlobal from "./utils/BookmarkStore";

const BookmarkScreen = ({ navigation }) => {

  const [globalState, globalActions] = useGlobal();
  const { loading, bookmarksData, bookmarks } = globalState;

  const [initialbookmarksData, setInitialbookmarksData] = useState([]);
  //on Startup
  useEffect(() => {
    globalActions.init()
    .then(() => setInitialbookmarksData([...bookmarksData].reverse()));
  }, []);

  _renderItem = (item, index) => {
    const firstName = item.firstName || "" ;
    const lastName  = item.lastName || "";
    const avatarTitle = firstName.slice(0,1) + lastName.slice(0,1);
    const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: avatarTitle };

    let onPressFunc, color;
    console.log(index, "index");
    if (bookmarks.indexOf(item.mac) > -1) {
      onPressFunc = () => globalActions.removeBookmark(item.mac);
      color = "gold";
    } else {
      
      onPressFunc = () => globalActions.addBookmarkWithInfo(item, initialbookmarksData.length-1-index);
      color = "gray";
    }
    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 14 }}>{item.fullname || "No Name"}</Text>
            <Text style={{ flex: 0, flexShrink: 1, fontSize: 8, alignSelf: 'center', justifyContent: 'center', color: 'gray' }}>{item.mac}</Text>
          </View>
        }
        chevron={false}
        subtitle={
          <View style={{ flex: 1, flexDirection: 'column', paddingTop: 8 }}>
            <Text style={{ color: 'gray', fontSize: 12 }}>Class {item.class}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>last seen {moment(item.lastSeen).format("LLL")}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>{item.state}</Text>
          </View>
        }

        rightIcon={
          <TouchableOpacity style={{ paddingRight: 8 }} onPress={onPressFunc}>
            <FontAwesome name="star" size={28} color={color} />
          </TouchableOpacity>

        }
        onPress={() => navigation.navigate("AttendeeDetailScreen", item)}
        topDivider={true}
        containerStyle={{ margin: 10 }}
      />
    );
  };

  return (
    <View>{initialbookmarksData.map(this._renderItem)}</View>
  );
}

const styles = StyleSheet.create({});
export default BookmarkScreen;
