import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Image,
  FlatList,
  View,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  AsyncStorage,
} from "react-native";
import { Container, Content, Text, Icon, Button } from "native-base";
import { Notifications } from "expo";
import Constants from "expo-constants";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import moment from "moment";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";
import { isAdmin } from "../global";
import BLEDataParser from "../../lib/BLEDataParser";
import CountDown from "react-native-countdown-component";
import * as ActionCreators from "../../actions";
import { openDrawer } from "../../actions/drawer";
import I18n from "../../lib/i18n";
import styles from "./styles";

const { width } = Dimensions.get("window");
const ListItem = require("./ListItem");
const instID = Constants.manifest.extra.instance;

// Get the token that uniquely identifies this device
if (!Constants.isDevice) {
  var token = "ExponentPushToken[YQNwZDOkv0QdHUlDV-T5HQ]"; // override simulator with simon's iphone
} else {
  var token = Notifications.getExpoPushTokenAsync();
}

const today = new moment().format();

const parsedRawData = new BLEDataParser("03039FFE17169FFE0256596E48415957727242510000016B91E7901F");

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

class HomeNav extends Component {
  constructor(props) {
    super(props);
    try {
    } catch (e) {
      console.error(e.message);
    }

    this.state = {
      user: null,
      loading: false,
      featureItems: [],
    };

    this.loadFromAsyncStorage();

    //this.loadFromRedux();
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Stamford",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 28,
    },
    tabBarColor: "#111B4E",
    tabBarIcon: tabBarIcon("home"),
    headerBackTitle: null,
    headerRight: <BorderlessButton onPress={() => navigation.navigate("Search")} style={{ marginRight: 15 }} />,
  });

  componentWillMount() {
    this.ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("feature")
      .collection("feature articles");
  }

  componentDidMount() {
    try {
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    } catch (e) {
      //console.error(e.message);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = querySnapshot => {
    const featureItems = [];
    querySnapshot.forEach(doc => {
      const {
        summary,
        description,
        location,
        date_start,
        time_start_pretty,
        time_end_pretty,
        photo1,
        visible,
      } = doc.data();

      featureItems.push({
        key: doc.id,
        _key: doc.id,
        //doc, // DocumentSnapshot
        title: summary,
        description,
        location,
        eventDate: date_start,
        eventStartTime: time_start_pretty,
        eventEndTime: time_end_pretty,
        photo1,
        visible,
      });
    });

    if (featureItems.length > 0) {
      this._storeData(JSON.stringify(featureItems));
      this.setState({
        featureItems,
      });
    }

    this.setState({
      loading: false,
    });
  };

  _handleOpenWithLinking = sURL => {
    Linking.openURL(sURL);
  };

  keyExtractor = item => item._key;

  getSeconds() {
    var startDate = new Date();
    // Do your operations
    var endDate = new Date("13 Aug 2019 08:30");
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

    return seconds;
  }

  loadFromAsyncStorage() {
    AsyncStorage.getItem("featureItems").then(fi => {
      var featureItems = JSON.parse(fi);
      this.setState({
        featureItems,
        loading: false,
      });
    });
  }

  _storeData = async featureItems => {
    try {
      AsyncStorage.setItem("featureItems", featureItems);
    } catch (error) {
      console.log(error);
      // Error saving data
    }
  };

  _renderItem(item) {
    return <ListItem navigation={this.props.navigation} item={item} />;
  }

  render() {
    if (this.state.loading) {
      return null; // or render a loading icon
    }

    return (
      <Container style={styles.container}>
        {isAdmin(this.props.adminPassword) && (
          <TouchableHighlight
            style={styles.addButton}
            underlayColor="#ff7043"
            onPress={() => this.props.navigation.navigate("storyForm")}
          >
            <Text style={{ fontSize: 25, color: "white" }}>+</Text>
          </TouchableHighlight>
        )}

        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.newsContentLine}>
            <Text style={styles.version}>{I18n.t("schoolStarts")}</Text>
            <CountDown until={this.getSeconds()} size={20} />

            {isAdmin(this.props.adminPassword) && (
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  this.props.navigation.navigate("AttendanceOverviewScreen");
                }}
              >
                <View>
                  <View
                    style={{
                      height: 60,
                      backgroundColor: "white",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: 36,
                        height: 36,
                        margin: 12,
                        borderRadius: 18,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: "lightgray",
                      }}
                      source={{
                        uri: "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-06-14.54.37.png",
                      }}
                    />
                    <Text style={styles.itemTitle}>{I18n.t("safeguarding")}</Text>
                  </View>
                  <View>
                    <Image
                      source={{
                        uri: "https://saispta.com/wp-content/uploads/2019/05/Screenshot-2019-05-21-11.40.14.png",
                      }}
                      style={{ width, height: 200 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <FlatList
              data={this.state.featureItems}
              keyExtractor={this.keyExtractor}
              renderItem={this._renderItem.bind(this)}
            />
          </View>

          <View>
            <View
              style={{
                height: 60,
                backgroundColor: "white",
                flexDirection: "row",
              }}
            />
          </View>

          <View>
            <Text style={styles.version} />
            <Text style={styles.version} />

            <Text style={styles.version} />
          </View>
          <Image source={require("../../../images/sais.edu.sg/10yearLogo.png")} style={styles.tenYearLogo} />

          <TouchableOpacity
            onPress={() => {
              this._handleOpenWithLinking("https://smartcookies.io");
            }}
          >
            <Image source={require("../../../images/sais.edu.sg/SCLogo.png")} style={styles.sclogo} />
          </TouchableOpacity>

          <View>
            <Text style={styles.version} />
            <Text style={styles.version}>Version: {Constants.manifest.revisionId}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  ////navigation: state.cardNavigation,
  userX: state.user,
  adminPassword: state.user.adminPassword,
  ffauth_device_idX: state.ffauth_device_id,
  ffauth_secretX: state.ffauth_secret,
  calendarEventsX: state.user,
  language: state.user.language,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeNav);
