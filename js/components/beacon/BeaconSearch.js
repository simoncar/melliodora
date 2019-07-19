import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Picke,
  TextInput,
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ButtonGroup, Input, Button, ListItem } from "react-native-elements";
import firebase from "firebase";
import moment from "moment";

export default class BeaconSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documentData: [],
      loading: false,
      searchTerm: "",
      selectedIndex: 0,
      noResult: false
    };
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  getQuery = () => {
    // baseQuery = firebase
    //   .firestore()
    //   .collection("sais_edu_sg")
    //   .doc("beacon")
    //   .collection("beacons")
    // if (this.state.selectedIndex === 0) {
    //   return baseQuery
    //     .where("mac", "==", this.state.searchTerm.toUpperCase())
    // }
    // return baseQuery
    //   .where("fullname", "==", this.state.searchTerm)

    var baseQuery = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons");

    return baseQuery.where(
      "searchArray",
      "array-contains",
      this.state.searchTerm.toUpperCase()
    );
  };
  // Retrieve Data
  retrieveData = async () => {
    try {
      // Set State: Loading
      this.setState({
        loading: true
      });
      console.log("Retrieving Data"); // Cloud Firestore: Query
      let initialQuery = await this.getQuery();

      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get(); // Cloud Firestore: Document Data
      let documentData = documentSnapshots.docs.map(document =>
        document.data()
      );
      if (documentData.length > 0) {
        this.setState({
          documentData: documentData,
          loading: false,
          noResult: false
        });
      } else {
        //No Result found
        this.setState({
          documentData: documentData,
          loading: false,
          noResult: true
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Header
  renderHeader = () => {
    try {
      return null;
    } catch (error) {
      console.log(error);
    }
  };
  // Render Footer
  renderFooter = () => {
    try {
      // Check If Loading

      if (this.state.loading) {
        return <ActivityIndicator />;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  ListEmpty = () => {
    if (this.state.noResult) {
      return (
        //View to show when list is empty
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            margin: 10
          }}
        >
          <Text style={{ color: "gray", textAlign: "center" }}>
            No Result Found
          </Text>
        </View>
      );
    }
    return null;
  };

  _renderItem = ({ item }) => {
    console.log("item", item);
    const firstName = item.firstName || "";
    const lastName = item.lastName || "";
    const avatarTitle = firstName.slice(0, 1) + lastName.slice(0, 1);
    const avatar = item.imgSrc
      ? { source: { uri: item.imgSrc } }
      : { title: avatarTitle };
    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={{ flex: 1, fontSize: 16 }}>
              {item.fullname || "No Name"}
            </Text>
            <Text
              style={{
                flex: 0,
                flexShrink: 1,
                fontSize: 10,
                alignSelf: "center",
                justifyContent: "center",
                color: "gray"
              }}
            >
              {item.mac}
            </Text>
          </View>
        }
        chevron={true}
        subtitle={
          <View style={{ flex: 1, flexDirection: "column", paddingTop: 8 }}>
            <Text style={{ color: "gray" }}>Class {item.class}</Text>
            <Text style={{ color: "gray" }}>
              last seen {moment(item.lastSeen).format("LLL")}
            </Text>
            <Text style={{ color: "gray" }}>{item.state}</Text>
          </View>
        }
        onPress={() =>
          this.props.navigation.navigate("AttendeeDetailScreen", item)
        }
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
    const buttons = ["Beacon ID/MAC", "Student Name"];
    const { selectedIndex } = this.state;

    return (
      <View style={{ padding: 10 }}>
        <Input
          placeholder="Search"
          leftIcon={
            <Ionicons
              name="ios-search"
              size={24}
              style={{ paddingRight: 12 }}
              color="gray"
            />
          }
          shake={true}
          leftIconContainerStyle={{ marginLeft: 0, paddingLeft: 0 }}
          containerStyle={{
            borderWidth: 1,
            borderRadius: 25,
            borderColor: "gray"
          }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          onChangeText={text => this.setState({ searchTerm: text })}
          value={this.state.searchTerm}
        />
        {this.state.selectedIndex === 1 && (
          <Text style={{ color: "red", fontSize: 8, marginLeft: 20 }}>
            * Case Sensitive
          </Text>
        )}
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
        />
        <Button title="Submit" raised onPress={this.retrieveData} />

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
          ListEmptyComponent={this.ListEmpty}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
