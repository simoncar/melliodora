import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import firebase from "firebase";

import BookmarkHooks from "./hooks/BookmarkHook";

const { retrieveBookmarkData } = BookmarkHooks();

export default class BookmarkPreview extends Component {


  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      bookmarksData: []
    }
  }

  componentDidMount() {
    retrieveBookmarkData()
      .then((bookmarks) => this.setState({ bookmarks }))
      .then(() => this.getData())
      .then(data => this.setState({
        bookmarksData: data.slice(-10).reverse(),
        loading: false
      }));


  }

  async getData() {

    // const data = [];
    const docRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons");

    const data = Promise.all(this.state.bookmarks.map(
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
      )));
    return data;
  }
  renderBookmarkItem = (item) => {
    const {campus, studentName, studentClass, mac, lastseen, state} = item;
    return (
      <Card containerStyle={styles.bookmarkItemContainer}>
        <View style={styles.avaterContainer}><Avatar rounded title="MD" size="medium" /></View>
        <Text style={styles.bookmarkItemText}>{studentName || "No Name"}</Text>
        <Text style={styles.bookmarkItemText}>{studentClass || "No Class"}</Text>
        <Text style={styles.bookmarkItemText}>{lastseen}</Text>
        <Text style={styles.bookmarkItemText}>{state}</Text>
      </Card>
    )
  }
  render() {
    return (
      <View>

        <ScrollView
          horizontal={true}
        >
          {this.state.bookmarksData.map(e => this.renderBookmarkItem(e))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bookmarkItemContainer: {
    minWidth: 150,
    minHeight: 120,
    marginLeft: 8,
    marginRight: 0,
    borderRadius: 25
  },
  avaterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  bookmarkItemText: {
    fontSize: 12,
    color: 'gray'
  }
})
