

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Dimensions, ScrollView, SafeAreaView, ActivityIndicator, ListView, Text} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchBar from 'react-native-searchbar';
import * as firebase from 'firebase';

import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Footer, FooterTab, Content, Button, Card, CardItem, Left, Body, Right } from 'native-base';

import { Grid, Col, Row } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';
import * as ActionCreators from '../../actions'
import styles from './styles';
import HeaderContent from './../headerContent/header';
import Analytics from '../../lib/analytics';
import { Constants } from 'expo';

import { MaterialIcons } from '@expo/vector-icons';

import { Agenda } from 'react-native-calendars';
import { formatTime, formatMonth } from '../global.js';
const deviceWidth = Dimensions.get('window').width;
var i = 0;

var calendarEvents = [];
const newItems = {};

let items = [
  1337,
  'janeway',
  '2017-08-29_ZZGoogleDOCRow-127______SS_TheBigNight615pmG6G12Refreshments' : {
    "colorId" : "yellow",
    "date_start" : "2017-08-29",
    "description" : "",
    "email" : "",
    "htmlLink" : "",
    "icon" : "ios-flag-outline",
    "iconLib" : "",
    "location" : "Adams, Level 6\nFranklin, Level 6\nFranklin, Level 3",
    "phone" : "",
    "photo1" : "",
    "photo2" : "",
    "photo3" : "",
    "summary" : "The Big Night - 6:15pm - G6-G12 - Refreshments",
    "time_end_pretty" : "",
    "time_start_pretty" : ""
  },
        "2017-08-29_ZZGoogleDOCRow-128______SS_TheBigNight515pmG6G12FieldStudiesGradeLevelPresentations" : {
          "colorId" : "yellow",
          "date_start" : "2017-08-29",
          "description" : "*",
          "email" : "",
          "htmlLink" : "",
          "icon" : "ios-flag-outline",
          "iconLib" : "",
          "location" : "G6 - Stamford Arena\nG7 - Reagan Theater\nG8 - Adams iLearn 1\nG9 - Adams iLearn 2\nG10 - Franklin iLearn \nG11 - Senior Study Room (Adams Library, Level 7)",
          "phone" : "",
          "photo1" : "",
          "photo2" : "",
          "photo3" : "",
          "summary" : "The Big Night - 5:15pm - G6-G12 - Field Studies Grade Level Presentations",
          "time_end_pretty" : "",
          "time_start_pretty" : ""
        },
        "2017-08-29_ZZGoogleDOCRow-129______SS_TheBigNight5pmG6G12FieldStudiesOverview" : {
          "colorId" : "yellow",
          "date_start" : "2017-08-29",
          "description" : "",
          "email" : "",
          "htmlLink" : "",
          "icon" : "ios-flag-outline",
          "iconLib" : "",
          "location" : "Stamford Arena (Adams, B2)",
          "phone" : "",
          "photo1" : "",
          "photo2" : "",
          "photo3" : "",
          "summary" : "The Big Night - 5pm - G6-G12 - Field Studies Overview",
          "time_end_pretty" : "",
          "time_start_pretty" : ""
        },
    
    {
    different: {
      types: 0,
      data: false,
      that: {
        can: {
          be: {
            quite: {
              complex: {
                hidden:  'gold!' ,
                },
              },
            },
          },
        },
      },
    },
    [ 4, 2, 'tree' ],
  ];

class search extends Component {

  constructor(props) {
    super(props);

    this.calendarEvents = firebase.database().ref('instance/' + Constants.manifest.extra.instance + '/calendar/all_v2');

    this.state = {
      user: null,
      loading: true,
      items: [],
      results: [],
    };

    this.loadFromRedux();

    items = this.state.items;


    this._handleResults = this._handleResults.bind(this);

  };

  _handleResults(results) {
    this.setState({ results });
  }

  componentDidMount() {
    this.listenLoadFromFirebase(this.calendarEvents);
  }

