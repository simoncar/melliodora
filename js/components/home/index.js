import React, { Component } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Text, Icon } from "native-base";
import * as firebase from "firebase";

import { Grid, Col, Row } from "react-native-easy-grid";
import Constants from "expo-constants";
import { Agenda } from "react-native-calendars";
import * as ActionCreators from "../../actions";
import styles from "./styles";
import HeaderContent from "../headerContent/header";
import Analytics from "../../lib/analytics";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import { Ionicons } from "@expo/vector-icons";
import { formatTime, formatMonth } from "../global.js";
const moment = require("moment");

const i = 0;
const { width } = Dimensions.get("window");

const tabBarIcon = name => ({ tintColor }) => (
  <Ionicons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

@withMappedNavigationParams()
class calendar1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true,
      items: {}
    };

    //this.loadFromRedux();
    const time = Date.now() + 8 * 3600 * 1000;
    const todayDate = this.timeToString(time);
    const todayDay = new moment().format("MMMM Do");

    if (!this.state.items[todayDate]) {
      this.state.items[todayDate] = [];
    }

    this.state.items[todayDate].push({
      name: "Today, " + todayDay,
      icon: "md-radio-button-off",
      color: "yellow",
      title: "Today, " + todayDay
    });

    // analytics  -----
    const trackingOpts = {
      instId: Constants.manifest.extra.instance,
      emailOrUsername: global.username
    };

    Analytics.identify(global.username, trackingOpts);
    Analytics.track(Analytics.events.PAGE_CALENDAR, trackingOpts);
    // analytics --------
  }

  static navigationOptions = {
    title: "Calendar",
    tabBarColor: "#c51162",
    tabBarIcon: tabBarIcon("ios-calendar", "green")
  };

  componentDidMount() {
    //this.unsubscribe = this.calendarEvents.onSnapshot(this.onCollectionUpdate);
    //
    this.calendarEvents = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("calendar")
      .collection("calendarItems");

    this.listenLoadFromFirebase(this.calendarEvents);
  }

  componentWillUnmount() {
    //this.unsubscribe();
  }

  loadFromRedux() {
    this.state.items = [];
    this.loadItems();

    dataSnapshot = this.props.calendarEventsX.items;
    key = "";

    this.loadItems();

    for (var key in dataSnapshot) {
      if (!dataSnapshot.hasOwnProperty(key)) continue;

      const snapshot = dataSnapshot[key];

      if (undefined != snapshot.date_start) {
        strtime = snapshot.date_start;
        strtime = strtime.substring(0, 10);

        if (!this.state.items[strtime]) {
          this.state.items[strtime] = [];
        }

        this.state.items[strtime].push({
          name: snapshot.summary,
          title: snapshot.summary,
          description: snapshot.description,
          location: snapshot.location,
          startDatePretty: snapshot.date_start,
          startTimePretty: snapshot.time_start_pretty,
          endTimePretty: snapshot.time_end_pretty,
          group: snapshot.group,
          iconLib: snapshot.iconLib,
          icon: snapshot.icon,
          color: snapshot.colorId,
          phone: snapshot.phone,
          email: snapshot.email,
          url: snapshot.htmlLink,
          photo1: snapshot.photo1,
          photo2: snapshot.photo2,
          photo3: snapshot.photo3
        });
      }
    }
  }

  listenLoadFromFirebase(dataSnapshot2) {
    dataSnapshot2
      .get()
      .then(snapshot => {
        const items2 = [];

        this.loadItems();

        snapshot.forEach(doc => {
          items2.push(doc.data());

          //save to redux
          // this.props.setCalendarItems(dataSnapshot2);

          // dataSnapshot = dataSnapshot2;
          // this.state.items = [];

          //console.log(dataSnapshot2);
          //dataSnapshot.forEach(function(doc) {

          //   console.log (snapshot)
          strtime = doc.data().date_start;
          strtime = strtime.substring(0, 10);

          if (!this.state.items[strtime]) {
            this.state.items[strtime] = [];
          }

          if (undefined != this.state.items[strtime]) {
            this.state.items[strtime].push({
              name: doc.data().summary,
              title: doc.data().summary,
              description: doc.data().description,
              location: doc.data().location,
              startDatePretty: doc.data().date_start,
              startTimePretty: doc.data().time_start_pretty,
              endTimePretty: doc.data().time_end_pretty,
              group: doc.data().group,
              iconLib: doc.data().iconLib,
              icon: doc.data().icon,
              color: doc.data().colorId,
              phone: doc.data().phone,
              email: doc.data().email,
              url: doc.data().htmlLink,
              photo1: doc.data().photo1,
              photo2: doc.data().photo2,
              photo3: doc.data().photo3
            });
          }
        });

        items = JSON.parse(JSON.stringify(this.state.items));

        this.setState({
          items
        });

        this.loadItems();
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 365; i++) {
        const time = Date.now() + i * 24 * 60 * 60 * 1000;
        const strtime = this.timeToString(time);
        const date = new Date();

        if (!this.state.items[strtime]) {
          this.state.items[strtime] = [];
        }
      }

      const newItems = {};

      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
    }, 1000);
  }

  render() {
    const date = new Date();

    // add a day
    date.setDate(date.getDate());
    // date.setDate(Date());

    return (
      <Container>
        <HeaderContent
          showBack="true"
          showHome="false"
          navigation={this.props.navigation}
        />

        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={date}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          hideKnob={false}
          theme={{
            agendaKnobColor: "#1DAEF2",
            selectedDayBackgroundColor: "#00adf5"
          }}
          style={{}}
        />
      </Container>
    );
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() =>
          this.props.navigation.navigate("story", {
            eventTitle: item.title,
            eventDescription: item.description,
            eventDate: item.startDatePretty,
            eventStartTime: item.startTimePretty,
            eventEndTime: item.endTimePretty,
            group: item.group,
            location: item.location,
            eventImage: item.eventImage,
            phone: item.phone,
            email: item.email,
            color: item.color,
            photo1: item.photo1,
            photo2: item.photo2,
            photo3: item.photo3,
            url: item.url
          })
        }
      >
        <View
          style={[
            styles.agendaItem,
            {
              height: item.height,
              borderRightColor: this.formatBackground(item.color)
            }
          ]}
        >
          <Grid>
            <Row>
              <Col>
                <Text style={styles.agendaLocation}>
                  {formatMonth(item.startDatePretty)} {item.location}{" "}
                </Text>

                <Text style={styles.text}>{item.name}</Text>

                {undefined !== item.group &&
                  item.group !== null &&
                  item.group.length > 0 && (
                    <View style={styles.groupView}>
                      <Text style={styles.groupText}>{item.group}</Text>
                    </View>
                  )}
              </Col>
              <Col style={{ width: 60 }}>
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: this.formatBackground(item.color),
                    width: 45,
                    height: 45,
                    marginLeft: 10,
                    marginTop: 5,
                    alignItems: "center",
                    paddingLeft: 0,
                    paddingRight: 0,
                    justifyContent: "center"
                  }}
                >
                  <View>
                    <Ionicons
                      style={{ color: "white", fontSize: 20 }}
                      name={item.icon}
                    />
                  </View>
                </View>
              </Col>
            </Row>
            <Row>
              <View>{this.renderImage(item.photo1)}</View>
            </Row>
          </Grid>
        </View>
      </TouchableOpacity>
    );
  }

  getIcon(eventDetails) {
    let ret = "";

    if (ret.contains("sport")) {
      ret = "ios-american-football";
    } else if (ret.contains("art")) {
      ret = "ios-brush";
    } else {
      ret = "";
    }

    return ret;
  }

  renderTime(start, end) {
    if (undefined != start && start.length > 0) {
      return <Text style={styles.agendaDate}>{formatTime(start, end)} </Text>;
    }
  }

  renderImage(calImage) {
    if (undefined != calImage && calImage.length > 0) {
      return (
        <Image
          source={{ uri: calImage }}
          style={{ width: 300, height: 150 }}
          resizeMode="contain"
        />
      );
    }
  }

  renderEmptyDate(item) {
    return (
      <View style={{ height: 15, flex: 1, paddingTop: 30 }}>
        <Text style={{ color: "black" }} />
      </View>
    );
  }

  renderTime(start, end) {
    if (undefined != start && start.length > 0) {
      return <Text style={styles.agendaDate}>{formatTime(start, end)} </Text>;
    }
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }

  formatBackground(color) {
    let ret = "#1DAEF2";

    switch (color) {
      case "grey":
        ret = "#64D4D2";
        break;
      case "yellow":
        ret = "#8F63B8";
        break;
      case "red":
        ret = "#E63946";
        break;
      case "green":
        day = "#64D4D2";
        break;
      case "light blue":
        day = "white";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }

    return ret;
  }

  pad(n, width, z) {
    z = z || "0";
    n += "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  calendarEventsX: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(calendar1);
