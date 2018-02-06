import React , { Component } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import { Container, Header, Icon, Left, Body, Right, Button} from 'native-base';

import { Calendar, Permissions } from 'expo';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as ActionCreators  from '../../actions'

import styles from './styles';
const headerLogo = require('../../../images/Header-Logo-White-0002.png');

class CalendarRow extends Component {
  static navigationOptions = {
    title: 'Calendars',
  };

  _selectCalendar (calendar) {
    console.log ("aa calendar selected")
    console.log ("aa calendar Id = " + calendar.id)
    
    //Actions.phoneCalendarItem ({
    //  phoneCalendarID: calendar.id
    //})


    this._addEvent(calendar.id)
    console.log ("bb calendar selected")
    //Actions.webportal();

    Actions.pop();
   };


   _addEvent = async phoneCalendarID => {

    const timeInOneHour = new Date();
    timeInOneHour.setHours(timeInOneHour.getHours() + 1);
    const newEvent = {
      title: 'Celebrate Expo',
      location: '420 Florence St',
      startDate: new Date(),
      endDate: timeInOneHour,
      notes: "It's cool",
      timeZone: 'America/Los_Angeles',
    };
  
    try {
      await Calendar.createEventAsync(phoneCalendarID, newEvent);
      Alert.alert('Event saved successfully');
      this._findEvents(phoneCalendarID);
    } catch (e) {
      Alert.alert('Event not saved successfully', e.message);
    }
  };

  _findEvents = async id => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const nextYear = new Date();
    nextYear.setFullYear(yesterday.getDate() + 10);
    const events = await Calendar.getEventsAsync([id], yesterday,tomorrow);
    this.setState({ events });
  };

  
  render() {
    const { calendar } = this.props;
    const calendarTypeName =
      calendar.entityType === Calendar.EntityTypes.REMINDER ? 'Reminders' : 'Events';
    

    return (
   
      <View style={styles.calendarRow}>
  
   {calendar.allowsModifications == true  && calendar.entityType == "event" &&

    <View style={styles.calendarRow}>
     <Text>{JSON.stringify(calendar, null, 2)}</Text>
        <Text>{calendar.name}</Text>
        
        <Button
          onPress={() =>  this._selectCalendar(calendar)}
          title={`Select ${calendarTypeName}`}
        />
        </View>
      } 

</View>
   
    );
  }
}

class phoneCalendar extends Component {
  static navigationOptions = {
    title: 'Calendars',
  };

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

  _askForReminderPermissions = async () => {
    if (Platform.OS === 'android') return true;
    const response = await Permissions.askAsync('reminders');
    const granted = response.status === 'granted';
    this.setState({
      haveReminderPermissions: granted,
    });
    return granted;
  };

  _findCalendars = async () => {
    
    const calendarGranted = await this._askForCalendarPermissions();
    const reminderGranted = await this._askForReminderPermissions();
    if (calendarGranted && reminderGranted) {
      const eventCalendars = await Calendar.getCalendarsAsync('event');
      const reminderCalendars =
        Platform.OS === 'ios' ? await Calendar.getCalendarsAsync('reminder') : [];
      this.setState({ calendars: [...eventCalendars, ...reminderCalendars] });
    }
  };

  _addCalendar = async recurring => {
    const newCalendar = {
      title: 'cool new calendar',
      entityType: Calendar.EntityTypes.EVENT,
      color: '#c0ff33',
      sourceId:
        Platform.OS === 'ios'
          ? this.state.calendars.find(cal => cal.source && cal.source.name === 'Default').source.id
          : undefined,
      source:
        Platform.OS === 'android'
          ? {
            name: this.state.calendars.find(
              cal => cal.accessLevel == Calendar.CalendarAccessLevel.OWNER
            ).source.name,
            isLocalAccount: true,
          }
          : undefined,
      name: 'coolNewCalendar',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
      ownerAccount:
        Platform.OS === 'android'
          ? this.state.calendars.find(cal => cal.accessLevel == Calendar.CalendarAccessLevel.OWNER)
            .ownerAccount
          : undefined,
    };
    try {
      await Calendar.createCalendarAsync(newCalendar);
      Alert.alert('Calendar saved successfully');
      this._findCalendars();
    } catch (e) {
      Alert.alert('Calendar not saved successfully', e.message);
    }
  };

  _updateCalendar = async calendarId => {
    const newCalendar = {
      title: 'cool updated calendar',
    };
    try {
      await Calendar.updateCalendarAsync(calendarId, newCalendar);
      Alert.alert('Calendar saved successfully');
      this._findCalendars();
    } catch (e) {
      Alert.alert('Calendar not saved successfully', e.message);
    }
  };

  _deleteCalendar = async calendar => {
    Alert.alert(`Are you sure you want to delete ${calendar.title}?`, 'This cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => { },
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await Calendar.deleteCalendarAsync(calendar.id);
            Alert.alert('Calendar deleted successfully');
            this._findCalendars();
          } catch (e) {
            Alert.alert('Calendar not deleted successfully', e.message);
          }
        },
      },
    ]);
  };

  render() {

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
              <Image source={headerLogo} style={styles.imageHeader} />
            </Body>

          </View>
        </Header>

        <ScrollView >
     
          {this.state.calendars.map(calendar => (
            <CalendarRow
              calendar={calendar}
              key={calendar.id}
              navigation={this.props.navigation}
              updateCalendar={this._updateCalendar}
              deleteCalendar={this._deleteCalendar}
            />
          ))}

        </ScrollView>
        </Container>
      );
    }

    this._findCalendars();
    
    return (
      <View>
        <Button transparent onPress={() => {this._findCalendars();}}   title="Find Calendars">
            <View>
              <Text>Find Calendars</Text>
            </View>
        </Button>
  
      </View>
    );
  }
}



const mapDispatchToProps = (dispatch) => {
  console.log ('bind action creators');
  return bindActionCreators (ActionCreators, dispatch)
};


const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, mapDispatchToProps)(phoneCalendar);
