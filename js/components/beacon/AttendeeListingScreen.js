// Imports: Dependencies
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from "moment";

import firebase from "firebase";

import useBeaconSearchHook from "./utils/BeaconSearchStore";

// Screen Dimensions
const { height, width } = Dimensions.get('window');
// Screen: Infinite Scroll

const AttendeeListingScreen = ({ navigation }) => {

  const [globalBeaconSearchState, globalBeaconSearchAction] = useBeaconSearchHook();
  const { beaconState, grade } = globalBeaconSearchState;
  const studentClass = globalBeaconSearchState.class;

  console.log("statesss", beaconState, grade, studentClass);
  const [documentData, setDocumentData] = useState([]);
  const [limit, setLimit] = useState(12);
  const [lastVisible, setLastVisible] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    retrieveData();
  }, []);

  getQuery = () => {
    if(!beaconState){
      return firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons")
      .where("grade", "==", String(grade))
      .where("class", "==", studentClass)
      .orderBy('mac');
    }
    return firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons")
      .where("state", "==", beaconState)
      .where("grade", "==", String(grade))
      .where("class", "==", studentClass)
      .orderBy('mac');
  }
  // Retrieve Data
  retrieveData = async () => {
    try {

      // Set State: Loading
      setLoading(true);
      console.log('Retrieving Data');
      // Cloud Firestore: Query

      let initialQuery = await getQuery()
        .limit(30);

      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get();
      // Cloud Firestore: Document Data
      let newDocumentData = documentSnapshots.docs.map(document => document.data());

      if (newDocumentData.length > 0) {
        // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
        let newlastVisible = newDocumentData[newDocumentData.length - 1].mac;

        // Set State
        setDocumentData(newDocumentData);
        setLastVisible(newlastVisible);
        setLoading(false);
      } else {
        // Set State
        setDocumentData([]);
        setLoading(false);
      }

    }
    catch (error) {
      console.log(error);
    }
  };
  // Retrieve More
  retrieveMore = async () => {
    try {

      if (!documentData) return;
      // Set State: Refreshing
      setRefreshing(true);
      console.log('Retrieving additional Data');
      // Cloud Firestore: Query (Additional Query)
      let additionalQuery = await getQuery()
        .startAfter(lastVisible)
        .limit(limit)
      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await additionalQuery.get();
      // Cloud Firestore: Document Data
      let newDocumentData = documentSnapshots.docs.map(document => document.data());
      // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
      let newlastVisible = newDocumentData[newDocumentData.length - 1].mac;
      // Set State
      setDocumentData([...documentData, ...newDocumentData]);
      setLastVisible(newlastVisible);
      setRefreshing(false);
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

      if (loading) {
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
    const firstName = item.firstName || "";
    const lastName = item.lastName || "";
    const avatarTitle = firstName.slice(0, 1) + lastName.slice(0, 1);
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
        onPress={() => navigation.navigate("AttendeeDetailScreen", item)}
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


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        // Data

        data={documentData}

        // Render Items

        renderItem={_renderItem}

        ItemSeparatorComponent={renderSeparator}

        // Item Key

        keyExtractor={(item, index) => String(index)}

        // Header (Title)

        ListHeaderComponent={renderHeader}

        // Footer (Activity Indicator)

        ListFooterComponent={renderFooter}

        // On End Reached (Takes a function)

        onEndReached={retrieveMore}

        // How Close To The End Of List Until Next Data Request Is Made

        onEndReachedThreshold={0.1}

        // Refreshing (Set To True When End Reached)
        refreshing={refreshing}
      />
    </SafeAreaView>
  )

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

AttendeeListingScreen.navigationOptions = {
  title: "Select Student",
  headerBackTitle: null
};
export default AttendeeListingScreen;