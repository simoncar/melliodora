import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Platform, TouchableOpacity,ListView,TouchableHighlight,View } from 'react-native';

import { Actions, ActionConst } from 'react-native-router-flux';

import { Container, Header, Content, Text, Left, Right, Body, Button, Icon } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { openDrawer } from '../../actions/drawer';
import ProgressBar from './../x_loaders/ProgressBar';

import theme from '../../themes/base-theme';
import styles from './styles';

import * as firebase from 'firebase';

const headerLogo = require('../../../images/Header-Logo-White-0002.png');

const firebaseConfig = {
  apiKey: "AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw",
  authDomain: "calendar-app-57e88.firebaseapp.com",
  databaseURL: "https://calendar-app-57e88.firebaseio.com",
  storageBucket: "calendar-app-57e88.appspot.com"
};

const newsletterFirebaseApp = firebase.initializeApp(firebaseConfig, "newsletter");

class Newsletter extends Component {

  constructor(props) {
      super(props);
      console.log('1. newsletter constructor');
      this.newsletterEvents = newsletterFirebaseApp.database().ref('instance/0001-sais_edu_sg/news');
      this.state = {
        user:null,
        loading: true,
        items: {},
        dataSource: new ListView.DataSource({
             rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  };

  listenForNewslettersEvents(newsletterEvents) {
    newsletterEvents.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          content: child.val().content,
          _key: child.key
        });
        console.log('content = ', child.val().title);
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }


  componentDidMount() {
    this.listenForNewslettersEvents(this.newsletterEvents);
  }


  listenForNewslettersEventsX(newsletterEvents) {
    newsletterEvents.on('value', (dataSnapshot) => {
    var newsletterEvents = [];

     const newItems = {};
     Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
     this.setState({
       items: newItems
     });



     this.state.items[0] = [];

      dataSnapshot.forEach((snapshot) => {
            console.log('3. ... loading item ');
            this.state.items[0].push({
                content: snapshot.child("content").val()
              });
              yyy = yyy +  snapshot.child("content").val()
              console.log('content = ', yyy);
      });

      this.setState({
        newsletterEvents:newsletterEvents
      });
    });
  }

  render() {
    return (
      <Container>
        <Image
          source={require('../../../images/glow2.png')}
          style={styles.container} >
          <Header>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>

              <View>
                <Button
                  transparent
                  onPress={this.props.openDrawer} >
                  <Icon active name="menu" />
                </Button>
              </View>

              <Body>
                <Image
                  source={headerLogo}
                  style={styles.imageHeader} />
              </Body>
              <View>
                <Button
                  transparent
                  onPress={() => Actions.homeNav({ type: ActionConst.RESET  })}>
                  <Icon active name="ios-home" />
                </Button>
              </View>


            </View>

          </Header>

          <View style={styles.overviewHeaderContainer}>
            <Text style={styles.overviewHeader}>NEWSLETTERS</Text>
            <Text note style={styles.overviewHead}>
            </Text>
          </View>


          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.overviewContent}/>

        </Image>
      </Container>
    );
  }

    _renderItem(item) {

      const onPress = () => {
        AlertIOS.alert(
          'Complete',
          null,
          [
            {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
            {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
          ]
        );
      };

      return (

        <TouchableOpacity   onPress={() => Actions.newsletterStory({newsletterContent: "Content:" + item.content})}>
          <View style={styles.overviewTopicsBox}>
            <Text >{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Newsletter);
