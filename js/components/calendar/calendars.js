import React, { Component } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Container, Content, Button, Text } from "native-base";
import * as Calendar from "expo-calendar";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import { Ionicons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import Analytics from "../../lib/analytics";
import moment from "moment";

import styles from "./styles";

@withMappedNavigationParams()
class CalendarRow extends Component {
  static navigationOptions = {
    title: "Calendars",
  };

  _selectCalendar(calendar, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url) {
    const { goBack } = this.props.navigation;
    this._addEvent(calendar.id, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url);
    goBack(null);
  }

  _addEvent = async (phoneCalendarID, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url) => {
    var newEvent = {};

    if (eventStartTime == null) {
      newEvent = {
        title: eventTitle,
        location: location,
        allDay: true,
        startDate: new Date(eventDate),
        endDate: new Date(eventDate),
        notes: eventDescription,
        timeZone: "Asia/Singapore",
      };
    } else {
      var dtStart = moment(eventDate + "T" + moment(eventStartTime + " GMT+0800 (+08)", ["h:mm A"]).format("HH:mm"));
      var dtEnd = moment(eventDate + "T" + moment(eventEndTime + " GMT+0800 (+08)", ["h:mm A"]).format("HH:mm"));

      newEvent = {
        allDay: false,
        title: eventTitle,
        location: location,
        startDate: new Date(dtStart),
        endDate: new Date(dtEnd),
        notes: eventDescription,
        timeZone: "Asia/Singapore",
      };
    }

    try {
      Analytics.track("Calendar Add", { story: this.props.summaryMyLanguage });

      await Calendar.createEventAsync(phoneCalendarID, newEvent);

      this._findEvents(phoneCalendarID);
    } catch (e) {
      Alert.alert("Event not saved", e.message);
    }
  };

  _findEvents = async (id) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const nextYear = new Date();
    nextYear.setFullYear(yesterday.getDate() + 10);
    const events = await Calendar.getEventsAsync([id], yesterday, tomorrow);
    this.setState({ events });
  };

  render() {
    const { calendar, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url } = this.props;


    const calendarTypeName = calendar.entityType === Calendar.EntityTypes.REMINDER ? "Reminders" : "Events";
    return (
      <View style={styles.selectCalendar}>
        {calendar.allowsModifications == true && (
          <Button
            transparent
            style={styles.calendarButton}
            onPress={() => this._selectCalendar(calendar, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url)}
          >
            <Ionicons name="ios-calendar" style={styles.calendarText} />
            <Text style={styles.calendarText}> {calendar.title} </Text>
          </Button>
        )}
      </View>
    );
  }
}

class phoneCalendar extends Component {
  static navigationOptions = {
    title: I18n.t("calendar"),
  };

  constructor(props) {
    super(props);
    this._findCalendars();
  }

  state = {
    haveCalendarPermissions: false,
    haveReminderPermissions: false,
    calendars: [],
    activeCalendarId: null,
    activeCalendarEvents: [],
    showAddNewEventForm: false,
    editingEvent: null,
  };

  _findCalendars = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync();
      this.setState({ calendars: [...calendars] });
    }
  };

  render() {
    if (this.state.calendars.length) {
      return (
        <Container style={{ backgroundColor: "#fff" }}>
          <Content showsVerticalScrollIndicator={false}>
            <View>
              <View style={styles.newsContent}>
                <Text selectable={true} style={styles.eventTitle}>
                  Add to Calendar
                </Text>
              </View>

              <ScrollView>
                {this.state.calendars.map((calendar) => (
                  <CalendarRow
                    navigation={this.props.navigation}
                    calendar={calendar}
                    eventTitle={this.props.summaryMyLanguage}
                    eventDescription={this.props.descriptionMyLanguage}
                    eventDate={this.props.date_start}
                    eventStartTime={this.props.time_start_pretty}
                    eventEndTime={this.props.time_end_pretty}
                    location={this.props.location}
                    eventImage={this.props.eventImage}
                    phone={this.props.phone}
                    email={this.props.email}
                    color={this.props.color}
                    photo1={this.props.photo1}
                    photo2={this.props.photo2}
                    photo3={this.props.photo3}
                    url={this.props.url}
                    key={calendar.id}
                    updateCalendar={this._updateCalendar}
                    deleteCalendar={this._deleteCalendar}
                  />
                ))}
              </ScrollView>
            </View>
          </Content>
        </Container>
      );
    }

    return <View />;
  }
}

export default phoneCalendar;
