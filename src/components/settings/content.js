import React, { Component } from "react";
import { StyleSheet, View,  TouchableHighlight } from "react-native";
import I18n from "../../lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import FeatureMoreItems from "./FeatureMoreItems";
import { connect } from 'react-redux';

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      language: "",
      features: global.moreFeatures || []
    };
  }

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
        {(global.administrator || this.props.auth.isAdmin) && (
          <TouchableHighlight
            style={styles.adminButton}
            underlayColor="#ff7043"
            onPress={() => this.props.navigation.navigate("moreAdmin", { moreFeatures: this.state.features })}>
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

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Content);


const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30
  },
  imageStyleCheckOn: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    width: 30,
    fontSize: 30,
    color: "#007AFF"
  },
  imageStyleCheckOff: {
    marginLeft: 15,
    alignSelf: "center",
    height: 30,
    fontSize: 30,
    width: 30,
    color: "#FFF"
  },

  titleInfoStyle: {
    fontSize: 16,
    color: "#8e8e93"
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
      width: 0
    },
    zIndex: 1
  }
});
