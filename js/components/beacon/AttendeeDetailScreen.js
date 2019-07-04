import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableHighlight, Dimensions } from 'react-native'
import { ListItem, SearchBar, Avatar, Divider, Button } from 'react-native-elements';
import BeaconHistoryItem from "./BeaconHistoryItem";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
import moment from "moment";

export default class AttendeeDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      userBeacons: {},
      userHistoryData: {},
      userHistory: []
    };
  }

  componentDidMount() {
    const beaconID = this.props.navigation.getParam("beaconID");

    const todayDate = moment()
      .add(8, "hours")
      .format("YYYYMMDD");

    this.getData(beaconID, todayDate)
      .then(data => this.setState({
        userHistory: data,
        loading: false
      }));
  }

  async getData(beaconID, date) {
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
    if (index === 0) return <BeaconHistoryItem start={true} {...item} key={key}/>;
    else if (index === this.state.userHistory.length - 1)
      return <BeaconHistoryItem last={true} {...item} key={key}/>;
    else return <BeaconHistoryItem {...item} key={key}/>;
  };

  render() {

    const {lastSeen, state, mac} = this.props.navigation.state.params;

    return (

      <View style={{ height: "100%" }}>
        <TouchableHighlight
          style={styles.bookmark}
          underlayColor="#ff7043"
        >
          <FontAwesome name="star" size={28} color="gold" />
        </TouchableHighlight>
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
                <Text style={styles.detailsText}>last seen {moment(lastSeen).format("LLL")}</Text>
                <Text style={styles.detailsText}>current status {state}</Text>
              </View>

            </View>
          </View>


          <View style={{ paddingVertical: 5, paddingHorizontal: 15 }}>
            <Button
              title="Today 28 June 2019"
              raised
              icon={
                <View style={{ paddingRight: 10 }}>
                  <FontAwesome
                    name="calendar"
                    size={15}
                    color='#48484A'
                  />
                </View>

              }
              buttonStyle={{ backgroundColor: '#d3d3d3', padding: 2 }}
              titleStyle={{ color: '#48484A', fontSize: 14 }}
            />
          </View>
          <View>
            {
              this.state.userHistory.map(this._renderListItem)
            }

          </View>


        </ScrollView>

      </View>
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
    color: '#48484A',
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
})
