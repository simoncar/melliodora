import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, AsyncStorage, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import firebase from "firebase";
import moment from "moment";
import { ListItem } from "react-native-elements";
import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

import useBookmarkHook from "./utils/BookmarkStore";

const BookmarkScreen = ({ navigation }) => {
  const [globalState, globalActions] = useBookmarkHook();
  const { loading, bookmarksData, bookmarks } = globalState;

  const [initialbookmarksData, setInitialbookmarksData] = useState([]);
  //on Startup
  useEffect(() => {
    globalActions.init().then(() => setInitialbookmarksData([...bookmarksData].reverse()));
  }, []);

  // Render Header
  const renderHeader = () => {
    try {
      return null;
    } catch (error) {
      console.log(error);
    }
  };
  // Render Footer
  const renderFooter = () => {
    try {
      // Check If Loading
      if (loading) {
        return <ActivityIndicator />;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ListEmpty = () => {
    return (
      //View to show when list is empty
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          margin: 10,
        }}
      >
        <Text style={{ color: "gray", textAlign: "center" }}>No Bookmarks</Text>
      </View>
    );
  };

  const _renderItem = ({ item, index }) => {
    const firstName = item.firstName || "";
    const lastName = item.lastName || "";
    const avatarTitle = firstName.slice(0, 1) + lastName.slice(0, 1);
    const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: avatarTitle };

    let onPressFunc, color;
    console.log(index, "index");
    if (bookmarks.indexOf(item.mac) > -1) {
      onPressFunc = () => globalActions.removeBookmark(item.mac);
      color = "gold";
    } else {
      onPressFunc = () => globalActions.addBookmarkWithInfo(item, initialbookmarksData.length - 1 - index);
      color = "gray";
    }
    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={{ flex: 1, fontSize: 14 }}>{item.fullname || "No Name"}</Text>
            <Text
              style={{
                flex: 0,
                flexShrink: 1,
                fontSize: 8,
                alignSelf: "center",
                justifyContent: "center",
                color: "gray",
              }}
            >
              {item.mac}
            </Text>
          </View>
        }
        chevron={false}
        subtitle={
          <View style={{ flex: 1, flexDirection: "column", paddingTop: 8 }}>
            <Text style={{ color: "gray", fontSize: 12 }}>Class {item.class}</Text>
            <Text style={{ color: "gray", fontSize: 12 }}>last seen {moment(item.lastSeen).format("LLL")}</Text>
            <Text style={{ color: "gray", fontSize: 12 }}>{item.state}</Text>
          </View>
        }
        rightIcon={
          <TouchableOpacity style={{ paddingRight: 8 }} onPress={onPressFunc}>
            <FontAwesome name="star" size={28} color={color} />
          </TouchableOpacity>
        }
        onPress={() => navigation.navigate("AttendeeDetailScreen", item)}
      />
    );
  };

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  return (
    <FlatList
      // Data
      data={initialbookmarksData}
      // Render Items
      renderItem={_renderItem}
      ItemSeparatorComponent={this.renderSeparator}
      // Item Key
      keyExtractor={(item, index) => String(index)}
      // // Header (Title)
      ListHeaderComponent={this.renderHeader}
      // // Footer (Activity Indicator)
      ListFooterComponent={this.renderFooter}
      ListEmptyComponent={this.ListEmpty}
    />
  );
};

const styles = StyleSheet.create({});

BookmarkScreen.navigationOptions = {
  title: "Bookmarks",
};
export default BookmarkScreen;
