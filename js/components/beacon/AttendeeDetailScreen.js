
import React, { Component, useState, useEffect } from "react";

import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  AsyncStorage
} from "react-native";
import {
  ListItem,
  SearchBar,
  Avatar,
  Divider,
  Button
} from "react-native-elements";
import BeaconHistoryItem from "./BeaconHistoryItem";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
// import Icon from 'react-native-vector-icons/FontAwesome';

import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
import moment from "moment";
import _ from "lodash";

import useGlobal from "./utils/BookmarkStore";

const BookmarkBtn = ({ mac }) => {
  const [globalState, globalActions] = useGlobal();
  const { loading, bookmarks } = globalState;

  //on Startup
  useEffect(() => {
    globalActions.init();
  },[]);



  console.log(mac, "mac");
  console.log("globalState bookmarks", bookmarks);
  let onPressFunc, color;
  if (bookmarks.indexOf(mac) > -1) {
    onPressFunc = globalActions.removeBookmark;
    color = "gold";
  } else {
    onPressFunc = globalActions.addBookmark;
    color = "white";
  }

  if(loading) return(<View></View>);
  return (
    <TouchableHighlight
      style={styles.bookmark}
      underlayColor="#ff7043"
      onPress={() => onPressFunc(mac)}
    >
      <FontAwesome name="star" size={28} color={color} />
    </TouchableHighlight>
  )
}

export default class AttendeeDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {};
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      userBeacons: {},
      userHistoryData: {},

      userHistory: []
    }


  }

  componentDidMount() {


    const beaconID = this.props.navigation.getParam("beaconID");

    const todayDate = moment()
      .add(8, "hours")
      .format("YYYYMMDD");

    this.getData(beaconID, todayDate).then(data =>
      this.setState({
        userHistory: data,
        loading: false

      }));


  }

  async getData(mac, date) {

    const data = [];
    await firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beaconHistory")
      .doc(date)
      .collection("5AE59BBD544E") //beaconID
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          console.log(doc.data());
          data.push(doc.data());
        });
      });
    return data;
  }

  _renderListItem = (item, index) => {
    key = index.toString();
    if (index === 0)
      return <BeaconHistoryItem start={true} {...item} key={key} />;
    else if (index === this.state.userHistory.length - 1)
      return <BeaconHistoryItem last={true} {...item} key={key} />;
    else return <BeaconHistoryItem {...item} key={key} />;
  };


  render() {

    const { lastSeen, state, mac, fullname, gradeTitle } = this.props.navigation.state.params;
    const firstName = this.props.navigation.state.params.firstName || "" ;
    const lastName  = this.props.navigation.state.params.lastName || "";
    const avatarTitle = firstName.slice(0,1) + lastName.slice(0,1);

    const studentClass = this.props.navigation.state.params.class;

    // const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: avatarTitle };
    return (
      <View style={{ height: "100%" }}>
        <BookmarkBtn mac={mac} />

        <ScrollView>
          <View style={styles.topContainer}>
            <View style={styles.avatarContainer}>
              <Avatar
                size="xlarge"
                rounded
                title = {avatarTitle}
                activeOpacity={0.7}
              />
            </View>
            <View style={styles.detailContainer}>
              <View>
                <Text style={styles.attendeeNameText}>{fullname || "No Name"}</Text>
                <Text style={styles.detailsText}>{gradeTitle}</Text>
                <Text style={styles.detailsText}>{studentClass || "No Class"}</Text>
                <Text />
                <Text style={styles.detailsText}>
                  last seen {moment(lastSeen).format("LLL")}
                </Text>
                <Text style={styles.detailsText}>{state}</Text>
              </View>
            </View>
          </View>

          <View style={{ paddingVertical: 5, paddingHorizontal: 15 }}>
            <Button
              title="Today 28 June 2019"
              raised
              icon={
                <View style={{ paddingRight: 10 }}>
                  <FontAwesome name="calendar" size={15} color="#48484A" />
                </View>
              }
              buttonStyle={{ backgroundColor: "#d3d3d3", padding: 2 }}
              titleStyle={{ color: "#48484A", fontSize: 14 }}
            />
          </View>
          <View>{this.state.userHistory.map(this._renderListItem)}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#d3d3d3"
  },
  avatarContainer: {
    flex: 0,
    flexShrink: 1,
    paddingLeft: 20,
    paddingVertical: 20,
    alignItems: "center"
  },
  detailContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  attendeeNameText: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 16
  },
  detailsText: {
    color: "#48484A",
    fontSize: 12
  },
  bookmark: {
    backgroundColor: "#ff5722",
    borderColor: "#ff5722",
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    right: 35,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex: 1
  }
});