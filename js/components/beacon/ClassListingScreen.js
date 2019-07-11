import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { ListItem, SearchBar, Text } from "react-native-elements";

import useBeaconSearchHook from "./utils/BeaconSearchStore";

const ClassListingScreen = ({ navigation }) => {

  const [globalBeaconSearch, globalBeaconSearchAction] = useBeaconSearchHook();
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([
    { classID: "2DAYE", amount: 20 },
    { classID: "2GHRD", amount: 18 },
    { classID: "2RFSU", amount: 22 },
    { classID: "2KLUG", amount: 23 },
    { classID: "2SSSS", amount: 22 }
  ]);

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item }) => (
    <ListItem
      title={item.classID}
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
        globalBeaconSearchAction.setClass(item.classID);
        navigation.navigate("AttendeeListingScreen", {
          title: navigation.getParam("title"),
          selectedGrade: item.classID
        });
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


  return (
    <View>
      <Text style={styles.listingText}>Listing By Class</Text>
      <FlatList
        data={classData}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ItemSeparatorComponent={renderSeparator}
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