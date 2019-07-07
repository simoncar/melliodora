import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import firebase from "firebase";

import BookmarkHooks from "./hooks/BookmarkHook2";

const BookmarkPreview = ({ navigation }) => {
  const { bookmarksData } = BookmarkHooks();

  renderBookmarkItem = (item) => {
    // console.log("item", item);
    const { campus, studentName, studentClass, mac, lastSeen, state } = item;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("AttendeeDetailScreen", item) }>
        <Card containerStyle={styles.bookmarkItemContainer}>
          <View style={styles.avaterContainer}><Avatar rounded title="MD" size="medium" /></View>
          <Text style={styles.bookmarkItemText}>{studentName || "No Name"}</Text>
          <Text style={styles.bookmarkItemText}>{studentClass || "No Class"}</Text>
          <Text style={styles.bookmarkItemText}>{lastSeen} </Text>
          <Text style={styles.bookmarkItemText}>{state}</Text>
        </Card>
      </TouchableOpacity>

    )
  }

  return (
    <View>
      <ScrollView
        horizontal={true}
      >
        {bookmarksData.map(e => renderBookmarkItem(e))}
        <View style={{ marginLeft: 8 }}></View>
      </ScrollView>
    </View>
  )
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
});

export default BookmarkPreview;
