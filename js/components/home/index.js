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
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";
import { getLanguageString } from "../global";
import I18n from "../../lib/i18n";
import styles from "./styles";
import ListItem from "./ListItem";

const { width } = Dimensions.get("window");
const tabBarIcon = name => ({ tintColor }) => (
  <MaterialIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />
);

class HomeNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      featureItems: [],
    };

    this.loadFromAsyncStorage();
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
  });

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

  componentWillUnmount() { }

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

      if (global.administrator != true && doc.data().visible == false) {
        //skip item
      } else {
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
    this.unsubscribe();
  };

  _handleOpenWithLinking = sURL => {
    Linking.openURL(sURL);
  };

  keyExtractor = item => item._key;

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

          <Image source={require("../../../images/sais.edu.sg/10yearLogo.png")} style={styles.tenYearLogo} />

          <TouchableOpacity
            onPress={() => {
              this._handleOpenWithLinking("https://www.smartcookies.io/stamford-app-faqs");
            }}
          >
            <Image source={require("../../../images/sais.edu.sg/SCLogo.png")} style={styles.sclogo} />
          </TouchableOpacity>

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
