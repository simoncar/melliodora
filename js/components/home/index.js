import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Card, CardItem, Left, Body, Right } from 'native-base';

import { Grid, Col } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';
import styles from './styles';

import {Agenda} from 'react-native-calendars';
import { setUsername, setPassword} from '../global.js';

const deviceWidth = Dimensions.get('window').width;
const headerLogo = require('../../../images/Header-Logo-White-0001.png');

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw",
  authDomain: "calendar-app-57e88.firebaseapp.com",
  databaseURL: "https://calendar-app-57e88.firebaseio.com",
  storageBucket: "calendar-app-57e88.appspot.com"
};

const firebaseConfig_ = {
  apiKey: "AIzaSyBLz76NsS1fjNXcaGBUhcp9qA-MFg1Hrg8",
  authDomain: "calendarapp-b7967.firebaseapp.com",
  databaseURL: "https://calendarapp-b7967.firebaseio.com",
  storageBucket: "calendarapp-b7967.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

class calendar1 extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    console.log('1. constructor');
    this.calendarEvents = firebaseApp.database().ref('instance/0001-sais_edu_sg/calendar/all_v2');
    this.state = {
      user:null,
      loading: true,
      newTask: "",
      items: {}
    };

  };

  componentDidMount(){
    console.log('2. component did mount ');
      this.listenForCalendarEvents(this.calendarEvents);
    }

  listenForCalendarEvents(calendarEvents) {
    calendarEvents.on('value', (dataSnapshot) => {
      var calendarEvents = [];

     //strtime = Date();

    // this.state.items[strtime] = [];

      dataSnapshot.forEach((snapshot) => {

        strtime = snapshot.child("date_start").val();
        strtime = strtime.substring(0,10);
         if (undefined != this.state.items[strtime]){
                this.state.items[strtime].push({
                  name: snapshot.child("summary").val(),
                  title: snapshot.child("summary").val(),
                  location: snapshot.child("location").val(),
                  startDatePretty: snapshot.child("date_start").val(),
                  startTimePretty: snapshot.child("time_start_pretty").val(),
                  endTimePretty: snapshot.child("time_end_pretty").val()
                });
            }

      });

      this.setState({
        calendarEvents:calendarEvents
      });
    });
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Header>
        <Left>
          <Button transparent style={styles.btnHeader} onPress={this.props.openDrawer} >
                     <Icon active name="menu" />
          </Button>
        </Left>
          <Body>
          <Image source={headerLogo} style={styles.imageHeader} />
          </Body>
        <Right>
           <Button transparent onPress={() => Actions.login({ type: ActionConst.RESET  })}>
                      <Icon active name="power" />
           </Button>
        </Right>
        </Header>

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


  loadItems(day) {
console.log('3. loadItems loadItems loadItems loadItems loadItems' )
    setTimeout(() => {
      for (let i = -15; i < 985; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strtime = this.timeToString(time);

        if (!this.state.items[strtime]) {
console.log('3. loadItems init strtime loadItems loadItems loadItems=' , strtime )
          this.state.items[strtime] = [];
        }
      }

      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);

  }

  renderItem(item) {
    return (



      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() =>  Actions.story({
                   eventTitle: item.title,
                   eventDate: item.startDatePretty,
                   eventTime: item.startTimePretty,
                   location: item.location,
                   eventImage: item.eventImage,
                 })
               }>

               <View style={[styles.agendaItem, {height: item.height}]}>
               <Text style={styles.agendaDate}>{item.startTimePretty} - {item.endTimePretty}</Text>
               <Text style={{color: 'black'}}>{item.name}</Text>
               <Text style={styles.agendaLocation}>{item.location}</Text>
               </View>
               </TouchableOpacity>


    );
  }

  renderEmptyDate() {
    return (
      <View style={{height: 15, flex:1, paddingTop: 30}}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

};



function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(calendar1);
