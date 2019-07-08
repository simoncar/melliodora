import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import moment from "moment";

import useGlobal from "./utils/BookmarkStore";

const BookmarkPreview = ({ navigation }) => {

  const [globalState, globalActions] = useGlobal();
  const { loading, bookmarksData } = globalState;
  
  //on Startup
  useEffect(() => {
    globalActions.init();
  }, []);

  renderBookmarkItem = (item) => {
    // console.log("item", item);
    const { campus, studentName, mac, lastSeen, state } = item;
    const studentClass = item.class;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("AttendeeDetailScreen", item)} key={item.mac}>
        <Card containerStyle={styles.bookmarkItemContainer}>
          <View style={styles.avaterContainer}><Avatar rounded title="MD" size="medium" /></View>
          <Text style={styles.bookmarkItemText}>{studentName || "No Name"}</Text>
          <Text style={styles.bookmarkItemText}>{studentClass || "No Class"}</Text>
          <Text style={styles.bookmarkItemText}>{moment(lastSeen).format("LLL")}</Text>
          <Text style={styles.bookmarkItemText}>{state}</Text>
        </Card>
      </TouchableOpacity>

    )
  }

  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
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
