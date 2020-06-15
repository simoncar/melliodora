import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import firebase from "firebase";
import DomainSelection from "./DomainSelection";
import { setCommunityCreate } from "../../store/communityCreation";
import { connect } from "react-redux";

class WelcomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const firstname = navigation.getParam("firstName");
    return {
      title: "Welcome " + firstname,
    };
  };

  componentDidMount() {
    const firstName = this.props.auth.userInfo.firstName;
    if (firstName) {
      this.props.navigation.setParams({ firstName });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <DomainSelection showCreateCommunity={false} navigation={this.props.navigation} />
      </View>
    );
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

const mapStateToProps = (state) => ({
  communityCreate: state.communityCreate,
  auth: state.auth,
});
export default connect(mapStateToProps)(WelcomeScreen);
