import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TouchableHighlight } from 'react-native';
import firebase from "firebase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import { connect } from 'react-redux';

class UserProfile extends Component {
  static navigationOptions = ({ navigation }) => ({
    // title: I18n.t("Edit", { defaultValue: "Edit" }),
    title: "User Profile",
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
  componentDidMount() {
    const { uid, user } = this.props.navigation.state.params;

    this.showChat = uid != global.uid;
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

          if (!snapshot.exists) {
            return this.props.navigation.push("EditUserProfile", { ...this.props.navigation.state.params })
          }
          const data = snapshot.data();
          this.props.navigation.setParams({ uid: uid, user: data })
          this.setState({ user: data });
        });
    }

  }

  _renderProfilePic = () => {
    const width = 128;
    const containerHeight = 150;
    const photoURL = this.state.user.photoURL;

    return (
      <View style={{ height: containerHeight }}>
        {/* <View style={{ height: containerHeight / 2, backgroundColor: "grey" }}>
          <Image
            style={{
              backgroundColor: "white",
              width: "100%",
              height: containerHeight / 2
            }}
            resizeMode="center"
            source={require('../../../images/safeguarding.png')}
          />
        </View> */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 2, backgroundColor: "#fdfdfd" }}>
          {
            photoURL ?
              <Image
                style={{
                  width: width,
                  height: width,
                  borderRadius: width / 2,
                  borderWidth: 5,
                  borderColor: "lightgray"
                }}
                source={{ uri: photoURL }}
              /> :
              <Ionicons
                name="ios-person"
                size={width * 0.85}
                color="grey"
                style={{
                  width: width,
                  height: width,
                  borderRadius: width / 2,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: "lightgray",
                  color: "#0075b7",
                  textAlign: "center",
                }}
              />
          }
        </View>
      </View>
    )
  }

  privateMessageUser = async (targetUID, sourcUID, targetName) => {

    //only for new chat
    const dict = {
      type: "private",
      title: targetName,
      createdTimeStamp: firebase.firestore.Timestamp.now()
    };


    // const data = [];

    let docID = "";
    if (targetUID < sourcUID) {
      docID = targetUID + "_" + sourcUID
      dict["members"] = [targetUID, sourcUID]
    } else {
      docID = sourcUID + "_" + targetUID
      dict["members"] = [sourcUID, targetUID]
    }

    const navParams = {
      chatroom: docID,
      type: "private"
    }

    console.log("dict", dict);
    const communityDomain = this.props.community.selectedCommunity.node;
    const querySnapshot = await firebase
      .firestore()
      .collection(communityDomain)
      .doc("chat")
      .collection("chatrooms")
      .doc(docID)
      .get();

    if (!querySnapshot.exists) {
      navParams["title"] = dict.title;
      await firebase
        .firestore()
        .collection(communityDomain)
        .doc("chat")
        .collection("chatrooms")
        .doc(docID)
        .set(dict, { merge: true });
    }

    this.setState({ modalVisible: false })
    this.props.navigation.pop();
    this.props.navigation.navigate("chat", navParams);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView ScrollView bounces={false}>

          {this._renderProfilePic()}
          {
            this.showChat ?
              <View style={[styles.titleContainer, { flexDirection: "row", justifyContent: "center" }]}>

                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}

                  onPress={() => {
                    this.privateMessageUser(this.state.user.uid, global.uid, this.state.user.displayName || this.state.user.firstName + " " + this.state.user.lastName)
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#4CAF50",
                      height: 50,
                      width: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: 50 / 2,
                      shadowColor: "#000000",
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      shadowOffset: {
                        height: 1,
                        width: 1,
                      }
                    }}
                  >
                    <MaterialIcons name="message" size={25} color={"white"} />
                  </View>
                  <Text style={{
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: 12,
                    marginTop: 4,
                    color: "#808080"
                  }}>
                    Private{"\n"}Message
              </Text>
                </TouchableOpacity>

              </View>
              : null
          }

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


          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              Country:
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {this.state.user.country}
            </Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              Region:
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {this.state.user.region}
            </Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              Organization:
            </Text>
            <Text style={styles.sectionContentText} numberOfLines={1}>
              {this.state.user.organization}
            </Text>
          </View>



          <View style={styles.titleContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              Interest Group(s):
            </Text>

            {

              (Array.isArray(this.state.user.interestGroups) && this.state.user.interestGroups.length) ?
                this.state.user.interestGroups.map(grp => (
                  <Text style={styles.sectionContentText} numberOfLines={1} key={grp}>
                    {grp}
                  </Text>
                ))
                : (
                  <Text style={styles.sectionContentText} numberOfLines={1}>
                    None
                  </Text>
                )
            }
          </View>

        </ScrollView>
      </SafeAreaView>
    )
  }
}
const mapStateToProps = state => ({
  community: state.community
});
export default connect(mapStateToProps)(UserProfile);

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
