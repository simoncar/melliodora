import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Card } from 'react-native-elements';

export default class BookmarkPreview extends Component {

  renderBookmarkItem = () => {

    return (
      <Card containerStyle={styles.bookmarkItemContainer}>
        <View style={styles.avaterContainer}><Avatar rounded title="MD" size="medium" /></View>
        <Text style={styles.bookmarkItemText}>Name</Text>
        <Text style={styles.bookmarkItemText}>Class</Text>
        <Text style={styles.bookmarkItemText}>last seen</Text>
        <Text style={styles.bookmarkItemText}>status</Text>
      </Card>
    )
  }
  render() {
    return (
      <View>
       
        <ScrollView
          horizontal={true}
        >

          {this.renderBookmarkItem()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bookmarkItemContainer: {
    minWidth: 150,
    minHeight: 120
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
