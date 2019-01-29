import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { Container, Header, Content, Button, Icon, Body } from 'native-base';

import { Actions } from 'react-native-router-flux';
import { Constants } from 'expo';

import * as firebase from 'firebase';
var instID = Constants.manifest.extra.instance;

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

class NewQuote extends Component {
  uid = '';
  storyRef = null;

  constructor(props) {
    super(props);

    this.state = {
      eventTitle: (props.edit) ? props.eventTitle : "",
      phone: (props.edit) ? props.phone : ""
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

    this.storyRef = firebase.database().ref('instance/' + instID + '/feature/7');

    if (this.props.edit) {

      
      this.storyRef.update({
        date_start: '2018-01-01',
        description: this.state.eventTitle,
        displayEnd: '2018-01-01',
        displayStart: '2018-01-01',
        photoSquare: '',
        summary: this.state.phone,
      });


      console.log ("PUSH")
    } else {
      this.storyRef.push({
        date_start: '2018-01-01',
        description: this.state.eventTitle,
        displayEnd: '2018-01-01',
        displayStart: '2018-01-01',
        photoSquare: '',
        summary: this.state.phone,
      });
    }

    Actions.pop();
  }


updateStory() {

    this.storyRef = firebase.database().ref('instance/' + instID + '/feature/7');

}

  render() {
    return (

      <Container style={{ backgroundColor: '#fff' }}>

      <Header style={styles.header}>
        <View style={styles.viewHeader}>
          <View>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon
                active
                name="arrow-back"
                style={styles.headerIcons} />
            </Button>
          </View>
          <Body>
            <Image source={global.header_logoID} style={styles.imageHeader} />
          </Body>
          <View>

     
          </View>
        </View>
      </Header>

      <Content showsVerticalScrollIndicator={false}>

        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flex: 1, paddingTop: 50, paddingLeft: 10, paddingRight: 10 }}>
            <TextInput
              onChangeText={(text) => this.setState({ eventTitle: text })}
              placeholder={"Title"}
              autoFocus={true}
              style={[styles.title]}
              value={this.state.eventTitle}
            />
            <TextInput
              multiline={true}
              onChangeText={(text) => this.setState({ phone: text })}
              placeholder={"Phone"}
              style={[styles.quote]}
              value={this.state.phone}
            />
          </View>
          <TouchableOpacity style={[styles.saveBtn]}
            disabled={(this.state.eventTitle.length > 0 && this.state.phone.length > 0) ? false : true}
            onPress={this.addStory}>
            <Text style={[styles.buttonText,
              {
                color: (this.state.eventTitle.length > 0 && this.state.phone.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
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
export default connect(null)(NewQuote);

var styles = StyleSheet.create({
  saveBtn: {
    width: windowWidth,
    height: 44,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "#6B9EFA"
  },

  buttonText: {
    fontWeight: "500",
  },

  quote: {
    fontSize: 17,
    lineHeight: 38,
    fontFamily: 'Helvetica Neue',
    color: "#333333",
    padding: 16,
    paddingLeft: 0,
    flex: 1,
    height: 200,
    marginBottom: 50,
    borderTopWidth: 1,
    borderColor: "rgba(212,211,211, 0.3)",
  },

  title: {
    fontWeight: "400",
    lineHeight: 22,
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    height: 25 + 32,
    padding: 16,
    paddingLeft: 0
  },
});