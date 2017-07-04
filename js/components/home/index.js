import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Card, CardItem, Left, Body, Right } from 'native-base';


import { Grid, Col, Row } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import * as ActionCreators  from '../../actions'

import styles from './styles';
import HeaderContent from './../headerContent/';


import {Agenda} from 'react-native-calendars';
import { formatTime } from '../global.js';

const deviceWidth = Dimensions.get('window').width;
const headerLogo = require('../../../images/Header-Logo-White-0001.png');

console.log("ACfromHome=", ActionCreators);

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw",
  authDomain: "calendar-app-57e88.firebaseapp.com",
  databaseURL: "https://calendar-app-57e88.firebaseio.com",
  storageBucket: "calendar-app-57e88.appspot.com"
};

var i = 0;

var calendarEvents = [];
const newItems = {};

const firebaseApp = firebase.initializeApp(firebaseConfig);

class calendar1 extends Component {

  constructor(props) {
    super(props);

    this.calendarEvents = firebaseApp.database().ref('instance/0001-sais_edu_sg/calendar/all_v2');

    this.state = {
      user:null,
      loading: true,
      items: {}
    };
    this.quickLoad(this.calendarEvents);

};

  componentDidMount(){
     this.listenForCalendarEvents(this.calendarEvents);
    }

quickLoad(calendarEvents){
  //console.log('running quickload ',calendarEvents)

  obj = (this.props.calendarEventsX.items)
  this.state.items = [];
  key = '';

  for (var key in obj) {

    if (!obj.hasOwnProperty(key)) continue;

        var obj2 = obj[key];

        if (undefined != obj2["date_start"]){
            strtime = obj2["date_start"];
            strtime = strtime.substring(0,10);

            if (!this.state.items[strtime]) {
              this.state.items[strtime] = [];
            }

             if (undefined != this.state.items[strtime]){
                    this.state.items[strtime].push({
                      name: obj2["summary"],
                      title: obj2["summary"],
                      location: obj2["location"],
                      startDatePretty: obj2["date_start"],
                      startTimePretty: obj2["time_start_pretty"],
                      endTimePretty: obj2["time_end_pretty"],
                      iconLib: obj2["iconLib"],
                      icon:obj2["icon"],
                      color: obj2["colorId"],
                      phone: obj2["phone"],
                      email: obj2["email"],
                      url: obj2["htmlLink"]
                    });

                }
                this.setState({
                  calendarEvents:calendarEvents
                });

              }
          }
}


  listenForCalendarEvents(calendarEvents) {

    calendarEvents.on('value', (dataSnapshot2) => {
        this.props.setCalendarItems(dataSnapshot2)

        dataSnapshot = dataSnapshot2
        console.log ('write datasnapshot to redux');
        this.state.items = [];
        dataSnapshot.forEach((snapshot) => {

        strtime = snapshot.child("date_start").val();
        strtime = strtime.substring(0,10);

        if (!this.state.items[strtime]) {
          this.state.items[strtime] = [];
        }

       if (undefined != this.state.items[strtime]){
            this.state.items[strtime].push({
              name: snapshot.child("summary").val(),
              title: snapshot.child("summary").val(),
              location: snapshot.child("location").val(),
              startDatePretty: snapshot.child("date_start").val(),
              startTimePretty: snapshot.child("time_start_pretty").val(),
              endTimePretty: snapshot.child("time_end_pretty").val(),
              iconLib: snapshot.child("iconLib").val(),
              icon:snapshot.child("icon").val(),
              color: snapshot.child("colorId").val(),
              phone: snapshot.child("phone").val(),
              email: snapshot.child("email").val(),
              url: snapshot.child("htmlLink").val()
          });
        }
      });

      this.setState({
        calendarEvents:calendarEvents
      });

    });
  }

  loadItems(day) {

    setTimeout(() => {
      for (let i = -15; i < 365; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strtime = this.timeToString(time);

        if (!this.state.items[strtime]) {
           this.state.items[strtime] = [];
        }
      }

      const newItems = {};

      Object.keys(this.state.items).forEach(
          key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });

    }, 1000);
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
      <HeaderContent />

        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={Date()}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
        />
      </Container>
    );
  }


  renderItem(item) {
    return (
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() =>  Actions.story({
             eventTitle: item.title,
             eventDate: item.startDatePretty,
             eventStartTime: item.startTimePretty,
             eventEndTime: item.endTimePretty,
             location: item.location,
             eventImage: item.eventImage,
             phone: item.phone,
             email: item.email,
             color: item.color,
             url: item.url

           })
         }>
        <View style={[styles.agendaItem, {height: item.height} ]}>

        <Grid>

         <Row>
           <Col>
           <Text style={styles.agendaDate}>{formatTime(item.startTimePretty, item.endTimePretty)} </Text>

           <Text style={styles.text}>{item.name}</Text>
           <Text style={styles.agendaLocation}>{item.location}</Text>

           </Col>
           <Col style={{width:50}}>

             <Button style={{
                  borderRadius: 30,
                  backgroundColor: this.formatBackground(item.color),
                  width: 45,
                  height: 45,
                  alignItems: 'center',
                  paddingLeft: 0,
                  paddingRight: 0,
                  justifyContent: "center",
                }} >
               <Icon style={{
                   color: '#fff',
                   fontSize: 20,
               }} name={item.icon} />
             </Button>
           </Col>
        </Row>
      </Grid>
         </View>
     </TouchableOpacity>

    );
  }

  getIcon(eventDetails) {
    var ret = '';

    if (ret.contains("sport")) {
        ret = 'ios-american-football'
    } else if (ret.contains("art")) {
      ret = 'ios-brush'
    } else {
      ret = ''
    }

    return (ret);
  };

  renderEmptyDate() {
    return (
      <View style={{ height: 15, flex:1, paddingTop: 30}}><Text style={{color: 'black'}}></Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  formatBackground(color) {
    var ret = '#1DAEF2';

    switch (color) {
    case "grey":
        ret = '#64D4D2';
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

    return (ret);
  };



};


const mapDispatchToProps = (dispatch) => {
  console.log ('bind action creators');
  return bindActionCreators (ActionCreators, dispatch)
};


const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  calendarEventsX: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(calendar1);
