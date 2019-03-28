import React, { Component } from 'react';

import { Actions } from 'react-native-router-flux';
import { Image, Text, View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import styles from './styles';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { isAdmin } from '../global.js';

const { width } = Dimensions.get('window');

class ListItem extends Component {

  render() {

    var photoSquare = this.props.item.item.photoSquare;
    var photo1 = this.props.item.item.photo1;


    return (

      <View style={styles.newsContentLine}>


        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.story({
          eventTitle: this.props.item.item.title,
          eventDescription: this.props.item.item.description,
          eventDate: this.props.item.item.eventDate,
          eventStartTime: this.props.item.item.eventStartTime,
          eventEndTime: this.props.item.item.eventEndTime,
          location: this.props.item.item.location,
          eventImage: '',
          phone: this.props.item.item.phone,
          email: this.props.item.item.email,
          color: '',
          photo1: this.props.item.item.photo1,
          photo2: this.props.item.item.photo2,
          photo3: this.props.item.item.photo3,
          photoSquare: this.props.item.item.photoSquare,
          url: this.props.item.item.url,
          displayStart: this.props.item.item.displayStart,
          displayEnd: this.props.item.item.displayEnd,
          _key: this.props.item.item._key,
          calendarEvents: this.props.calendarEvents,
          hidden: this.props.item.item.hidden,
          })
        }>

        <View>
          <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
            <Image
              style={{ width: 36, height: 36, margin: 12, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray' }}
              source={{uri: `${photoSquare}`}} 
             
            />
   
            {this.props.item.item.hidden == true &&
                  <Text style={{ fontWeight: 'bold', height: 60, lineHeight: 60 }}>HIDDEN {this.props.item.item.title}</Text>
            } 
            {this.props.item.item.hidden == false &&
                  <Text style={{ fontWeight: 'bold', height: 60, lineHeight: 60, flex: 1}}>{this.props.item.item.title}</Text>
  
            } 

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { Actions.chat({ chatroom: this.props.item.item.title }); }} >
                 <SimpleLineIcons name="bubble" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }}></SimpleLineIcons>
             </TouchableOpacity> 


                 <Ionicons name="ios-more" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }}></Ionicons>
                 
              
          </View>
          
          <View>
          {this.props.item.item.hidden == false &&
          <Image
            source={{uri: `${photo1}`}} 
            style={{ width, height: 200 }}
            resizeMode={'contain'}
          />
          }
        </View>

        </View>
   
  

  </TouchableOpacity>

  </View >


    );
  }
}

module.exports = ListItem;
