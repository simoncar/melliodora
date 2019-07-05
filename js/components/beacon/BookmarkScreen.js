import React, { Component } from 'react'
import { Text, StyleSheet, View, AsyncStorage, FlatList, TouchableOpacity } from 'react-native'
import firebase from "firebase";
import moment from "moment";
import { ListItem } from 'react-native-elements';
import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

export default class BookmarkScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      bookmarks: [],
      attendeeData: []
    }
  }

  componentDidMount() {
    this._retrieveBookmarkData()
      .then((bookmarks) => this.setState({ bookmarks }))
      .then(() => this.getData())
      .then(data => this.setState({
        attendeeData: data,
        loading: false
      }));


  }

  async getData() {

    // const data = [];
    const docRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons");

    const data = Promise.all(this.state.bookmarks.map(
      bookmark => (
        docRef.doc(bookmark).get().then(function (doc) {
          if (doc.exists) {
            return doc.data();
          } else {
            console.log("No such document!");
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        })
      )));
    return data;
  }

  _retrieveBookmarkData = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('myBookmarks')
      return JSON.parse(bookmarks) || [];
    } catch (error) {
      // Error retrieving data
    }
  };


  _keyExtractor = (item, index) => item.mac;


  _renderItem = (item, index) => {
    const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: 'MD' };

    let onPressFunc, color;

    if (this.state.bookmarks.indexOf(item.mac) > -1) {
      onPressFunc = this._unbookmark;
      color = "gold";
    } else {
      onPressFunc = this._storeBookmarkData;
      color = "gray";
    }

    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 14 }}>{item.mac}</Text>
            <Text style={{ flex: 0, flexShrink: 1, fontSize: 8, alignSelf: 'center', justifyContent: 'center', color: 'gray' }}>{item.mac}</Text>
          </View>
        }
        chevron={false}
        subtitle={
          <View style={{ flex: 1, flexDirection: 'column', paddingTop: 8}}>
            <Text style={{ color: 'gray', fontSize: 12 }}>Class {item.campus}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>last seen {moment(item.lastSeen).format("LLL")}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>current status {item.state}</Text>
          </View>
        }

        rightIcon={
          <TouchableOpacity style={{ paddingRight: 8 }} onPress={() => onPressFunc(item.mac)}>
            <FontAwesome name="star" size={28} color={color} />
          </TouchableOpacity>

        }
        onPress={() => this.props.navigation.navigate("AttendeeDetailScreen", item)}
        topDivider={true}
        containerStyle={{margin: 10}}
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



  _storeBookmarkData = (mac) => {
    try {

      this.updateBookmarkList(mac)
        .then((updatedBookmarkList) =>
          AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarkList),
            () => this.setState({ bookmarks: updatedBookmarkList })
          )
        );

    } catch (error) {
      console.log(error.message);
    }
  };

  updateBookmarkList = async (mac) => {
    const bookmarks = await this._retrieveBookmarkData();
    let bookmarksSet;
    if (bookmarks) {
      // add bookmark to existing bookmarks list
      bookmarksSet = new Set(bookmarks);
      bookmarksSet.add(mac)
    } else {
      bookmarksSet = [mac];
    }

    return [...bookmarksSet];
  }

  removeBookmark = async (mac) => {
    const bookmarks = await this._retrieveBookmarkData();
    let bookmarksSet;
    if (bookmarks) {
      // add bookmark to existing bookmarks list
      bookmarksSet = new Set(bookmarks);
      bookmarksSet.delete(mac)
    } else {
      bookmarksSet = [];
    }
    return [...bookmarksSet];
  }

  _unbookmark = (mac) => {
    try {
      console.log("_unbookmark");
      this.removeBookmark(mac)
        .then((updatedBookmarkList) =>
          AsyncStorage.setItem('myBookmarks', JSON.stringify(updatedBookmarkList),
            () => this.setState({ bookmarks: updatedBookmarkList })
          )
        );

    } catch (error) {
      console.log(error.message);
    }
  }

  _retrieveBookmarkData = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('myBookmarks')
      return JSON.parse(bookmarks);
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    if (this.state.loading) return null;

    return (

      <View>{this.state.attendeeData.map(this._renderItem)}</View>
    );
  }
}

const styles = StyleSheet.create({})
