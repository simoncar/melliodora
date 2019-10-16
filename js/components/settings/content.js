import React, { Component } from "react";
import { Image, StyleSheet, View, Alert, AsyncStorage, TouchableHighlight } from "react-native";
import { isAdmin } from "../global";
import I18n from "../../lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Updates } from "expo";
import FeatureMoreItems from "./FeatureMoreItems";
import Constants from "expo-constants";

const icons = {
  wifi: require("./images/wifi.png"),
  contact: require("./images/contact.png"),
  library: require("./images/library.png"),
  map: require("./images/map.png"),
  shop: require("./images/shop.png"),
};

export default class Content extends Component {
  static navigationOptions = {
    title: I18n.t("editor"),
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 28,
    },
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      language: "",
      features: global.moreFeatures || [],
    };
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  _getStyle(language) {
    if (language == this.state.language) {
      return styles.imageStyleCheckOn;
    } else {
      return styles.imageStyleCheckOff;
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: "#EFEFF4", flex: 1 }}>
        {global.administrator && (
          <TouchableHighlight
            style={styles.adminButton}
            underlayColor="#ff7043"
            onPress={() => this.props.navigation.navigate("moreAdmin", { moreFeatures: this.state.features })}
          >
            <MaterialIcons name="edit" style={{ fontSize: 25, color: "white" }} />
          </TouchableHighlight>
        )}

        <View style={{ backgroundColor: "#EFEFF4" }}>
          <FeatureMoreItems navigation={this.props.navigation} show="all" editMode />
        </View>
      </View>
    );
  }
  toggleAuthView() {
    this.setState({ toggleAuthView: !this.state.toggleAuthView });
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
  },
  imageStyleCheckOn: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
    fontSize: 30,
    color: "#007AFF",
  },
  imageStyleCheckOff: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    fontSize: 30,
    width: 30,
    color: "#FFF",
  },

  titleInfoStyle: {
    fontSize: 16,
    color: "#8e8e93",
  },
  adminButton: {
    backgroundColor: "#ff5722",
    borderColor: "#ff5722",
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    zIndex: 1,
  },
});
