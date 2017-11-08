import React, {Component} from 'react';
import ReactNative from 'react-native';
import { Image, Text, ListView, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import styles from './styles';

class ListItem extends Component {




  render() {

  var photoSquare = this.props.item.photoSquare;

    return (



      <View style={styles.newsContentLine}>


        <TouchableOpacity style={{ flexDirection: 'row' }}  onPress={() => { Actions.ptaHome(); }} >
          <Image  source={{uri: `${photoSquare}`}} style={styles.newsImage} />
          <View style={styles.newsContentNoLine}>
            <Text numberOfLines={1} style={styles.newsHeader}>
                              {this.props.item.title}
                              </Text>

                              <Text style={styles.newsTypeText}>
{this.props.item.description}
                              </Text>

          <View style={{flexDirection: 'column'}}>
            <Text numberOfLines={1} style={ styles.newsLink}></Text>
            <Text style={styles.newsLink}></Text>
          </View>
          </View>
        </TouchableOpacity>
      </View>








    );
  }
}

module.exports = ListItem;
