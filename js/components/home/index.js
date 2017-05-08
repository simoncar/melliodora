import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Dimensions, Share } from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Header, Content, Text, Button, Icon, Card, CardItem, Left, Body, Right } from 'native-base';

import { Grid, Col } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';
import styles from './styles';

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

class Home extends Component {

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
      newTask: ""
    };
  };

  componentDidMount(){
      this.listenForCalendarEvents(this.calendarEvents);
    }

  listenForCalendarEvents(calendarEvents) {
    calendarEvents.on('value', (dataSnapshot) => {
      var calendarEvents = [];
      /*
      dataSnapshot.forEach((child) => {
        calendarEvents.push({
          name: child.val().name,
          _key: child.key
        });
      });
      */

      dataSnapshot.forEach((snapshot) => {

        calendarEvents.push({
          name: snapshot.val().name,
          _key: snapshot.key,
          title: snapshot.child("summary").val(),
          location: snapshot.child("location").val(),
          startDatePretty: snapshot.child("start__date_pretty").val(),
          startTimePretty: snapshot.child("start__time_pretty").val()
        });

      });


      this.setState({
        calendarEvents:calendarEvents
      });
    });
  }

  render() {
    console.log('View1 props: ', this.props);

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

        <Content showsVerticalScrollIndicator={false}>

          <Card dataArray={this.state.calendarEvents} style={{ backgroundColor: '#fff', marginTop: 0, marginRight: 0 }}
                                   renderRow={(rowData) =>

            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() =>  Actions.story({
                mytitle: rowData.title,
                mydate: '1 jan 2017'
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
}


function renderRow() {
  return (
    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story()}>
      <View style={styles.newsContent}>
        <Text numberOfLines={2} style={styles.newsHeader}>
              AAAAAAAA
          </Text>
        <Grid style={styles.swiperContentBox}>
          <Col style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              <Text style={styles.newsLink}>May 20, 2017</Text>
            </TouchableOpacity>
            <Icon name="ios-time-outline" style={styles.timeIcon} />
            <Text style={styles.newsLink}>6:00 am</Text>
          </Col>
          <Col>
            <TouchableOpacity style={styles.newsTypeView}>
              <Text style={styles.newsTypeText}>Changi Airport</Text>
            </TouchableOpacity>
          </Col>
        </Grid>
      </View>
    </TouchableOpacity>
  );
};


function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Home);
