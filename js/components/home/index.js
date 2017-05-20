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

    this.calendarEvents = firebaseApp.database().ref('instance/0001-sais_edu_sg/calendar/all');
    this.state = {
      user:null,
      loading: true,
      newTask: "",
      items: {}
    };

  };

  componentDidMount(){
      this.listenForCalendarEvents(this.calendarEvents);
    }

  listenForCalendarEvents(calendarEvents) {
    calendarEvents.on('value', (dataSnapshot) => {
      var calendarEvents = [];

  const strtime = '2017-05-16'

     this.state.items[strtime] = [];

      dataSnapshot.forEach((snapshot) => {

        calendarEvents.push({
          name: snapshot.val().name,
          _key: snapshot.key,
          title: snapshot.child("summary").val(),
          location: snapshot.child("location").val(),
          startDatePretty: snapshot.child("start__date_pretty").val(),
          startTimePretty: snapshot.child("start__time_pretty").val(),
          eventImage: snapshot.child("image").val()
        });



        this.state.items[strtime].push({
          name: snapshot.child("summary").val(),
        //  height: Math.max(50, Math.floor(Math.random() * 150)),
          title: snapshot.child("summary").val(),
          location: snapshot.child("location").val(),
          startDatePretty: snapshot.child("start__date_pretty").val(),
          startTimePretty: snapshot.child("start__time_pretty").val(),
          eventImage: snapshot.child("image").val()
        });

        console.log('loop XXXXXXXXXXXXXXXXX > ', 'Item for ' + strtime,snapshot.child("summary").val())

      });  //forEach


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

        <Content showsVerticalScrollIndicator={false}>

          <Card dataArray={this.state.calendarEvents} style={{ backgroundColor: '#fff', marginTop: 0, marginRight: 0 }}
                                   renderRow={(rowData) =>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() =>  Actions.story({
                eventTitle: rowData.title,
                eventDate: rowData.startDatePretty,
                location: rowData.location,
                eventImage: rowData.eventImage,
              })
            }>

              <View style={styles.newsContent}>
                <Text numberOfLines={2} style={styles.newsHeader}>
                      {rowData.title}
                  </Text>
                <Grid style={styles.swiperContentBox}>
                  <Col style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                      <Text style={styles.newsLink}>{rowData.startDatePretty}</Text>
                    </TouchableOpacity>
                    <Icon name="ios-time-outline" style={styles.timeIcon} />
                    <Text style={styles.newsLink}>{rowData.startTimePretty}</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.newsTypeView}>
                      <Text style={styles.newsTypeText}>  {rowData.location}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </View>
            </TouchableOpacity>

             }>

          </Card>

        </Content>

      </Container>
    );
  }


  loadItems(day) {

    console.log('Load Items for ${day.year}-${day.month}');
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strtime = this.timeToString(time);
        console.log('strtime = ', strtime);
        if (!this.state.items[strtime]) {

          this.state.items[strtime] = [];

          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {

            this.state.items[strtime].push({

              name: 'AAAItem for ' + strtime,
              //height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }


      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);

  }

  renderItem(item) {
    return (
      <View style={{backgroundColor: 'white',  height: item.height, flex:1, borderRadius: 5, padding: 10, marginRight: 10, marginTop: 5}}>
      <Text style={{color: 'black'}}>{item.name}</Text>
      </View>
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
