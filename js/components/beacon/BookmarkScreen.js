import React, { useEffect } from 'react'
import { Text, StyleSheet, View, AsyncStorage, FlatList, TouchableOpacity } from 'react-native'
import firebase from "firebase";
import moment from "moment";
import { ListItem } from 'react-native-elements';
import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

import BookmarkHooks from "./hooks/BookmarkHook";

const BookmarkScreen = ({ navigation }) => {

  const { addBookmark, removeBookmark, bookmarksData, bookmarks } = BookmarkHooks();


  _renderItem = (item, index) => {
    const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: 'MD' };

    let onPressFunc, color;

    if (bookmarks.indexOf(item.mac) > -1) {
      onPressFunc = removeBookmark;
      color = "gold";
    } else {
      onPressFunc = addBookmark;
      color = "gray";
    }

    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 14 }}>{item.mac}</Text>
            <Text style={{ flex: 0, flexShrink: 1, fontSize: 8, alignSelf: 'center', justifyContent: 'center', color: 'gray' }}>{item.mac}</Text>
          </View>
        }
        chevron={false}
        subtitle={
          <View style={{ flex: 1, flexDirection: 'column', paddingTop: 8 }}>
            <Text style={{ color: 'gray', fontSize: 12 }}>Class {item.campus}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>last seen {moment(item.lastSeen).format("LLL")}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>current status {item.state}</Text>
          </View>
        }

        rightIcon={
          <TouchableOpacity style={{ paddingRight: 8 }} onPress={() => onPressFunc(item.mac)}>
            <FontAwesome name="star" size={28} color={color} />
          </TouchableOpacity>

        }
        onPress={() => navigation.navigate("AttendeeDetailScreen", item)}
        topDivider={true}
        containerStyle={{ margin: 10 }}
      />
    );
  };

  console.log("bookmarks", bookmarks);
  console.log("bookmarksData", bookmarksData);
  return (
    <View>{bookmarksData.map(this._renderItem)}</View>
  );
}

const styles = StyleSheet.create({});
export default BookmarkScreen;
