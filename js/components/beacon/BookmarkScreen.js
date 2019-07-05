import React, {useEffect} from 'react'
import { Text, StyleSheet, View, AsyncStorage, FlatList, TouchableOpacity } from 'react-native'
import firebase from "firebase";
import moment from "moment";
import { ListItem } from 'react-native-elements';
import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

import BookmarkHooks from "./hooks/BookmarkHook2";

const BookmarkScreen = () => {

  const { addBookmark, removeBookmark, retrieveBookmarkData, checkBookmarked, bookmarksData } = BookmarkHooks();

  console.log("bookmarksData",bookmarksData);
  return(
    <Text>{JSON.stringify(bookmarksData)}</Text>
  );
}

const styles = StyleSheet.create({});
export default BookmarkScreen;
