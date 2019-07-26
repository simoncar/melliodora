import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import firebase from "firebase";

import { withMappedNavigationParams } from "react-navigation-props-mapper";

const LogItem = require("./logItem");

@withMappedNavigationParams()
class logs extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Logs",
    headerBackTitle: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      logs: [],
    };
  }

  componentWillMount() {
    var logs = [];

    let logRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("log")
      .collection("logs");

    let query = logRef
      .orderBy("timestamp", "desc")
      .limit(300)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        snapshot.forEach(doc => {
          var logItem = doc.data();
          logs.push({
            logItem,
            _key: doc.id,
          });
        });
        this.setState({
          logs,
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  keyExtractor = item => item._key;

  _renderItem(item) {
    return <LogItem item={item} />;
  }

  render() {
    return (
      <View>
        <FlatList data={this.state.logs} renderItem={this._renderItem.bind(this)} keyExtractor={this.keyExtractor} />
      </View>
    );
  }
}

export default logs;
