import React, { Component } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { ListItem, SearchBar, Text } from 'react-native-elements';

export default class AttendeeListingScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title")
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      attendeeData: [
        { attendeeName: "Grade 1", lastSeen: 234 },
        { attendeeName: "Grade 2", lastSeen: 344 },
        { attendeeName: "Grade 3", lastSeen: 234 },
        { attendeeName: "Grade 4", lastSeen: 123 },
        { attendeeName: "Grade 5", lastSeen: 124 }
      ]
    };
  }
  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({ item }) => (
    <ListItem
      title={item.attendeeName}
      chevron={true}
      leftIcon={{ name: 'person' }}
      subtitle={item.lastSeen + "\n" + "hello world" }
      subtitleStyle={{ paddingTop: 8, color:'gray'}}
      onPress={() => this.props.navigation.navigate("AttendeeDetailScreen")}
    />
  );

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
