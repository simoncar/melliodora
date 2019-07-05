import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import { ListItem, Divider } from 'react-native-elements';
import HeaderSearchBar from './HeaderSearchBar';


export default class AttendeeListingScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderSearchBar navigation={navigation} />
      )
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      firstQuery: '',
      attendeeData: [
        { attendeeName: "Student 1", attendeeClass: '3XYZ', lastSeen: 2359, lastLocated: 'Gate 1' },
        { attendeeName: "Student 2", attendeeClass: '3XYZ', lastSeen: 2359, lastLocated: 'Gate 1', imgSrc: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' },
        { attendeeName: "Student 3", attendeeClass: '3XYZ', lastSeen: 2359, lastLocated: 'Gate 1' },
        { attendeeName: "Student 4", attendeeClass: '3XYZ', lastSeen: 2359, lastLocated: 'Gate 1' },
        { attendeeName: "Student 5", attendeeClass: '3XYZ', lastSeen: 2359, lastLocated: 'Gate 1' }
      ]
    };
  }
  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item }) => {
    const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: 'MD' };
    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 16 }}>{item.attendeeName}</Text>
            <Text style={{ flex: 0, flexShrink: 1, fontSize: 10, alignSelf: 'center', justifyContent: 'center', color: 'gray' }}>BeaconID</Text>
          </View>
        }
        chevron={true}
        subtitle={
          <View style={{ flex: 1, flexDirection: 'column', paddingTop: 8 }}>
            <Text style={{ color: 'gray' }}>Class {item.attendeeClass}</Text>
            <Text style={{ color: 'gray' }}>last seen on {item.lastSeen}</Text>
            <Text style={{ color: 'gray' }}>last located at {item.lastLocated}</Text>
          </View>
        }
        onPress={() => this.props.navigation.navigate("AttendeeDetailScreen")}
      />
    )
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE'
        }}
      />
    );
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.attendeeData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})
