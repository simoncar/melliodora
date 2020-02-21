import React, { Component } from "react";
import {
  FlatList,
  View,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Image
} from "react-native";
import { Container, Content, Text } from "native-base";
import Constants from "expo-constants";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { getLanguageString } from "../global";
import I18n from "../../lib/i18n";
import styles from "./styles";
import ListItem from "./ListItem";
import Analytics from "../../lib/analytics";
import { ScrollView } from "react-navigation";
import moment from "moment";

const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

const bottomLogo = {
  sais_edu_sg: require("../../../images/sais_edu_sg/10yearLogo.png"),
  ais_edu_sg: require("../../../images/ais_edu_sg/ifla-apr.jpeg")
};

class HomeNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      featureItems: [],
      calendarItems: [],
      balanceItems: []
    };

    this.loadFromAsyncStorage();
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let title = "";
    if (params.domain) title = params.domain["name"];

    let headerTitle = null;
    if (global.domain == "ais_edu_sg") {
      headerTitle = (
        <Image
          source={require("../../../images/ais_edu_sg/ifla-apr.jpeg")}
          style={{ height: 39, resizeMode: "contain" }}
        />
      );
    }
    return {
      title: title,
      headerTitle: headerTitle,
      headerBackTitle: null,

      headerRight: (
        <TouchableOpacity
          onPress={() => {
            navigation.push("searchCalendarHome");
          }}
        >
          <View
            style={{
              color: "#48484A",
              fontSize: 25,
              marginRight: 10
            }}
          >
            <Ionicons
              name="md-search"
              style={{
                color: "#48484A",
                fontSize: 25,
                marginRight: 10
              }}
            />
          </View>
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    this.feature = firebase
      .firestore()
      .collection(global.domain)
      .doc("feature")
      .collection("features")
      .orderBy("order");

    Analytics.track("Home");
    this.unsubscribeFeature = this.feature.onSnapshot(this.onFeatureUpdate);

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      console.log("home is focused");
      this.loadBalance();
      this.loadCalendar();
    });
  }

  componentWillUnmount() {
    this.unsubscribeFeature();
    this.focusListener.remove();
  }

  loadBalance() {
    var balanceItems = [];

    let balance = firebase
      .firestore()
      .collection(global.domain)
      .doc("user")
      .collection("usernames")
      .doc("Rh9hEJmOyLR12WfflrLCCvvpIWD2")
      .get()

      .then(snapshot => {
        if (!snapshot.exists) {
          return;
        }
        const data = snapshot.data();
        //.push({ campusBalance: data.campusBalance });

        var trans = {
          visible: true,
          source: "balance",
          summaryMyLanguage: "AAA",
          summary: data.campusBalance,
          summaryEN: "$" + data.campusBalance.toFixed(2),
          color: "red",
          showIconChat: false,
          location: "Cafeteria Account Balance"
        };

        console.log(data.guid); //DB:iSAMSparents:48879-2
        var familyId = data.guid.substring(
          data.guid.indexOf("iSAMSparents:") + 13,
          data.guid.indexOf("-")
        );

        console.log(familyId);

        balanceItems.push({ ...{ _key: snapshot.id }, ...data, ...trans });
        if (balanceItems.length > 0) {
          this.setState({
            balanceItems
          });
        }
      });

    // this.setState({
    //   loading: false
    // });
  }

  loadCalendar() {
    const todayDate = moment().format("YYYY-MM-DD");

    var calendarItems = [];
    let calendar = firebase
      .firestore()
      .collection(global.domain)
      .doc("calendar")
      .collection("calendarItems")
      // .orderBy("date_start");
      .where("date_start", "==", todayDate)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var trans = {
            visible: true,
            source: "calendar",
            summaryMyLanguage: getLanguageString(
              global.language,
              doc.data(),
              "summary"
            ),
            summary: doc.data().summary,
            summaryEN: doc.data().summary,
            date_start: doc.data().date_start,
            color: "red",
            showIconChat: false,
            descriptionMyLanguage: getLanguageString(
              global.language,
              doc.data(),
              "description"
            )
          };

          calendarItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
        });
        if (calendarItems.length > 0) {
          this.setState({
            calendarItems
          });
        }
        this.setState({
          loading: false
        });
      });
  }

  onFeatureUpdate = querySnapshot => {
    var featureItems = [];

    querySnapshot.forEach(doc => {
      var trans = {
        source: "feature",
        summaryMyLanguage: getLanguageString(
          global.language,
          doc.data(),
          "summary"
        ),
        descriptionMyLanguage: getLanguageString(
          global.language,
          doc.data(),
          "description"
        )
      };

      if (!doc.data().visible == false) {
        featureItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
      }
    });

    if (featureItems.length > 0) {
      this._storeData(JSON.stringify(featureItems));
      this.setState({
        featureItems
      });
    }

    this.setState({
      loading: false
    });
  };

  _handleOpenWithLinking = sURL => {
    Linking.openURL(sURL);
  };

  keyExtractor = item => item._key;

  loadFromAsyncStorage() {
    AsyncStorage.multiGet(["featureItems", "domain"], (err, stores) => {
      const featureItems = JSON.parse(stores[0][1]);
      const domain = JSON.parse(stores[1][1]);
      console.log("domain", domain);

      this.props.navigation.setParams({
        domain
      });
      this.setState({
        featureItems,
        loading: false
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
  _renderBalance() {
    return (
      <FlatList
        data={this.state.balanceItems}
        keyExtractor={this.keyExtractor}
        renderItem={this._renderItem.bind(this)}
      />
    );
  }

  env() {}

  render() {
    if (this.state.loading) {
      return null; // or render a loading icon
    }

    return (
      <Container>
        {global.administrator && (
          <TouchableHighlight
            style={styles.addButton}
            underlayColor="#ff7043"
            onPress={() => this.props.navigation.navigate("storyForm")}
          >
            <Text style={{ fontSize: 25, color: "white" }}>+</Text>
          </TouchableHighlight>
        )}
        <Content showsVerticalScrollIndicator={false}>
          {global.domain === "ais_edu_sg" ? (
            <View style={styles.newsContentLine}>
              <ScrollView
                horizontal={true}
                bounces={false}
                contentContainerStyle={{
                  paddingHorizontal: 12,
                  paddingVertical: 8
                }}
                style={{ backgroundColor: "white", marginVertical: 6 }}
                showsHorizontalScrollIndicator={false}
              >
                <TouchableOpacity
                  style={styles.homeMenuItemContainer}
                  onPress={() => {
                    this.props.navigation.navigate("webportalURL", {
                      url: "https://iflaapr.org/newsletters",
                      title: "Newsletters"
                    });
                  }}
                >
                  <Image
                    style={styles.homeMenuIcon}
                    source={require("../../../resources/icons/news.png")}
                  />
                  <Text style={{ color: "black", fontSize: 12 }}>
                    {I18n.t("Newsletters")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.homeMenuItemContainer}
                  onPress={() => {
                    this.props.navigation.navigate("webportalURL", {
                      url: "https://iflaapr.org/news/listing/design",
                      title: "Design News"
                    });
                  }}
                >
                  <Image
                    style={styles.homeMenuIcon}
                    source={require("../../../resources/icons/_Design.jpeg")}
                  />
                  <Text style={styles.homeMenuText}>
                    {I18n.t("Design") + "\n" + I18n.t("News")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.homeMenuItemContainer}
                  onPress={() => {
                    this.props.navigation.navigate("webportalURL", {
                      url: "https://iflaapr.org/news/listing/management",
                      title: "Management News"
                    });
                  }}
                >
                  <Image
                    style={styles.homeMenuIcon}
                    source={require("../../../resources/icons/_Management.jpeg")}
                  />
                  <Text style={styles.homeMenuText}>
                    {I18n.t("Management") + "\n" + I18n.t("News")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.homeMenuItemContainer}
                  onPress={() => {
                    this.props.navigation.navigate("webportalURL", {
                      url: "https://iflaapr.org/news/listing/planning",
                      title: "Planning News"
                    });
                  }}
                >
                  <Image
                    style={styles.homeMenuIcon}
                    source={require("../../../resources/icons/_Planning.jpeg")}
                  />
                  <Text style={styles.homeMenuText}>
                    {I18n.t("Planning") + "\n" + I18n.t("News")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.homeMenuItemContainer}
                  onPress={() => {
                    this.props.navigation.navigate("webportalURL", {
                      url: "https://iflaapr.org/membership-directory/corporate",
                      title: "Directory"
                    });
                  }}
                >
                  <Image
                    style={styles.homeMenuIcon}
                    source={require("../../../resources/icons/_Directory.jpeg")}
                  />
                  <Text style={styles.homeMenuText}>{I18n.t("Directory")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.homeMenuItemContainer}
                  // onPress={() => {
                  //   this.props.navigation.navigate("webportalURL", {
                  //     url: "https://smartcookies.io/smart-community",
                  //     title: "Member Associations",
                  //   });
                  // }}
                >
                  <Image
                    style={styles.homeMenuIcon}
                    source={require("../../../resources/icons/_Associations.png")}
                  />
                  <Text style={styles.homeMenuText}>
                    {I18n.t("Member") + "\n" + I18n.t("Associations")}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.newsContentLine}>
            {this._renderBalance()}
            {global.domain !== "ais_edu_sg" ? (
              <FlatList
                data={this.state.calendarItems}
                keyExtractor={this.keyExtractor}
                renderItem={this._renderItem.bind(this)}
              />
            ) : null}

            <FlatList
              data={this.state.featureItems}
              keyExtractor={this.keyExtractor}
              renderItem={this._renderItem.bind(this)}
            />
          </View>
          <View
            style={{
              marginTop: 70,
              alignItems: "center",
              width: "100%"
            }}
          >
            <Image
              style={styles.tenYearLogo}
              source={
                bottomLogo[global.domain] || { uri: global.switch_homeLogoURI }
              }
            />
          </View>
          <View
            style={{
              marginTop: 100,
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this._handleOpenWithLinking(
                  "https://smartcookies.io/smart-community"
                );
              }}
              style={{
                width: 40,
                height: 40
              }}
            >
              <Image
                source={require("../../../images/sais_edu_sg/SCLogo.png")}
                style={styles.sclogo}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.version}>{Constants.manifest.revisionId}</Text>
            <Text style={styles.user}>{global.name}</Text>
            <Text style={styles.user}>{global.email}</Text>
            <Text style={styles.user}>{global.uid}</Text>
            <Text style={styles.user}>{global.language}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

export default HomeNav;
