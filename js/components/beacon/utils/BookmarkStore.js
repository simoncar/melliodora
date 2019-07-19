import React from "react";
import useGlobalHook from "use-global-hook";
import { AsyncStorage } from "react-native";
import firebase from "firebase";

const initialState = {
  loading: true,
  bookmarks: [],
  bookmarksData: [],
  initial: true,
};

// Actions
const init = async store => {
  try {
    console.log("init1");
    if (store.state.initial == false) return;
    console.log("init2");
    const bookmarks = await retrieveBookmarks();
    const bookmarksData = await getData(bookmarks.filter(b => typeof b === "string"));
    // const updatedBookmarksData = bookmarksData.filter(b => { if (b) return b });
    // const updatedBookmarks = updatedBookmarksData.filter(b => b.mac);

    const { bk, bkData } = bookmarksData.reduce(
      (a, b) => {
        if (b) {
          a.bk.push(b.mac);
          a.bkData.push(b);
        }
        return a;
      },
      { bk: [], bkData: [] },
    );

    AsyncStorage.setItem("myBookmarks", JSON.stringify(bk));
    store.setState({ initial: false, bookmarks: bk, bookmarksData: bkData, loading: false });
  } catch (error) {
    console.log("Bookmarks init", error);
  }
};

const _removeBookamarksWithMac = (mac, bookmarksData) => {
  var updatedBookmarks = [];
  var updatedBookmarksData = [];

  return ({ updatedBookmarks, updatedBookmarksData } = bookmarksData.reduce(
    (a, b, i) => {
      if (b.mac !== mac) {
        a.updatedBookmarks.push(b.mac);
        a.updatedBookmarksData.push(b);
      }
      return a;
    },
    { updatedBookmarks: [], updatedBookmarksData: [] },
  ));
};

const addBookmarkWithInfo = (store, bookmarkInfo, insertIndex = null) => {
  console.log("hit add 2");

  store.setState({ loading: true });
  const bookmarksData = store.state.bookmarksData;
  const { updatedBookmarks, updatedBookmarksData } = _removeBookamarksWithMac(bookmarkInfo.mac, bookmarksData);
  if (typeof insertIndex == "number") {
    updatedBookmarks.splice(insertIndex, 0, bookmarkInfo.mac);
    updatedBookmarksData.splice(insertIndex, 0, bookmarkInfo);
  } else {
    updatedBookmarks.push(bookmarkInfo.mac);
    updatedBookmarksData.push(bookmarkInfo);
  }

  AsyncStorage.setItem("myBookmarks", JSON.stringify(updatedBookmarks)).then(() =>
    store.setState({ bookmarks: updatedBookmarks, bookmarksData: updatedBookmarksData, loading: false }),
  );
};

const addBookmark = (store, mac) => {
  console.log("hit add");

  store.setState({ loading: true });
  const bookmarks = store.state.bookmarks;
  const updatedBookmarks = bookmarks.filter(e => e !== mac);
  updatedBookmarks.push(mac);
  AsyncStorage.setItem("myBookmarks", JSON.stringify(updatedBookmarks))
    .then(() => getData(updatedBookmarks))
    .then(bookmarksData =>
      store.setState({ bookmarks: updatedBookmarks, bookmarksData: bookmarksData, loading: false }),
    );
};

const removeBookmark = (store, mac) => {
  console.log("hit remove");
  store.setState({ loading: true });
  const bookmarksData = store.state.bookmarksData;
  const { updatedBookmarks, updatedBookmarksData } = _removeBookamarksWithMac(mac, bookmarksData);
  AsyncStorage.setItem("myBookmarks", JSON.stringify(updatedBookmarks)).then(() =>
    store.setState({ bookmarks: updatedBookmarks, bookmarksData: updatedBookmarksData, loading: false }),
  );
};

const retrieveBookmarks = async () => {
  try {
    const bookmarks = (await AsyncStorage.getItem("myBookmarks")) || [];
    return JSON.parse(bookmarks || []);
  } catch (error) {
    // Error retrieving data
  }
};

const getData = bm => {
  try {
    if (!bm || bm == []) return [];

    // const data = [];
    const docRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons");

    console.log("bookmarks", bm);
    return Promise.all(
      bm.map(bookmark =>
        docRef
          .doc(bookmark)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              return doc.data();
            } else {
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          }),
      ),
    ).then(function(data) {
      return data;
    });
  } catch (error) {
    console.log("Bookmarks getData", error);
  }
};

const actions = { init, addBookmark, removeBookmark, addBookmarkWithInfo };
const useBookmarkHook = useGlobalHook(React, initialState, actions);

export default useBookmarkHook;
