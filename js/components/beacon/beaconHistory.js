import React, { Component } from "react";
import { FlatList, Container, Content, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import * as firebase from "firebase";

import Constants from "expo-constants";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationProps } from "react-navigation-props-mapper";

import BeaconHistoryItem from './BeaconHistoryItem';
import moment from "moment";



let instID = Constants.manifest.extra.instance;

@withMappedNavigationProps()
class beaconHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      userBeacons: {},
      history: []
    };
  }


  componentDidMount() {

    const today = new moment().format("YYYYMMDD");
    const beacon = this.props._key;

    let loginsRef = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beaconHistory")
      .doc(today)
      .collection(beacon);


    loginsRef
      .get()
      .then(snapshot => {
        const history = [];
        snapshot.forEach(doc => {
          history.push(doc.data());
        });
        this.setState({ history });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });


  }

  _renderListItem = ({item, index}) => {
    if (index === 0) return <BeaconHistoryItem start={true} {...item}></BeaconHistoryItem>
    else if (index === (this.state.history.length -1)) return <BeaconHistoryItem  last={true} {...item}></BeaconHistoryItem>
    else return <BeaconHistoryItem {...item}></BeaconHistoryItem>
  }

  render() {
    
    return (
      <View style={{paddingTop:50}}>
        <FlatList data={this.state.history} renderItem={this._renderListItem} />
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(beaconHistory);
