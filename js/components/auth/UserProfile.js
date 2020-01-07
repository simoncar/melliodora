import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import firebase from "firebase";


export default class UserProfile extends Component {
  state = {
    user: null
  }
  componentWillMount() {
    const { user } = this.props.navigation.state.params;
    this.setState({ user });
  }

  _renderProfilePic = () => {
    const width = 250;
    const photoURL = this.state.user.photoURL;
    if (photoURL) {
      return (
        <View style={{ alignSelf: "center" }}>
          <Image
            style={{
              width: width,
              height: width,
              margin: 12,
              borderRadius: width / 2,
              borderWidth: 5,
              borderColor: "lightgray",
              justifyContent: "center",
              alignItems: "center",
            }}
            source={{ uri: photoURL }}
          />
        </View>

      )
    }

  }
  render() {
    return (
      <View>
        <View style={{ flexDirection: "column" }}>
          {this._renderProfilePic()}
          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              Email:
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {this.state.user.email}
            </Text>
          </View>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fdfdfd"
  },
  nameText: {
    fontWeight: "600",
    fontSize: 18,
    color: "black"
  },
  sectionContentText: {
    color: "#808080",
    fontSize: 14
  },
});
