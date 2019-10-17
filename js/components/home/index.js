import React, { Component } from "react";
import {
  FlatList,
  View,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Image,
} from "react-native";
import { Container, Content, Text } from "native-base";
import Constants from "expo-constants";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { getLanguageString } from "../global";
import I18n from "../../lib/i18n";
import styles from "./styles";
import ListItem from "./ListItem";

const { width } = Dimensions.get("window");
const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

const bottomLogo = {
  sais_edu_sg: require("../../../images/sais_edu_sg/10yearLogo.png"),
  ais_edu_sg: require("../../../images/ais_edu_sg/10yearLogo.png"),
};

class HomeNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      featureItems: [],
    };

    this.loadFromAsyncStorage();
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let title = "";
    if (params.domain) title = params.domain["name"];
    return {
      title: title,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      tabBarColor: "#111B4E",
      tabBarIcon: tabBarIcon("home"),
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
              marginRight: 10,
            }}
          >
            <Ionicons
              name="md-search"
              style={{
                color: "#48484A",
                fontSize: 25,
                marginRight: 10,
              }}
            />
          </View>
        </TouchableOpacity>
      ),
    };
  };

  componentWillMount() {
    this.ref = firebase
      .firestore()
      .collection(global.domain)
      .doc("feature")
      .collection("features")
      .orderBy("order");
  }

  componentDidMount() {
    try {
      // TODO: isOnline.
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    } catch (e) {
      //console.error(e.message);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = querySnapshot => {
    var trans = {};
    var featureItems = [];

    querySnapshot.forEach(doc => {
      if (doc.data().translated == true) {
        trans = {
          source: "feature",
          summaryMyLanguage: getLanguageString(global.language, doc.data(), "summary"),
          descriptionMyLanguage: getLanguageString(global.language, doc.data(), "description"),
        };
      } else {
        trans = {
          source: "feature",
          summaryMyLanguage: doc.data().summary,
          descriptionMyLanguage: doc.data().description,
        };
      }

      if (!doc.data().visible == false) {
        featureItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
      }

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

  loadFromAsyncStorage() {
    AsyncStorage.multiGet(["featureItems", "domain"], (err, stores) => {
      const featureItems = JSON.parse(stores[0][1]);
      const domain = JSON.parse(stores[1][1]);
      console.log("domain", domain);

      this.props.navigation.setParams({
        domain,
      });
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
          <View style={styles.newsContentLine}>
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
              source={bottomLogo[global.domain] || { uri: global.switch_homeLogoURI }}
            />
          </View>

          <View
            style={{
              marginTop: 100,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this._handleOpenWithLinking("https://smartcookies.io/smart-community");
              }}
              style={{
                width: 40,
                height: 40,
              }}
            >
              <Image source={require("../../../images/sais_edu_sg/SCLogo.png")} style={styles.sclogo} />
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
