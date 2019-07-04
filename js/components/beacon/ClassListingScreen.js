import React, { Component } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { ListItem, SearchBar, Text } from "react-native-elements";

export default class ClassListingScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    headerBackTitle: null
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      classData: [
        { classID: "2DAYE", amount: 20 },
        { classID: "2GHRD", amount: 18 },
        { classID: "2RFSU", amount: 22 },
        { classID: "2KLUG", amount: 23 },
        { classID: "2SSSS", amount: 22 }
      ]
    };
  }
  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item }) => (
    <ListItem
      title={item.classID}
      chevron={true}
      rightIcon={{ name: "person" }}
      badge={{
        value: item.amount,
        textStyle: { color: "white", fontSize: 16 },
        badgeStyle: {
          backgroundColor: "black",
          minWidth: 50,
          minHeight: 25,
          borderRadius: 50,
          paddingHorizontal: 5
        }
      }}
      onPress={() =>
        this.props.navigation.navigate("AttendeeListingScreen", {
          title: this.props.navigation.getParam("title"),
          selectedGrade: item.classID
        })
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

  render() {
    return (
      <View>
        <Text style={styles.listingText}>Listing By Class</Text>
        <FlatList
          data={this.state.classData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listingText: {
    fontWeight: "bold",
    padding: 15,
    fontSize: 15
  }
});
