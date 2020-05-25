import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, AsyncStorage } from "react-native";
import { Updates } from "expo";
import Analytics from "../../lib/analytics";
import { connect } from "react-redux";
import { setAdminPass } from "../../store/auth";
import { Input } from "react-native-elements";
import I18n from "../../lib/i18n";
import { Text } from "native-base";

class adminPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminPassword: "enter password",
      adminPasswordCorrect: "",
      restartMessage: "",
    };
  }

  componentDidMount() {
    Analytics.track("Admin Password");
    this._retrieveAdminPassword();
  }

  _retrieveAdminPassword = async () => {
    try {
      const value = this.props.auth.adminPassword;
      if (value !== null) {
        if (value == "cookies") {
          this.setState({ adminPasswordCorrect: "Password Correct!" });
        }
        this.setState({ adminPassword: value });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _setAdminPassword(adminPassword) {
    this.setState({ adminPassword: adminPassword });
    if (adminPassword == "cookies") {
      this.setState({ adminPasswordCorrect: "Password Correct!" });
      this.setState({ restartMessage: "Click to Restart in Admin Mode" });
      Analytics.track("Admin Password", { entered: "Correct" });

      global.adminPassword = adminPassword;

      this.props.dispatch(setAdminPass(adminPassword));
    } else {
      this.setState({ adminPasswordCorrect: "" });
    }
  }
  _saveButton() {
    if (this.state.adminPassword == "cookies") {
      return (
        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity={0.5} onPress={() => Updates.reloadFromCache()}>
          <Text style={styles.TextStyle}>{I18n.t("save")}</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Input
          style={styles.passwordField}
          onChangeText={(text) => this._setAdminPassword(text)}
          placeholder={I18n.t("password")}
          containerStyle={styles.containerStyle}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          autoCapitalize="none"
          autoFocus={true}
        />

        <View style={{ flexDirection: "column", alignItems: "center", marginTop: 12 }}>{this._saveButton()}</View>
      </View>
    );
  }
  toggleAuthView() {
    this.setState({ toggleAuthView: !this.state.toggleAuthView });
  }
  onValueChange(value) {
    this.setState({ switchValue: value });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    padding: 10,
  },
  title: {
    paddingBottom: 16,
  },
  alert: {
    paddingTop: 16,
    color: "green",
  },
  alertRestart: {
    paddingTop: 16,
    color: "red",
  },
  passwordField: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
  },
  containerStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d2d2d2",
    backgroundColor: "#ffffff",
    marginVertical: 8,
  },
  SubmitButtonStyle: {
    backgroundColor: "#fff",
    height: 50,
    width: 250,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 4,
    marginBottom: 30,
  },
  TextStyle: {
    color: "green",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(adminPassword);
