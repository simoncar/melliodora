import React, { Component } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Container, Content, Header, Icon, Left, Body, Right, Button } from 'native-base';

import { Calendar, Permissions } from 'expo';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as ActionCreators from '../../actions'

import Analytics from '../../lib/analytics';
import { Constants } from 'expo';

import styles from './styles';



class CalendarRow extends Component {
  static navigationOptions = {
    title: 'Calendars',
  };

  _selectCalendar(calendar, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url) {


    this._addEvent(calendar.id, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url)

    Actions.pop();
  };

  _addEvent = async (phoneCalendarID, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url) => {


    const timeInOneHour = new Date(eventDate);
    timeInOneHour.setHours(timeInOneHour.getHours() + 1);
    //console.log("datestring = " + eventDate + 'T' + eventStartTime +'+08:00')
    var newEvent = {};

    if (eventStartTime == null) {

      newEvent = {
        title: eventTitle,
        location: location,
        allDay: true,
        startDate: new Date(eventDate),
        endDate: new Date(eventDate),
        notes: eventDescription,
        timeZone: 'Asia/Singapore',
      };

    } else {

      newEvent = {
        allDay: false,
        title: eventTitle,
        location: location,
        startDate: new Date(eventDate + 'T' + eventStartTime + '+08:00'),
        endDate: new Date(eventDate + 'T' + eventEndTime + '+08:00'),
        notes: eventDescription,
        timeZone: 'Asia/Singapore',
      };
    }

    try {
      await Calendar.createEventAsync(phoneCalendarID, newEvent);
      Alert.alert('Event saved successfully');


      //analytics  -----
      let trackingOpts = {
        instId: Constants.manifest.extra.instance,
        emailOrUsername: global.username,
        story: newEvent.eventDate + ' - ' + newEvent.startDate + ' - ' + newEvent.endDate + ' - ' + newEvent.eventTitle
      };

      Analytics.identify(global.username, trackingOpts);
      Analytics.track(Analytics.events.ADD_TO_CALENDAR_SUCCESS, trackingOpts);
      //analytics --------

      this._findEvents(phoneCalendarID);
    } catch (e) {
      Alert.alert('Event not saved successfully', e.message);

      //analytics  -----
      let trackingOpts = {
        instId: Constants.manifest.extra.instance,
        emailOrUsername: global.username,
        story: newEvent.eventDate + ' - ' + newEvent.startDate + ' - ' + newEvent.endDate + ' - ' + newEvent.eventTitle
      };

      Analytics.identify(global.username, trackingOpts);
      Analytics.track(Analytics.events.ADD_TO_CALENDAR_FAILED, trackingOpts);
      //analytics --------

    }
  };

  _findEvents = async id => {
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

    const {
      calendar,
      eventTitle,
      eventDescription,
      eventDate,
      eventStartTime,
      eventEndTime,
      location,
      eventImage,
      phone,
      email,
      url
    } = this.props;

    console.log("props on calendar = " + this.props);

    const calendarTypeName =
      calendar.entityType === Calendar.EntityTypes.REMINDER ? 'Reminders' : 'Events';

    console.log("ttttt" + eventTitle + '  ------   ' + eventDescription)
    //&& calendar.entityType == "event" 
    return (
      <View style={styles.selectCalendar}>
        {calendar.allowsModifications == true &&
          <Button transparent style={styles.calendarButton} onPress={() => this._selectCalendar(calendar, eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, location, eventImage, phone, email, url)} >
            <Icon name="ios-calendar" />
            <Text style={styles.calendarText} > {calendar.title}</Text>
          </Button>
        }
        {calendar.allowsModifications == false &&
          <Button transparent style={styles.calendarButton} >
            <Icon style={styles.calendarTextDisabled} name="ios-alert" />
            <Text style={styles.calendarTextDisabled} > {calendar.title} (read only)</Text>
          </Button>
        }
      </View>
    );
  }
}

class phoneCalendar extends Component {
  static navigationOptions = {
    title: 'Calendars',
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

  _askForCalendarPermissions = async () => {
    const response = await Permissions.askAsync('calendar');
    const granted = response.status === 'granted';
    this.setState({
      haveCalendarPermissions: granted,
    });
    return granted;
  };

  _findCalendars = async () => {

    const calendarGranted = await this._askForCalendarPermissions();
    //const reminderGranted = await this._askForReminderPermissions();
    if (calendarGranted) {
      const eventCalendars = await Calendar.getCalendarsAsync();

      this.setState({ calendars: [...eventCalendars] });
    }
  };


  render() {



    console.log('gggg' + this.props);
    console.log('gggg' + this.props.eventTitle)


    if (this.state.calendars.length) {
      return (
        <Container style={{ backgroundColor: '#fff' }}>

          <Header style={styles.header}>
            <View style={styles.viewHeader}>
              <View>
                <Button transparent onPress={() => Actions.pop()}>
                  <Icon
                    active
                    name="arrow-back"
                    style={styles.headerIcons} />
                </Button>
              </View>
              <Body>
                <Image source={global.header_logoID} style={styles.imageHeader} />
              </Body>

            </View>
          </Header>
          <Content showsVerticalScrollIndicator={false}>
            <View>
              <View style={styles.newsContent}>

                <Text selectable={true} style={styles.eventTitle}>
                  Select Calendar for {this.props.eventTitle}
                </Text>
              </View>

              <ScrollView >
                {this.state.calendars.map(calendar => (
                  <CalendarRow
                    calendar={calendar}
                    eventTitle={this.props.eventTitle}
                    eventDescription={this.props.eventDescription}
                    eventDate={this.props.eventDate}
                    eventStartTime={this.props.eventStartTime}
                    eventEndTime={this.props.eventEndTime}
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



    return (
      <View>


      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  console.log('bind action creators');
  return bindActionCreators(ActionCreators, dispatch)
};


const mapStateToProps = state => ({
  navigation: state.cardNavigation,

});

export default connect(mapStateToProps, mapDispatchToProps)(phoneCalendar);
