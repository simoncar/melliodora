import React, { Component } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { ListItem, SearchBar, Text } from 'react-native-elements';
import firebase from "firebase";
import moment from "moment";

export default class AttendeeListingScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: null
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      attendeeData: []
    };

  }

  componentDidMount() {

    this.getData()
      .then(data => this.setState({
        attendeeData: data,
        loading: false
      }));

  }

  async getData() {

    const data = [];
    await firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons")
      .limit(5)
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          data.push(doc.data());
        });
      });
    return data;
  }

  _keyExtractor = (item, index) => item.mac;

  _renderItem = ({ item }) => {
    const avatar = item.imgSrc ? { source: { uri: item.imgSrc } } : { title: 'MD' };
    return (
      <ListItem
        leftAvatar={{ rounded: true, ...avatar }}
        title={
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 16 }}>{item.mac}</Text>
            <Text style={{ flex: 0, flexShrink: 1, fontSize: 10, alignSelf: 'center', justifyContent: 'center', color: 'gray' }}>{item.mac}</Text>
          </View>
        }
        chevron={true}
        subtitle={
          <View style={{ flex: 1, flexDirection: 'column', paddingTop: 8 }}>
            <Text style={{ color: 'gray' }}>Class {item.campus}</Text>
            <Text style={{ color: 'gray' }}>last seen {moment(item.lastSeen).format("LLL")}</Text>
            <Text style={{ color: 'gray' }}>current status {item.state}</Text>
          </View>
        }
        onPress={() => this.props.navigation.navigate("AttendeeDetailScreen", item)}
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
    if (this.state.loading) return null;

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
