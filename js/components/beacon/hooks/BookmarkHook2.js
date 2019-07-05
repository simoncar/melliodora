import React, { useState, useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import firebase from "firebase";

const BookmarkHook = () => {
  const [bookmarksData, setBookmarksData] = useState([]);


  useEffect(() => {
    function getData(bm) {

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
  });



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

  return { addBookmark, removeBookmark, retrieveBookmarkData, checkBookmarked, bookmarksData }
}

export default BookmarkHook