  loadFromRedux() {

    this.state.items = [];
    this.loadItems()

    dataSnapshot = (this.props.calendarEventsX.items)
    key = '';

    for (var key in dataSnapshot) {

      if (!dataSnapshot.hasOwnProperty(key)) continue;

      var snapshot = dataSnapshot[key];

      if (undefined != snapshot["date_start"]) {

        strtime = snapshot["date_start"];
        strtime = strtime.substring(0, 10);

        if (!this.state.items[strtime]) {
          this.state.items[strtime] = [];
        }

        console.log ("dasighiasbgviuadsbviudsbviuabvdsabvkiadbvikbvikbvkuv");

        this.state.items[strtime].push({
          name: snapshot["summary"],
          title: snapshot["summary"],
          description: snapshot["description"],
          location: snapshot["location"],
          startDatePretty: snapshot["date_start"],
          startTimePretty: snapshot["time_start_pretty"],
          endTimePretty: snapshot["time_end_pretty"],
          group: snapshot["group"],
          iconLib: snapshot["iconLib"],
          icon: snapshot["icon"],
          color: snapshot["colorId"],
          phone: snapshot["phone"],
          email: snapshot["email"],
          url: snapshot["htmlLink"],
          photo1: snapshot["photo1"],
          photo2: snapshot["photo2"],
          photo3: snapshot["photo3"]
        });

      }
    }
  }

  listenLoadFromFirebase(calendarEvents) {

    calendarEvents.on('value', (dataSnapshot2) => {
      this.props.setCalendarItems(dataSnapshot2)

      dataSnapshot = dataSnapshot2
      this.state.items = [];
      this.loadItems()

      dataSnapshot.forEach((snapshot) => {

        strtime = snapshot.child("date_start").val();
        strtime = strtime.substring(0, 10);

        if (!this.state.items[strtime]) {
          this.state.items[strtime] = [];
        }

        if (undefined != this.state.items[strtime]) {
          this.state.items[strtime].push({
            name: snapshot.child("summary").val(),
            title: snapshot.child("summary").val(),
            description: snapshot.child("description").val(),
            location: snapshot.child("location").val(),
            startDatePretty: snapshot.child("date_start").val(),
            startTimePretty: snapshot.child("time_start_pretty").val(),
            endTimePretty: snapshot.child("time_end_pretty").val(),
            group: snapshot.child("group").val(),
            iconLib: snapshot.child("iconLib").val(),
            icon: snapshot.child("icon").val(),
            color: snapshot.child("colorId").val(),
            phone: snapshot.child("phone").val(),
            email: snapshot.child("email").val(),
            url: snapshot.child("htmlLink").val(),
            photo1: snapshot.child("photo1").val(),
            photo2: snapshot.child("photo2").val(),
            photo3: snapshot.child("photo3").val()

          });
        }
      });

      this.setState({
        calendarEvents: calendarEvents
      });

      //this.state.items = [];
    });
  }

  loadItems(day) {

    setTimeout(() => {
      for (let i = -15; i < 365; i++) {
        const time = Date.now() + i * 24 * 60 * 60 * 1000;
        const strtime = this.timeToString(time);

        if (!this.state.items[strtime]) {
          this.state.items[strtime] = [];
        }
      }

      const newItems = {};

      Object.keys(this.state.items).forEach(
        key => { newItems[key] = this.state.items[key]; });
  

    }, 1000);

  }

  render() {


    return (
      <View>
        <View style={{ marginTop: 110 }}>
          {
            this.state.results.map((result, i) => {
              return (
                  <View>
                  <Text> Results</Text>
                <Text key={i}>
                  {typeof result === 'object' && !(result instanceof Array) ? 'gold object!' : result.toString()}
                </Text>
</View>
              );
            })
          }
          <TouchableOpacity onPress={() => this.searchBar.show()}>
            <View style={{ backgroundColor: 'green', height: 100, marginTop: 50 }}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.searchBar.hide()}>
            <View style={{ backgroundColor: 'red', height: 100 }}/>
          </TouchableOpacity>
        </View>
        <SearchBar
          ref={(ref) => this.searchBar = ref}
          data={this.state.items}
          handleResults={this._handleResults}
          showOnLoad
        />
      </View>
    );
  }
  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

}




const mapDispatchToProps = (dispatch) => {
  console.log('bind action creators');
  return bindActionCreators(ActionCreators, dispatch)
};


const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  calendarEventsX: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(search);
