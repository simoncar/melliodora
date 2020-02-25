import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from "firebase";
import DomainSelection from "./DomainSelection";
import { setCommunityCreate } from '../../store/communityCreation';
import { connect } from 'react-redux';

class WelcomeScreen extends Component {

  componentDidMount() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser || currentUser.isAnonymous) {
      return this.props.navigation.pop();
    }

    const { uid, email } = currentUser;
    console.log({ uid, email });

    //get user details from firestore
    console.log("this.props", this.props)
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={{ fontSize: 32 }} Welcome {this.stat}></Text> */}
        <TouchableOpacity
          style={styles.SubmitButtonStyle}
          activeOpacity={0.5}
          onPress={() => this.props.dispatch(setCommunityCreate(true))}>
          <Text style={[styles.TextStyle, { fontSize: 32 }]}>Create Community</Text>
        </TouchableOpacity>
        <DomainSelection />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    padding: 10,
  },

  containerStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d2d2d2",
    backgroundColor: "#ffffff",
    marginVertical: 8,
  },
  TextStyle: {
    color: "#636366",
    textAlign: "center",
  },
  SubmitButtonStyle: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 4,
    marginBottom: 30,
  },
});

const mapStateToProps = state => ({
  communityCreate: state.communityCreate,
});
export default connect(mapStateToProps)(WelcomeScreen);