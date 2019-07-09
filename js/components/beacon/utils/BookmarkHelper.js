import React, { useState, useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import firebase from "firebase";

import useGlobal from "./BookmarkStore.js";

const BookmarkHook = () => {
  const [bookmarksData, setBookmarksData] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    function getData(bm) {

      if (!bm || bm == []) return [];

      // const data = [];
      const docRef = firebase
        .firestore()
        .collection("sais_edu_sg")
        .doc("beacon")
        .collection("beacons");

      console.log("bookmarks", bm);
      return Promise.all(bm.map(
        bookmark => (
          docRef.doc(bookmark).get().then(function (doc) {
            if (doc.exists) {
              return doc.data();
            } else {
              console.log("No such document!");
            }
          }).catch(function (error) {
            console.log("Error getting document:", error);
          })
        )))
        .then(function (data) {
          return data
        });
    }

    retrieveBookmarkData()
      .then((bookmarks) => getData(bookmarks))
      .then(data => setBookmarksData(data));
  }, []);

  useEffect(() => {
    _setBookmarks()
  }, []);

  addBookmark = async (mac) => {

    const bookmarks = await retrieveBookmarkData();
    const updatedBookmarks = bookmarks.filter(e => e !== mac);
    updatedBookmarks.push(mac)
    return await AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarks))
      .then(() => _setBookmarks());
  }

  removeBookmark = async (mac) => {
    const bookmarks = await retrieveBookmarkData();
    const updatedBookmarks = bookmarks.filter(e => e !== mac);
    return await AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarks))
      .then(() => _setBookmarks());

  }


  retrieveBookmarkData = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('myBookmarks') || []
      return JSON.parse(bookmarks || []);
    } catch (error) {
      // Error retrieving data
    }
  };

  checkBookmarked = async (mac) => {
    console.log("hit check bookmarked");
    const bookmarks = await retrieveBookmarkData();
    console.log("bookmarks", bookmarks, mac);
    if (bookmarks.indexOf(mac) > -1) {
      return true;
    } else {
      return false;
    }
  }

  _setBookmarks = async () => {
    const bookmarks = await retrieveBookmarkData();;
    setBookmarks(bookmarks);
  }

  return { addBookmark, removeBookmark, retrieveBookmarkData, checkBookmarked, bookmarksData, bookmarks }
}

export default BookmarkHook
