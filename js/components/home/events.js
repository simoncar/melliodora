import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View , Button} from 'react-native';
import { Calendar } from 'expo';


class EventRow extends React.Component {
  render() {
    const { event } = this.props;
    return (
      <View style={styles.eventRow}>
        <Text>some text here</Text>
        <Text>AAA{JSON.stringify(event, null, 2)}</Text>
        <Button onPress={() => this.props.getEvent(event)} title="Get Event Using ID" />
        <Button onPress={() => this.props.getAttendees(event)} title="Get Attendees for Event" />
        <Button onPress={() => this.props.updateEvent(event)} title="Update Event" />
        <Button onPress={() => this.props.deleteEvent(event)} title="Delete Event" />
        {Platform.OS === 'android' && (
          <Button
            onPress={() => this.props.openEventInCalendar(event)}
            title="Open in Calendar App"
          />
        )}
      </View>
    );
  }
}

export default class EventsScreen extends React.Component {
  static navigationOptions = {
    title: 'Events',
  };

  state = {
    events: [],
  };

  componentDidMount() {

    console.log("props = " + this.props)
    console.log(this.props)

    const { params } = this.props.navigationState;
    const  id  = this.props.source.id
    console.log("ID = " + this.props.source.id)
    console.log("params = " + params)


    console.log (id)
    if (id) {
   
      
      this._findEvents(id);
    }
  }

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

  _addEvent = async recurring => {

console.log (this.props.navigationState)

    const calendar  = this.props.navigationState;
    if (!calendar.allowsModifications) {
      Alert.alert('This calendar does not allow modifications');
      return;
    }
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
    if (recurring) {
      newEvent.recurrenceRule = {
        occurrence: 5,
        frequency: 'daily',
      };
    }
    try {
      await Calendar.createEventAsync(calendar.id, newEvent);
      Alert.alert('Event saved successfully');
      this._findEvents(calendar.id);
    } catch (e) {
      Alert.alert('Event not saved successfully', e.message);
    }
  };

  _getEvent = async event => {
    try {
      const newEvent = await Calendar.getEventAsync(event.id, {
        futureEvents: false,
        instanceStartDate: event.startDate,
      });
      Alert.alert('Event found using getEventAsync', JSON.stringify(newEvent));
    } catch (e) {
      Alert.alert('Error finding event', e.message);
    }
  };

  _getAttendees = async event => {
    try {
      const attendees = await Calendar.getAttendeesForEventAsync(event.id, {
        futureEvents: false,
        instanceStartDate: event.startDate,
      });
      Alert.alert('Attendees found using getAttendeesForEventAsync', JSON.stringify(attendees));
    } catch (e) {
      Alert.alert('Error finding attendees', e.message);
    }
  };

  _updateEvent = async event => {
    const calendar  = this.props.navigationState;
    if (!calendar.allowsModifications) {
      Alert.alert('This calendar does not allow modifications');
      return;
    }
    const newEvent = {
      title: 'update test',
    };
    try {
      await Calendar.updateEventAsync(event.id, newEvent, {
        futureEvents: false,
        instanceStartDate: event.startDate,
      });
      Alert.alert('Event saved successfully');
      this._findEvents(calendar.id);
    } catch (e) {
      Alert.alert('Event not saved successfully', e.message);
    }
  };

  _deleteEvent = async event => {
    try {
      const  calendar  = this.props.navigationStates;
      await Calendar.deleteEventAsync(event.id, {
        futureEvents: false,
        instanceStartDate: event.recurrenceRule ? event.startDate : undefined,
      });
      Alert.alert('Event deleted successfully');
      this._findEvents(calendar.id);
    } catch (e) {
      Alert.alert('Event not deleted successfully', e.message);
    }
  };

  _openEventInCalendar = event => {
    Calendar.openEventInCalendar(event.id);
  };

  _renderActionButtons = () => {
    return (
      <View>
         <Button onPress={() => this._addEvent(false)} title="Add New Event" />
        <Button onPress={() => this._addEvent(false)} title="Add New Event" />
        <Button onPress={() => this._addEvent(true)} title="Add aa New Recurring Event" />
      </View>
    );
  };

  render() {
    if (this.state.events.length) {
      return (
        <ScrollView style={styles.container}>
          {this._renderActionButtons()}
          {this.state.events.map(event => (
            <EventRow
              event={event}
              key={`${event.id}${event.startDate}`}
              getEvent={this._getEvent}
              getAttendees={this._getAttendees}
              updateEvent={this._updateEvent}
              deleteEvent={this._deleteEvent}
              openEventInCalendar={this._openEventInCalendar}
            />
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={styles.container}>
        <Text>This calendar has no events.</Text>
        {this._renderActionButtons()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    flex: 1,
  },
  eventRow: {
    marginBottom: 12,
  },
});
