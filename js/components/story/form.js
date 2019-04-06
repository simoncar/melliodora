import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { Container, Header, Content, Button, Icon, Body } from 'native-base';

import { Actions } from 'react-navigation';
import { Constants } from 'expo';
import styles from './styles';

import * as firebase from 'firebase';
import { Ionicons, EvilIcons, MaterialIcons } from '@expo/vector-icons';

var instID = Constants.manifest.extra.instance;

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

class newStory extends Component {
  uid = '';
  storyRef = null;

  constructor(props) {
    super(props);

    this.state = {
      notifyMeSwitch: false,
      
      eventTitle: (props.edit) ? props.eventTitle : "",
      eventDescription: (props.edit) ? props.eventDescription : "",
      location: (props.edit && props.location !== undefined) ? props.location : null,
      phone: (props.edit && props.phone !== undefined) ? props.phone : null,
      email: (props.edit && props.email !== undefined) ? props.email : null,
      url: (props.edit) ? props.url : "",
      photo1: (props.edit && props.photo1 !== undefined) ? props.photo1 : null,
      photo2: (props.edit && props.photo2 !== undefined) ? props.photo2 : null,
      photo3: (props.edit && props.photo3 !== undefined) ? props.photo3 : null,
      photoSquare: (props.edit) ? props.photoSquare : "",
      eventDate: props.eventDate,
      eventStartTime: props.eventStartTime,
      eventEndTime: props.eventEndTime,
   
      displayStart: props.displayStart,
      displayEnd: props.displayEnd,

      _key: (props.edit) ? props._key : ""
    };

    this.generateID = this.generateID.bind(this);
    this.addStory = this.addStory.bind(this);
  }
  

  generateID() {
    let d = new Date().getTime();
    let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(5);
    });

    return id;
  }

  setUid(value) {
    this.uid = value;
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }


  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }


  addStory() {

    this.storyRef = firebase.database().ref('instance/' + instID + '/feature/' + this.state._key);

    if (this.props.edit) {

      this.storyRef.update({
        summary: this.state.eventTitle,
        description: this.state.eventDescription,
        location: this.state.location,
        phone: this.state.phone,
        email: this.state.email,
        htmlLink: this.state.url,
        photo1: this.state.photo1,
        photo2: this.state.photo2,
        photo3: this.state.photo3,
        date_start: (this.state.eventDate !== undefined) ? this.state.eventDate : null,
        time_start_pretty: (this.state.eventStartTime !== undefined) ? this.state.eventStartTime : null,
        time_end_pretty: (this.state.eventEndTime !== undefined) ? this.state.eventEndTime : null,
        displayStart: (this.state.displayStart !== undefined) ? this.state.displayStart : null,
        displayEnd: (this.state.displayEnd !== undefined) ? this.state.displayEnd : null,
        photoSquare:  this.state.photoSquare,
      });

    } else {
      this.storyRef.push({
        summary: this.state.eventTitle,
        description: this.state.eventDescription,
        location: this.state.location,
        phone: this.state.phone,
        email: this.state.email,
        htmlLink: this.state.url,
        photo1: this.state.photo1,
        photo2: this.state.photo2,
        photo3: this.state.photo3,
        date_start: (this.state.eventDate !== undefined) ? this.state.eventDate : null,
        time_start_pretty: (this.state.eventStartTime !== undefined) ? this.state.eventStartTime : null,
        time_end_pretty: (this.state.eventEndTime !== undefined) ? this.state.eventEndTime : null,
        displayStart: (this.state.displayStart !== undefined) ? this.state.displayStart : null,
        displayEnd: (this.state.displayEnd !== undefined) ? this.state.displayEnd : null,
        photoSquare:  this.state.photoSquare,
      });
    }

    const { goBack } = this.props.navigation;

    goBack(null)
    setTimeout(() => {goBack(null)}, 100)
 
  }


  updateStory() {

    this.storyRef = firebase.database().ref('instance/' + instID + '/feature/7');

  }

  render() {
    const { goBack } = this.props.navigation;
    
    return (

      <Container style={{ backgroundColor: '#fff' }}>

        <Header style={styles.header}>
          <View style={styles.viewHeader}>
            <View style={styles.btnHeader}>
              <Button transparent style={styles.btnHeader}  onPress={() => goBack(null)}>
                <Icon active name="arrow-back" style={styles.btnHeader} />
              </Button>
            </View>
            <Body>
              <Text style={styles.textHeader}>Stamford</Text>
            </Body>
            <View style={styles.btnHeader}>

              <Button
                transparent
                onPress={() => this._shareMessage()} >

                
              </Button>
            </View>
          </View>
        </Header>

        <Content showsVerticalScrollIndicator={false}>

          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, paddingTop: 50, paddingLeft: 10, paddingRight: 10 }}>
              <TextInput
                onChangeText={(text) => this.setState({ eventTitle: text })}
                placeholder={"Title"}
                autoFocus
                style={[styles.eventTitle]}
                value={this.state.eventTitle}
              />

              <TextInput
                onChangeText={(text) => this.setState({ eventDescription: text })}
                placeholder={"Description"}
                multiline
                style={[styles.eventText]}
                value={this.state.eventDescription}
              />


              <TextInput
                onChangeText={(text) => this.setState({ location: text })}
                placeholder={"Location"}
                style={[styles.eventText]}
                value={this.state.location}
              />


              <TextInput
                onChangeText={(text) => this.setState({ phone: text })}
                placeholder={"Phone"}
                style={[styles.eventText]}
                value={this.state.phone}
              />


              <TextInput
                onChangeText={(text) => this.setState({ email: text })}
                placeholder={"Email"}
                style={[styles.eventText]}
                value={this.state.email}
              />


              <TextInput
                onChangeText={(text) => this.setState({ url: text })}
                placeholder={"More info website URL"}
                style={[styles.eventText]}
                value={this.state.url}
              />
              <TextInput
                onChangeText={(text) => this.setState({ photo1: text })}
                placeholder={"Photo 1 URL"}
                style={[styles.eventText]}
                value={this.state.photo1}
              />
              <TextInput
                onChangeText={(text) => this.setState({ photo2: text })}
                placeholder={"Photo 2 URL"}
                style={[styles.eventText]}
                value={this.state.photo2}
              />

              <TextInput
                onChangeText={(text) => this.setState({ photo3: text })}
                placeholder={"Photo 3 URL"}
                style={[styles.eventText]}
                value={this.state.photo3}
              />
              <TextInput
                onChangeText={(text) => this.setState({ photoSquare: text })}
                placeholder={"Photo Square"}
                style={[styles.eventText]}
                value={this.state.photoSquare}
              />

            <Text>
              Event Date (needs some re-programming but good enough for now - please use exact format or it will break)
            </Text>
            <Text>
            </Text>
            <Text>
              Event Date (if user presses 'add to calendar')
            </Text>
            <Text>
              format: 2019-01-01  yyyy-mm-dd
            </Text>
              <TextInput
                onChangeText={(text) => this.setState({ eventDate: text })}
                placeholder={"Event Date  format: 2019-01-01"}
                style={[styles.eventText]}
                value={this.state.eventDate}
              />

