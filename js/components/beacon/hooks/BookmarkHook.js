import React from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import _ from "lodash";

const BookmarkHook = () => {


  addBookmark = async (bookmarkObj) => {
    console.log("hit add bk");
    const bookmarks = await retrieveBookmarkData();
    if (bookmarks) {
      // add bookmark to existing bookmarks list
      bookmarks.push(bookmarkObj)
    }

    return await AsyncStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  }

  removeBookmark = async (mac) => {
    const bookmarks = await retrieveBookmarkData();
    if (bookmarks) {
      // add bookmark to existing bookmarks list
      _.remove(bookmarks, { 'mac': mac });
    }
    return await AsyncStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  }


  retrieveBookmarkData = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('myBookmarks')
      return JSON.parse(bookmarks) || [];
    } catch (error) {
      // Error retrieving data
    }
  };

  checkBookmarked = async (mac) => {
    const bookmarks = await retrieveBookmarkData();
    if (_.find(bookmarks, { 'mac': mac })) {
      return true;
    } else {
      return false;
    }
  }

  return {addBookmark, removeBookmark, retrieveBookmarkData, checkBookmarked}
}

export default BookmarkHook
