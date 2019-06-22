import React, { Component } from "react";
import { TextInput, View, Switch, Platform } from "react-native";

import { Container, Content, Text, Item } from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import { Ionicons } from "@expo/vector-icons";
import HeaderContent from "./../headerContent/header/";
import { AsyncStorage } from "react-native";
import styles from "./styles";

const primary = require("../../themes/variable").brandPrimary;

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: "",
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("password")
      .then(value => {
        this.setState({ password: value });
      })
      .done();
  }

  setPassword = value => {
    AsyncStorage.setItem("password", value);
    this.setState({ password: value });
  };

  _placeHolderAdminPassword() {
    if (
      undefined !== this.props.adminPassword &&
      this.props.adminPassword !== null &&
      this.props.adminPassword.length > 0
    ) {
      //return this.props.adminPassword;
    }
    return "Enter Admin Password";
  }

  render() {
    return (
      <Container>
        <HeaderContent navigation={this.props.navigation} />

        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.bg}>
            <Text style={styles.signupHeader}>SETTINGS</Text>
          </View>
          <View style={styles.notificationSwitchContainer}>
            <Text style={styles.notificationHeader}>ADMIN PASSWORD</Text>
            <Item rounded style={styles.inputGrp}>
              <Ionicons name="ios-lock" />
              <TextInput
                ref="AdminPassword"
                onChangeText={text => this.setPassword(text)}
                placeholderTextColor="#FFF"
                style={styles.input}
                autoCapitalize="none"
                autoFocus
                selectionColor="#FFF"
                defaultValue={this.state.password}
              />
            </Item>
          </View>

          <View style={styles.notificationSwitchContainer}>
            <Text style={styles.notificationHeader}>
              EVENTS I WANT TO FOLLOW
            </Text>
            <View>
              <Grid style={{ marginBottom: 10 }}>
                <Col>
                  <Text
                    style={
                      Platform.OS === "android"
                        ? styles.aswitchText
                        : styles.switchText
                    }
                  >
                    Show A/B Days
                  </Text>
                </Col>
                <Col
                  style={
                    Platform.OS === "android"
                      ? styles.aswitchContainer
                      : styles.switchContainer
                  }
                >
                  <Switch
                    onValueChange={value =>
                      this.setState({ earlyyearsSwitch: value })
                    }
                    style={styles.switch}
                    value={this.state.earlyyearsSwitch}
                  />
                </Col>
              </Grid>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Settings;
