import React, { Component } from "react";
import { View, ImageBackground, Text, TextInput, TouchableOpacity, Switch, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert } from "react-native";
import { Input } from "react-native-elements";
import { Container, Content } from "native-base";
import styles from "./styles";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import * as firebase from "firebase";
import DatePicker from "react-native-datepicker";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "uuid";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { AntDesign } from "@expo/vector-icons";
import systemHero from "../../lib/systemHero";
import { connect } from "react-redux";

class FormAdvanced extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifyMeSwitch: false,
      visible: props.edit ? props.visible : true,
      visibleMore: props.edit ? props.visibleMore : true,
      location: props.edit && props.location !== undefined ? props.location : null,
      eventDate: props.date_start,
      eventStartTime: props.time_start_pretty,
      eventEndTime: props.time_end_pretty,
      order: props.edit ? props.order : 1,
      _key: props.edit ? props._key : "",
    };

    this.props.navigation.setParams({
      save: () => this.state,
    });
  }

  clearDates() {
    console.log("Clear dates");
    this.setState({ eventDate: null });
    this.setState({ eventStartTime: null });
    this.setState({ eventEndTime: null });
  }

  static navigationOptions = ({ navigation }) => ({
    //  tabBarLabel: "Content",
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Entypo name="chevron-left" style={styles.chatHeadingLeft} />
      </TouchableOpacity>
    ),

    headerTitle: I18n.t("edit"),

    headerRight: (
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        {navigation.state.params && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Confirm Delete Story",
                navigation.state.params.summary + "?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      const _key = navigation.state.params._key;

                      if (_key) {
                        firebase
                          .firestore()
                          .collection(global.domain)
                          .doc("feature")
                          .collection("features")
                          .doc(_key)
                          .delete()
                          .then(() => navigation.popToTop());
                      }
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
            style={{ marginRight: 12 }}
          >
            <AntDesign name="delete" size={24} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            const { routes } = navigation.state;
            let saveState = {};

            if (_.has(routes[0], "params.save")) {
              const pageState = routes[0].params.save() || {};
              saveState = { ...saveState, ...pageState };
            }

            if (_.has(routes[1], "params.save")) {
              const pageState = routes[1].params.save() || {};
              saveState = { ...saveState, ...pageState };
            }

            const { eventTitle, visible, visibleMore, eventDescription, photo1, eventDate, eventStartTime, eventEndTime, order, _key, showIconChat, showIconShare } = saveState;

            const storyDict = {
              summary: eventTitle,
              visible: visible || true,
              visibleMore: visibleMore || true,
              description: eventDescription,
              photo1: photo1,
              date_start: eventDate !== undefined ? eventDate : null,
              time_start_pretty: eventStartTime !== undefined ? eventStartTime : null,
              time_end_pretty: eventEndTime !== undefined ? eventEndTime : null,
              order: order !== undefined ? Number(order) : 1,
              showIconChat,
              showIconShare,
            };

            if (_key == "") {
              firebase
                .firestore()
                .collection(global.domain)
                .doc("feature")
                .collection("features")
                .add(storyDict)
                .then(() => navigation.goBack());
            } else {
              const storyRef = firebase.firestore().collection(global.domain).doc("feature").collection("features").doc(_key);

              storyRef.set(storyDict, { merge: true }).then(() => navigation.popToTop());

              systemHero.logToCalendar("StorySave-" + global.domain + eventTitle, "Story Save - " + eventTitle, global.domain, this.props.auth.userInfo.email || "");
            }
          }}
        >
          <Text style={[styles.chatHeading]}>{I18n.t("save")}</Text>
        </TouchableOpacity>
      </View>
    ),
  });

  render() {
    const { navigation } = this.props;
    const summary = this.props.summary;
    const order = _.isNumber(this.state.order) ? this.state.order.toString() : 0;
    return (
      <View style={styles.containerSettings}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingTop: 20,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <View style={styles.settingsItem}>
              {/* {icon} */}
              <View style={styles.settingsLeft}>
                <View>
                  <Text>Order on Page</Text>
                </View>

                <View>
                  <Input
                    onChangeText={(text) => this.setState({ order: text })}
                    placeholder="0"
                    style={styles.eventTitle}
                    value={order}
                    keyboardType="number-pad"
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    containerStyle={styles.containerStyleOrder}
                  />
                </View>
              </View>
            </View>

            <View style={styles.settingsItem}>
              {/* {icon} */}
              <View style={styles.settingsLeft}>
                <View>
                  <Text>Home Screen</Text>
                </View>

                <View>
                  <Switch onValueChange={(value) => this.setState({ visible: value })} style={styles.switch} value={this.state.visible} />
                </View>
              </View>
            </View>

            <View style={styles.settingsItem}>
              {/* {icon} */}
              <View style={styles.settingsLeft}>
                <View>
                  <Text>More Screen</Text>
                </View>

                <View>
                  <Switch onValueChange={(value) => this.setState({ visibleMore: value })} style={styles.switch} value={this.state.visibleMore} />
                </View>
              </View>
            </View>
            <Text style={styles.eventTitle}>Dates:</Text>
            <View style={styles.settingsItemNoLine}>
              <View style={styles.settingsLeft}>
                <View>
                  <Text>Date (optional)</Text>
                </View>

                <View>
                  <DatePicker
                    style={styles.containerStyleDate}
                    customStyles={{ dateInput: { borderWidth: 0 } }}
                    date={this.state.eventDate}
                    mode="date"
                    placeholder="Event Date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={(date) => {
                      this.setState({ eventDate: date });
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.settingsItemNoLine}>
              <View style={styles.settingsLeft}>
                <View>
                  <Text>Time Start</Text>
                </View>

                <View>
                  <DatePicker
                    style={styles.containerStyleDate}
                    customStyles={{ dateInput: { borderWidth: 0 } }}
                    date={this.state.eventStartTime}
                    placeholder="Start Time"
                    mode="time"
                    format="HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    minuteInterval={10}
                    onDateChange={(time) => {
                      this.setState({ eventStartTime: time });
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.settingsItemNoLine}>
              <View style={styles.settingsLeft}>
                <View>
                  <Text>Time End</Text>
                </View>

                <View>
                  <DatePicker
                    style={styles.containerStyleDate}
                    customStyles={{ dateInput: { borderWidth: 0 } }}
                    date={this.state.eventEndTime}
                    placeholder="End Time"
                    mode="time"
                    format="HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    minuteInterval={10}
                    onDateChange={(time) => {
                      this.setState({ eventEndTime: time });
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.settingsItemNoLine}>
              <View style={styles.settingsLeft}>
                <View>
                  <Text></Text>
                </View>

                <View>
                  <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.clearDates()}>
                    <Text>Clear Dates</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* <Button onPress={() => navigation.navigate("Home")} title="Go to home tab" />
            <Button onPress={() => navigation.goBack(null)} title="Go back" /> */}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(FormAdvanced);
