import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Image, Text, View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

class ListItem extends Component {
//https://github.com/saitoxu/InstaClone/blob/master/src/AvView.js


  render() {

    var photoSquare = this.props.item.photoSquare;
    var photo1 = this.props.item.photo1;

    return (

      <View style={styles.newsContentLine}>


        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story({
          eventTitle: this.props.item.title,
          eventDescription: this.props.item.description,
          eventDate: this.props.item.eventDate,
          eventStartTime: this.props.item.eventStartTime,
          eventEndTime: this.props.item.eventEndTime,
          location: '',
          eventImage: '',
          phone: '',
          email: '',
          color: '',
          photo1: this.props.item.photo1,
          photo2: this.props.item.photo2,
          photo3: this.props.item.photo3,
          url: this.props.item.url,
          calendarEvents: this.props.calendarEvents,
          })
        }>

        <View>
          <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
            <Image
              style={{ width: 36, height: 36, margin: 12, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray' }}
              source={{uri: `${photoSquare}`}} 
            />
            <Text style={{ fontWeight: 'bold', height: 60, lineHeight: 60, flex: 1 }}>{this.props.item.title}</Text>
            <Ionicons name="ios-more" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
          </View>
          
          <View>
          <Image
            source={{uri: `${photo1}`}} 
            style={{ width, height: 200 }}
            resizeMode={'contain'}
          />
        </View>

        </View>
   
  

  </TouchableOpacity>

  </View >


    );
  }
}

module.exports = ListItem;
