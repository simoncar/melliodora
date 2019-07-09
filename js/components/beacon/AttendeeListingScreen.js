// Imports: Dependencies
import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from "moment";

import firebase from "firebase";

// Screen Dimensions
const { height, width } = Dimensions.get('window');
// Screen: Infinite Scroll
export default class AttendeeListingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentData: [],
      limit: 9,
      lastVisible: null,
      loading: false,
      refreshing: false,
    };
  }
  // Component Did Mount

  componentDidMount = () => {
    try {

      // Cloud Firestore: Initial Query
      this.retrieveData();
    }
    catch (error) {
      console.log(error);
    }
  };
  // Retrieve Data
  retrieveData = async () => {
    try {

      // Set State: Loading
      this.setState({
        loading: true,
      });
      console.log('Retrieving Data');
      // Cloud Firestore: Query

      let initialQuery = await firebase
        .firestore()
        .collection("sais_edu_sg")
        .doc("beacon")
        .collection("beacons")
        .orderBy('mac')
        .limit(this.state.limit);

      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get();
      // Cloud Firestore: Document Data
      let documentData = documentSnapshots.docs.map(document => document.data());
      // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
      let lastVisible = documentData[documentData.length - 1].mac;
      console.log("lastVisible", lastVisible);
      // Set State
      this.setState({
        documentData: documentData,
        lastVisible: lastVisible,
        loading: false,
      });
    }
    catch (error) {
      console.log(error);
    }
  };
  // Retrieve More
  retrieveMore = async () => {
    try {

      // Set State: Refreshing
      this.setState({
        refreshing: true,
      });
      console.log('Retrieving additional Data');
      // Cloud Firestore: Query (Additional Query)
      let additionalQuery = await firebase
        .firestore()
        .collection("sais_edu_sg")
        .doc("beacon")
        .collection("beacons")
        .orderBy('mac')
        .startAfter(this.state.lastVisible)
        .limit(this.state.limit)
      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await additionalQuery.get();
      // Cloud Firestore: Document Data
      let documentData = documentSnapshots.docs.map(document => document.data());
      // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
      let lastVisible = documentData[documentData.length - 1].mac;
      // Set State
      this.setState({
        documentData: [...this.state.documentData, ...documentData],
        lastVisible: lastVisible,
        refreshing: false,
      });
    }
    catch (error) {
      console.log(error);
    }
  };
  // Render Header
  renderHeader = () => {
    try {
      return (
        null
      )
    }
    catch (error) {
      console.log(error);
    }
  };
  // Render Footer
  renderFooter = () => {
    try {

      // Check If Loading

      if (this.state.loading) {
        return (
          <ActivityIndicator />
        )
      }
      else {
        return null;
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  _renderItem = ({ item }) => {
    const firstName = item.firstName || "" ;
    const lastName  = item.lastName || "";
    const avatarTitle = firstName.slice(0,1) + lastName.slice(0,1);
    const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: avatarTitle };
    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 16 }}>{item.fullname || "No Name"}</Text>
            <Text style={{ flex: 0, flexShrink: 1, fontSize: 10, alignSelf: 'center', justifyContent: 'center', color: 'gray' }}>{item.mac}</Text>
          </View>
        }
        chevron={true}
        subtitle={
          <View style={{ flex: 1, flexDirection: 'column', paddingTop: 8 }}>
            <Text style={{ color: 'gray' }}>Class {item.class}</Text>
            <Text style={{ color: 'gray' }}>last seen {moment(item.lastSeen).format("LLL")}</Text>
            <Text style={{ color: 'gray' }}>{item.state}</Text>
          </View>
        }
        onPress={() => this.props.navigation.navigate("AttendeeDetailScreen", item)}
      />
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          // Data

          data={this.state.documentData}

          // Render Items

          renderItem={this._renderItem}

          ItemSeparatorComponent={this.renderSeparator}

          // Item Key

          keyExtractor={(item, index) => String(index)}

          // Header (Title)

          ListHeaderComponent={this.renderHeader}

          // Footer (Activity Indicator)

          ListFooterComponent={this.renderFooter}

          // On End Reached (Takes a function)

          onEndReached={this.retrieveMore}

          // How Close To The End Of List Until Next Data Request Is Made

          onEndReachedThreshold={0}

          // Refreshing (Set To True When End Reached)
          refreshing={this.state.refreshing}
        />
      </SafeAreaView>
    )
  }
}
// Styles
const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  headerText: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
    marginBottom: 12,
  },
  itemContainer: {
    height: 80,
    width: width,
    borderWidth: .2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
});