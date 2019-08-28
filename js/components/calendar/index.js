import React, { Component } from "react";
import { Image, View, TouchableOpacity, AsyncStorage } from "react-native";
import { Container, Text } from "native-base";
import * as firebase from "firebase";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Agenda } from "react-native-calendars";
import styles from "./styles";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import { Ionicons } from "@expo/vector-icons";
import { formatTime, formatMonth } from "../global.js";
import I18n from "../../lib/i18n";
import moment from "moment";
import "moment/min/locales";
import Constants from "expo-constants";

const tabBarIcon = name => ({ tintColor }) => (
  <Ionicons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

@withMappedNavigationParams()
class calendar1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
    };

    const todayDate = moment().format("YYYY-MM-DD");
    const todayDay = new moment().format("MMMM Do");

    if (!this.state.items[todayDate]) {
      this.state.items[todayDate] = [];
    }

    this.state.items[todayDate].push({
      summary: I18n.t("today") + " " + todayDay,
      summaryMyLanguage: I18n.t("today") + " " + todayDay,
      icon: "md-radio-button-off",
      color: "yellow",
      title: todayDay,
    });
  }

  static navigationOptions = {
    title: I18n.t("calendar"),
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 28,
    },
    tabBarColor: "#c51162",
    tabBarIcon: tabBarIcon("ios-calendar", "green"),
  };

  componentDidMount() {
    moment.updateLocale;
    this.calendarEvents = firebase
      .firestore()
      .collection(global.domain)
      .doc("calendar")
      .collection("calendarItems");

    this.loadFromAsyncStorage();

    this.listenLoadFromFirebase(this.calendarEvents);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  listenLoadFromFirebase(dataSnapshot2) {
    dataSnapshot2
      .get()
      .then(snapshot => {
        const items2 = [];
        var trans = {};
        this.loadItems();
        var itemCount = 0;
        var strtime = 0;
        snapshot.forEach(doc => {
          itemCount++;
          items2.push(doc.data());

          //   console.log (snapshot)
          strtime = doc.data().date_start;
          strtime = strtime.substring(0, 10);

          if (!this.state.items[strtime]) {
            this.state.items[strtime] = [];
          }

          trans = {
            source: "calendar",
            photo1: null,
            summaryMyLanguage: doc.data().summary,
            descriptionMyLanguage: doc.data().description,
          };

          if (undefined != this.state.items[strtime]) {
            this.state.items[strtime].push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
          }
        });

        var items = JSON.parse(JSON.stringify(this.state.items));
        if (itemCount > 10) {
          this._storeData(JSON.stringify(this.state.items));
        }

        this.setState({
          items,
        });

        this.loadItems();
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  loadFromAsyncStorage() {
    AsyncStorage.getItem("calendarItems").then(fi => {
      var items = JSON.parse(fi);
      if (null != items) {
        if (items.length > 0) {
          this.setState({
            items,
            loading: false,
          });
          this.loadItems();
        }
      }
    });
  }

  _storeData = async calendarItems => {
    try {
      AsyncStorage.setItem("calendarItems", calendarItems);
    } catch (error) {
      console.log(error);
      // Error saving data
    }
  };

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
    date.setDate(date.getDate());

    return (
      <Container>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={date}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          hideKnob={false}
          renderKnob={() => {
            return <Ionicons style={{ color: "#00adf5", fontSize: 30 }} name="ios-arrow-down" />;
          }}
          theme={{
            selectedDayBackgroundColor: "#00adf5",
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
        onPress={() => this.props.navigation.navigate("storyCalendar", item)}
      >
        <View
          style={[
            styles.agendaItem,
            {
              height: item.height,
              borderRightColor: this.formatBackground(item.color),
            },
          ]}
        >
          <Grid>
            <Row>
              <Col>
                <Text style={styles.agendaLocation}>
                  {formatMonth(item.date_start)} {item.location}{" "}
                </Text>

                <Text style={styles.text}>{item.summary}</Text>

                {undefined !== item.group && item.group !== null && item.group.length > 0 && (
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
                    justifyContent: "center",
                  }}
                >
                  <Ionicons style={{ color: "white", fontSize: 20 }} name={item.icon} />
                  <View />
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

  renderImage(calImage) {
    if (undefined != calImage && calImage.length > 0) {
      return <Image source={{ uri: calImage }} style={{ width: 300, height: 150 }} resizeMode="contain" />;
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
        ret = "#64D4D2";
        break;
      case "light blue":
        ret = "white";
        break;
      case 5:
        ret = "Friday";
        break;
      case 6:
        ret = "Saturday";
    }

    return ret;
  }

  pad(n, width, z) {
    z = z || "0";
    n += "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}

export default calendar1;
