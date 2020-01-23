import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";


export default class UserProfile extends Component {
  static navigationOptions = ({ navigation }) => ({
    // title: I18n.t("Edit", { defaultValue: "Edit" }),
    headerRight: () => {
      const permitEdit = navigation.state.params.permitEdit;

      if (!permitEdit) return;
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("EditUserProfile", { ...navigation.state.params });
          }}
        >
          <View
            style={{
              color: "#48484A",
              fontSize: 25,
              marginRight: 10,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text>Edit </Text>
            <Ionicons
              name="ios-settings"
              style={{
                color: "#48484A",
                fontSize: 25,
                marginRight: 10
              }}
            />
          </View>
        </TouchableOpacity>
      )
    }
  });

  state = {
    user: {}
  }
  componentWillMount() {
    const { uid, user } = this.props.navigation.state.params;
    console.log("uid", uid);
    if (user) {
      this.setState({ user, uid });
    } else if (uid) {
      firebase
        .firestore()
        .collection(global.domain)
        .doc("user")
        .collection("registered")
        .doc(uid)
        .get()
        .then(snapshot => {
          const data = snapshot.data();
          this.props.navigation.setParams({ uid: uid, user: data })
          this.setState({ user: data });
        });
    }

  }

  _renderProfilePic = () => {
    const width = 180;
    const containerHeight = 200;
    const photoURL = this.state.user.photoURL;
    if (photoURL) {
      return (
        <View style={{ height: containerHeight }}>
          <View style={{ height: containerHeight / 2, backgroundColor: "grey" }}>
            <Image
              style={{
                backgroundColor: "white",
                width: "100%",
                height: containerHeight / 2,
                // margin: 12,
                // borderRadius: width / 2,
                // borderWidth: 5,
                // borderColor: "lightgray",
                // justifyContent: "center",
                // alignItems: "center",
              }}
              resizeMode="center"
              source={require('../../../images/safeguarding.png')}
            />
          </View>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <Image
              style={{
                backgroundColor: "white",
                width: width,
                height: width,
                // margin: 12,
                borderRadius: width / 2,
                borderWidth: 5,
                borderColor: "lightgray",
                // justifyContent: "center",
                // alignItems: "center",
              }}
              source={{ uri: photoURL }}
            />
          </View>
        </View>
      )
    }

  }
  render() {
    return (
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


        <View style={styles.titleContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            Display Name:
            </Text>
          <Text style={styles.sectionContentText} numberOfLines={1}>
            {this.state.user.displayName}
          </Text>
        </View>



        <View style={[styles.titleContainer, { flexDirection: "row" }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText} numberOfLines={1}>
              First Name:
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {this.state.user.firstName}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.nameText} numberOfLines={1}>
              Last Name:
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {this.state.user.lastName}
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
