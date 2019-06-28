import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { ListItem, SearchBar, Avatar, Divider, Button } from 'react-native-elements';
import BeaconHistoryItem from "./BeaconHistoryItem";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

export default class AttendeeDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      userBeacons: {},
      userHistoryData: {},
      userHistory: [
        { timestamp: 2359, campus: "SAIS", state: "Perimeter" },
        { timestamp: 2359, campus: "SAIS", state: "Perimeter" },
        { timestamp: 2359, campus: "SAIS", state: "Perimeter" },
        { timestamp: 2359, campus: "SAIS", state: "Perimeter" },
        { timestamp: 2359, campus: "SAIS", state: "Perimeter" },
        { timestamp: 2359, campus: "SAIS", state: "Perimeter" }
      ]
    };
  }

  _renderListItem = (item, index) => {
    if (index === 0) return <BeaconHistoryItem start={true} {...item} />;
    else if (index === this.state.userHistory.length - 1)
      return <BeaconHistoryItem last={true} {...item} />;
    else return <BeaconHistoryItem {...item} />;
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.topContainer}>
          <View style={styles.avatarContainer}>
            <Avatar
              size="xlarge"
              rounded
              source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' }}
              activeOpacity={0.7}
            />
          </View>
          <View style={styles.detailContainer}>
            <View>
              <Text style={styles.attendeeNameText}>Mrs. Hello World</Text>
              <Text style={styles.detailsText}>Grade 3</Text>
              <Text style={styles.detailsText}>Class 3XYZ</Text>
              <Text></Text>
              <Text style={styles.detailsText}>last seen today at 11:01 PM</Text>
              <Text style={styles.detailsText}>last located at Singapore</Text>
            </View>

          </View>
        </View>

  
        <View style={{ paddingVertical: 5, paddingHorizontal: 15 }}>
          <Button
            title="Today 28 June 2019"
            raised
            icon={
              <View style={{paddingRight: 10}}>
                <FontAwesome
                  name="calendar"
                  size={15}
                  color='#48484A'
                />
              </View>

            }
      
            buttonStyle={{ backgroundColor: '#d3d3d3', padding: 2 }}
            titleStyle={{ color: '#48484A', fontSize:14 }}

          />
        </View>


        {
          this.state.userHistory.map(this._renderListItem)
        }

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#d3d3d3'
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
    padding: 20,
  },
  attendeeNameText: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 16,
  },
  detailsText: {
    color: '#48484A'
  }
})
