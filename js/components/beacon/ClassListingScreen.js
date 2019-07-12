import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { ListItem, SearchBar, Text } from "react-native-elements";
import firebase from "firebase";

import useBeaconSearchHook from "./utils/BeaconSearchStore";

const ClassListingScreen = ({ navigation }) => {

  const [globalBeaconSearchState, globalBeaconSearchAction] = useBeaconSearchHook();
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);

  const { grade } = globalBeaconSearchState;
  console.log("type of grade", typeof grade);

  useEffect(() => {
    retrieveData();
  }, []);

  // Retrieve Data
  retrieveData = async () => {
    try {

      // Set State: Loading
      setLoading(true);
      console.log('Retrieving Data');
      // Cloud Firestore: Query

      let initialQuery = await firebase
        .firestore()
        .collection("sais_edu_sg")
        .doc("org")
        .collection("class")
        .where("grade", "==", grade);


      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get();
      // Cloud Firestore: Document Data
      let newDocumentData = documentSnapshots.docs.map(document => document.data());

      // Set State
      setClassData(newDocumentData);
      setLoading(false);
    }
    catch (error) {
      console.log(error);
    }
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item }) => (
    <ListItem
      title={item.classCode}
      chevron={true}
      rightIcon={{ name: "person" }}
      // badge={{
      //   value: item.amount,
      //   textStyle: { color: "white", fontSize: 16 },
      //   badgeStyle: {
      //     backgroundColor: "black",
      //     minWidth: 50,
      //     minHeight: 25,
      //     borderRadius: 50,
      //     paddingHorizontal: 5
      //   }
      // }}
      onPress={() => {
        globalBeaconSearchAction.setClass(item.classCode);
        navigation.navigate("AttendeeListingScreen");
      }}
    />
  );

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


  return (
    <View>
      <FlatList
        data={classData}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  listingText: {
    fontWeight: "bold",
    padding: 15,
    fontSize: 15
  }
});

ClassListingScreen.navigationOptions = {
  title: "Select Class",
  headerBackTitle: null
};
export default ClassListingScreen;