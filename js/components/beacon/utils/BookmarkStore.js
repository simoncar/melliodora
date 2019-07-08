import React from "react";
import useGlobalHook from "use-global-hook";
import { AsyncStorage } from 'react-native'
import firebase from "firebase";

const initialState = {
  loading: true,
  bookmarks: [],
  bookmarksData: [],
  initial: true
};


// Actions
const init = async store => {
  console.log("init1");
  if (store.state.initial == false) return;
  console.log("init2");
  const bookmarks = await retrieveBookmarks();
  const bookmarksData = await getData(bookmarks);

  store.setState({ initial: false, bookmarks: bookmarks, bookmarksData: bookmarksData, loading: false });
}

const addBookmark = (store, mac) => {
  console.log("hit add");

  store.setState({ loading: true });
  const bookmarks = store.state.bookmarks;
  const updatedBookmarks = bookmarks.filter(e => e !== mac);
  updatedBookmarks.push(mac)
  AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarks))
  .then(() => getData(updatedBookmarks))
  .then(bookmarksData => store.setState({ bookmarks: updatedBookmarks, bookmarksData: bookmarksData, loading: false }));
}

const removeBookmark = (store, mac) => {
  console.log("hit remove");
  store.setState({ loading: true });
  const bookmarks = store.state.bookmarks;
  const updatedBookmarks = bookmarks.filter(e => e !== mac);

  const bookmarksData = store.state.bookmarksData;
  const updatedBookmarksData = bookmarksData.filter(e => e.mac !== mac);

  AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarks))
  .then(() => store.setState({ bookmarks: updatedBookmarks, bookmarksData: updatedBookmarksData, loading: false }));
}

const retrieveBookmarks = async () => {
  try {
    const bookmarks = await AsyncStorage.getItem('myBookmarks') || []
    return JSON.parse(bookmarks || []);
  } catch (error) {
    // Error retrieving data
  }
};

const getData = (bm) => {

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

const actions = { init, addBookmark, removeBookmark };
const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;
