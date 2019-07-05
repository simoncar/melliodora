import React from 'react'
import { AsyncStorage } from 'react-native'

const BookmarkHook = () => {


  addBookmark = async (mac) => {

    const bookmarks = await retrieveBookmarkData();
    const updatedBookmarks = bookmarks.filter(e => e !== mac);
    updatedBookmarks.push(mac)
    return await AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarks));
  }

  removeBookmark = async (mac) => {
    const bookmarks = await retrieveBookmarkData();
    const updatedBookmarks = bookmarks.filter(e => e !== mac);
    return await AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarks));
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

    if (bookmarks.indexOf(mac) > -1) {
      return true;
    } else {
      return false;
    }
  }

  return { addBookmark, removeBookmark, retrieveBookmarkData, checkBookmarked }
}

export default BookmarkHook
