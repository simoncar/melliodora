import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, ActivityIndicator } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import firebase from "firebase";

import useBeaconSearchHook from "./utils/BeaconSearchStore";

const GradeListingScreen = ({ navigation }) => {

  const [globalBeaconSearch, globalBeaconSearchAction] = useBeaconSearchHook();


  const [loading, setLoading] = useState(false);
  const [campusData, setCampusData] = useState([]);

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
        .collection("grade")


      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get();
      // Cloud Firestore: Document Data
      let newDocumentData = documentSnapshots.docs.map(document => document.data());

      // Set State
      setCampusData(newDocumentData);
      setLoading(false);
    }
    catch (error) {
      console.log(error);
    }
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item }) => (
    <ListItem
      title={item.gradeTitle}
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
        globalBeaconSearchAction.setGrade(item.grade);
        navigation.navigate("ClassListingScreen");
      }

      }
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
      <Text style={styles.listingText}>Listing By Grade</Text>
      <FlatList
        data={campusData}
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

GradeListingScreen.navigationOptions = {
  title: "Select Grade",
  headerBackTitle: null
};
export default GradeListingScreen;