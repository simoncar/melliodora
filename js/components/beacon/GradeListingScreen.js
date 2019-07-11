import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";

import useBeaconSearchHook from "./utils/BeaconSearchStore";

const GradeListingScreen = ({ navigation }) => {

  const [globalBeaconSearch, globalBeaconSearchAction] = useBeaconSearchHook();


  const [loading, setLoading] = useState(false);
  const [campusData, setCampusData] = useState([
    { gradeLevel: "Grade 1", amount: 234 },
    { gradeLevel: "Grade 2", amount: 344 },
    { gradeLevel: "Grade 3", amount: 234 },
    { gradeLevel: "Grade 4", amount: 123 },
    { gradeLevel: "Grade 5", amount: 124 }
  ]);

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item }) => (
    <ListItem
      title={item.gradeLevel}
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
        globalBeaconSearchAction.setGrade(item.gradeLevel);
        navigation.navigate("ClassListingScreen", {
          title: navigation.getParam("title")
        });
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


  return (
    <View>
      <Text style={styles.listingText}>Listing By Grade</Text>
      <FlatList
        data={campusData}
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

GradeListingScreen.navigationOptions = {
  title: "Select Grade",
  headerBackTitle: null
};
export default GradeListingScreen;