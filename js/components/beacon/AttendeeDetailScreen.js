import React, { Component, useState, useEffect } from "react";

import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { ListItem, SearchBar, Avatar, Divider, Button, Overlay } from "react-native-elements";
import BeaconHistoryItem from "./BeaconHistoryItem";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import moment from "moment";
import "moment/locale/en-SG"; // without this line it didn't work
moment.locale("en-SG");
import _ from "lodash";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

import useBookmarkHook from "./utils/BookmarkStore";

const BookmarkBtn = ({ recordInfo }) => {
  const [globalState, globalActions] = useBookmarkHook();
  const { loading, bookmarks } = globalState;

  //on Startup
  useEffect(() => {
    globalActions.init();
  }, []);

  let onPressFunc, color;
  if (bookmarks.indexOf(recordInfo.mac) > -1) {
    onPressFunc = () => globalActions.removeBookmark(recordInfo.mac);
    color = "gold";
  } else {
    onPressFunc = () => globalActions.addBookmarkWithInfo(recordInfo);
    color = "white";
  }

  return (
    <TouchableHighlight style={styles.bookmark} underlayColor="#ff7043" onPress={onPressFunc}>
      <FontAwesome name="star" size={28} color={color} />
    </TouchableHighlight>
  );
};

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
      userHistory: [],
      calendarModalVisible: false,
      selectedDate: "",
      tempSelectedDate: "",
    };
  }

  componentDidMount() {
    const beaconID = this.props.navigation.state.params.mac;
    const todayDate = moment().format("YYYYMMDD");

    this.setState({ selectedDate: todayDate });
    console.log("beaconID", beaconID);
    this.getData(beaconID, todayDate).then(data =>
      this.setState({
        userHistory: data,
        loading: false,
      }),
    );
  }

  async getData(mac, date) {
    const data = [];
    await firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beaconHistory")
      .doc(date)
      .collection(mac) //beaconID
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          console.log(doc.data());
          data.push(doc.data());
        });
      });
    return data;
  }

  setCalendarModalVisible(visible) {
    this.setState({ calendarModalVisible: visible });
  }

  _renderListItem = (item, index) => {
    var key = index.toString();
    if (index === 0) return <BeaconHistoryItem start={true} {...item} key={key} />;
    else if (index === this.state.userHistory.length - 1) return <BeaconHistoryItem last={true} {...item} key={key} />;
    else return <BeaconHistoryItem {...item} key={key} />;
  };

  render() {
    const recordInfo = this.props.navigation.state.params;
    const { lastSeen, state, mac, fullname, gradeTitle } = recordInfo;
    const firstName = recordInfo.firstName || "";
    const lastName = recordInfo.lastName || "";
    const avatarTitle = firstName.slice(0, 1) + lastName.slice(0, 1);

    const studentClass = recordInfo.class;

    // const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: avatarTitle };
    return (
      <View style={{ height: "100%" }}>
        <BookmarkBtn recordInfo={recordInfo} />

        {/* {Calendar Pop up} */}
        <Overlay
          isVisible={this.state.calendarModalVisible}
          onBackdropPress={() => {
            this.setCalendarModalVisible(!this.state.calendarModalVisible);
          }}
          windowBackgroundColor="rgba(0, 0, 0, .8)"
          width="auto"
          height="auto"
        >
          <SafeAreaView>
            <TouchableOpacity
              onPress={() => {
                this.setCalendarModalVisible(!this.state.calendarModalVisible);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
              }}
            >
              <Ionicons name="md-close" size={28} color="gray" />
            </TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 40,
                paddingBottom: 10,
              }}
            >
              <Text style={{ marginBottom: 15, fontWeight: "bold" }}>Select Date</Text>
              <Calendar
                onDayPress={day => {
                  this.setState({ tempSelectedDate: day.dateString });
                }}
                markedDates={{
                  [this.state.tempSelectedDate]: {
                    selected: true,
                    disableTouchEvent: true,
                  },
                }}
              />
              <Button
                title="Submit"
                onPress={() => {
                  this.setState({ selectedDate: this.state.tempSelectedDate });
                  this.setCalendarModalVisible(!this.state.calendarModalVisible);
                }}
                containerStyle={{ marginTop: 15 }}
              />
            </View>
          </SafeAreaView>
        </Overlay>

        <ScrollView>
          <View style={styles.topContainer}>
            <View style={styles.avatarContainer}>
              <Avatar size="xlarge" rounded title={avatarTitle} activeOpacity={0.7} />
            </View>
            <View style={styles.detailContainer}>
              <View>
                <Text style={styles.attendeeNameText}>{fullname || "No Name"}</Text>
                <Text style={styles.detailsText}>{gradeTitle}</Text>
                <Text style={styles.detailsText}>{studentClass || "No Class"}</Text>
                <Text />
                <Text style={styles.detailsText}>last seen {moment(lastSeen).format("LLL")}</Text>
                <Text style={styles.detailsText}>{state}</Text>
              </View>
            </View>
          </View>

          <View style={{ paddingVertical: 5, paddingHorizontal: 15 }}>
            <Button
              title={moment(this.state.selectedDate).format("LL")}
              raised
              icon={
                <View style={{ paddingRight: 10 }}>
                  <FontAwesome name="calendar" size={15} color="#48484A" />
                </View>
              }
              buttonStyle={{ backgroundColor: "#d3d3d3", padding: 2 }}
              titleStyle={{ color: "#48484A", fontSize: 14 }}
              onPress={() => {
                this.setCalendarModalVisible(true);
              }}
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
    backgroundColor: "#d3d3d3",
  },
  avatarContainer: {
    flex: 0,
    flexShrink: 1,
    paddingLeft: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  detailContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  attendeeNameText: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 16,
  },
  detailsText: {
    color: "#48484A",
    fontSize: 12,
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
      width: 0,
    },
    zIndex: 1,
  },
});
