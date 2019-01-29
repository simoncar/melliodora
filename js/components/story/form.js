import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { Container, Header, Content, Button, Icon, Body } from 'native-base';

import { Actions } from 'react-native-router-flux';
import { Constants } from 'expo';
import styles from './styles';

import * as firebase from 'firebase';
var instID = Constants.manifest.extra.instance;

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

class newStory extends Component {
  uid = '';
  storyRef = null;

  constructor(props) {
    super(props);

    this.state = {
      eventTitle: (props.edit) ? props.eventTitle : "",
      eventDescription: (props.edit) ? props.eventDescription : "",
      location: (props.edit && props.location !== undefined) ? props.location : null,
      phone: (props.edit && props.phone !== undefined) ? props.phone : null,
      email: (props.edit && props.email !== undefined) ? props.email : null,
      url: (props.edit) ? props.url : "",
      photo1: (props.edit) ? props.photo1 : "",
      photo2: (props.edit) ? props.photo2 : "",
      photo3: (props.edit) ? props.photo3 : "",
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
      });


  
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
    setTimeout(() => {Actions.pop()}, 100)
 
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

            <Button>
                 <Text></Text>
                
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
                autoFocus={true}
                style={[styles.eventTitle]}
                value={this.state.eventTitle}
              />

              <TextInput
                onChangeText={(text) => this.setState({ eventDescription: text })}
                placeholder={"Description"}
                autoFocus
                multiline
                style={[styles.eventText]}
                value={this.state.eventDescription}
              />


              <TextInput
                onChangeText={(text) => this.setState({ location: text })}
                placeholder={"Location"}
                autoFocus={true}
                style={[styles.eventText]}
                value={this.state.location}
              />


              <TextInput
                onChangeText={(text) => this.setState({ phone: text })}
                placeholder={"Phone"}
                autoFocus={true}
                style={[styles.eventText]}
                value={this.state.phone}
              />


              <TextInput
                onChangeText={(text) => this.setState({ email: text })}
                placeholder={"Email"}
                autoFocus={true}
                style={[styles.eventText]}
                value={this.state.email}
              />


              <TextInput
                onChangeText={(text) => this.setState({ url: text })}
                placeholder={"More info website URL"}
                autoFocus={true}
                style={[styles.eventText]}
                value={this.state.url}
              />
              <TextInput
                onChangeText={(text) => this.setState({ photo1: text })}
                placeholder={"Photo 1 URL"}
                autoFocus={true}
                style={[styles.eventText]}
                value={this.state.photo1}
              />
              <TextInput
                onChangeText={(text) => this.setState({ photo2: text })}
                placeholder={"Photo 2 URL"}
                autoFocus={true}
                style={[styles.eventText]}
                value={this.state.photo2}
              />
              <TextInput
                onChangeText={(text) => this.setState({ photo3: text })}
                placeholder={"Photo 3 URL"}
                autoFocus={true}
                style={[styles.eventText]}
                value={this.state.photo3}
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
