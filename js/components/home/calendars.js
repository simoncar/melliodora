import React , { Component } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import { Container, Content, Header, Icon, Left, Body, Right, Button} from 'native-base';

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

  _selectCalendar (calendar, eventTitle) {
    console.log ("aa calendar selected")
    console.log ("aa calendar Id = " + calendar.id)
    
    //Actions.phoneCalendarItem ({
    //  phoneCalendarID: calendar.id
    //})
    console.log ('hhh11' + this.props);
    console.log ('hhh11' + eventTitle)

    this._addEvent(calendar.id, eventTitle)
    console.log ("bb calendar selected")
    //Actions.webportal();

    console.log ('hhh22' + this.props);
    console.log ('hhh22' + eventTitle)
    Actions.pop();
   };

   _addEvent = async (phoneCalendarID,eventTitle) => {

    console.log ('hhh33' + this.props);
    console.log ('hhh33' + eventTitle)

    const timeInOneHour = new Date();
    timeInOneHour.setHours(timeInOneHour.getHours() + 1);
    const newEvent = {
      title: eventTitle,
      location: '420 Florence St',
      startDate: new Date(),
      endDate: timeInOneHour,
      notes: this.props.eventDescription,
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
    const { calendar, eventTitle } = this.props;
    const calendarTypeName =
      calendar.entityType === Calendar.EntityTypes.REMINDER ? 'Reminders' : 'Events';
  
    return (
      <View style={styles.selectCalendar}>
        {calendar.allowsModifications == true  && calendar.entityType == "event" && 
              <Button transparent style={styles.calendarButton}  onPress={() =>  this._selectCalendar(calendar, eventTitle)} >
                  <Icon name="ios-calendar-outline"/>   
                  <Text style={styles.calendarText} > {calendar.title}</Text>
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
      const eventCalendars = await Calendar.getCalendarsAsync('event');
      
      this.setState({ calendars: [...eventCalendars] });
    }
  };


  render() {



    console.log ('gggg' + this.props);
    console.log ('gggg' + this.props.eventTitle)


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
                      eventTitle = {this.props.eventTitle}
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
  console.log ('bind action creators');
  return bindActionCreators (ActionCreators, dispatch)
};


const mapStateToProps = state => ({
  navigation: state.cardNavigation,

});

export default connect(mapStateToProps, mapDispatchToProps)(phoneCalendar);
