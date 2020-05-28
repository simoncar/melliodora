


import { View, ImageBackground, Text, TextInput, TouchableOpacity, Switch, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert } from "react-native";
import { Input } from "react-native-elements";
import { Container, Content } from "native-base";
import styles from "./styles";
import { withMappedNavigationParams } from "react-navigation-props-mapper";
import * as firebase from "firebase";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "uuid";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { AntDesign } from "@expo/vector-icons";
import { logToCalendar } from "../../lib/systemHero";
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

              logToCalendar("StorySave-" + global.domain + eventTitle, "Story Save - " + eventTitle, global.domain, this.props.auth.userInfo.email || "");
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