<Text>
              Event Time (if user presses 'add to calendar')
            </Text>
            <Text>
              format: 18:00  hh:mm  (optional)
            </Text>
              <TextInput
                onChangeText={(text) => this.setState({ eventStartTime: text })}
                placeholder={"Start Time  format: hh:mm (optional)"}
                style={[styles.eventText]}
                value={this.state.eventStartTime}
              />
              <TextInput
                onChangeText={(text) => this.setState({ eventEndTime: text })}
                placeholder={"End Time  format: hh:mm (otional)"}
                style={[styles.eventText]}
                value={this.state.eventEndTime}
              />

            <Text>
              Display to users - Start
            </Text>
            <Text>
              format: 2019-01-01 09:00 yyyy-mm-dd hh:mm
            </Text>
            <TextInput
                onChangeText={(text) => this.setState({ displayStart: text })}
                placeholder={"Display Start"}
                style={[styles.eventText]}
                value={this.state.displayStart}
              />

            <Text>
              Display to users - End
            </Text>
            <Text>
              format: 2019-02-01 13:00 yyyy-mm-dd hh:mm
            </Text>
            <TextInput
                onChangeText={(text) => this.setState({ displayEnd: text })}
                placeholder={"Display End"}
                style={[styles.eventText]}
                value={this.state.displayEnd}
              />


            </View>
            <TouchableOpacity style={[styles.saveBtn]}
              disabled={(this.state.eventTitle.length > 0) ? false : true}
              onPress={this.addStory}>
              <Text style={[styles.buttonText,
              {
                color: (this.state.eventTitle.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
              }]}>
                Save
                    </Text>
            </TouchableOpacity>

          </View>

        </Content>
      </Container >
    );
  }

}

//Connect everything
export default connect(null)(newStory);
