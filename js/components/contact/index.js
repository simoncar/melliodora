import React, { Component } from "react";
import { View, Linking, TouchableHighlight } from "react-native";
import * as firebase from "firebase";
import { Content, Text, Button } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Communications from "react-native-communications";
import updateFirebase from "./../../lib/updateFirebase";
import styles from "./styles";
import Analytics from "../../lib/analytics";
import { connect } from "react-redux";

const contactIconType = {
  call: "ios-call",
  mail: "ios-mail",
  location: "ios-pin",
};

class Anchor extends React.Component {
  _handlePress = () => {
    Linking.openURL(this.props.href);
    this.props.onPress && this.props.onPress();
  };

  render() {
    return (
      <Text style={styles.feedbackHead} onPress={this._handlePress}>
        {this.props.title}
      </Text>
    );
  }
}

class Contact extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerBackTitle: null,
    title: "Contacts",
  });

  constructor(props) {
    super(props);
    this.state = {
      offset: {
        x: 0,
        y: 0,
      },
      updateFirebaseText: "",
      contactInfo: [],
    };
  }

  componentDidMount() {
    this._retrieveContactInfo();
    this.willFocusSubscription = this.props.navigation.addListener("willFocus", () => {
      this._retrieveContactInfo();
    });
    Analytics.track("Contact");
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  _call() {
    //TODO: only show email/phone links when there are values
    Communications.phonecall(global.switch_call, true);
  }

  _email(email) {
    //TODO: only show email/phone links when there are values
    Communications.email(email, null, null, null, null);
  }

  _emailComms() {
    //TODO: only show email/phone links when there are values
    Communications.email(global.switch_helpEmail, null, null, null, null);
  }

  _retrieveContactInfo = () => {
    try {
      console.log("stated _retrieveContactInfo");
      firebase
        .firestore()
        .collection(global.domain)
        .doc("config")
        .get()
        .then((doc) => {
          if (doc.exists) {
            const docData = doc.data();
            if (docData.contacts) this.setState({ contactInfo: docData.contacts });
          } else {
            console.log("No such contacts config");
          }
        });
    } catch (error) {
      // Error retrieving data
    }
  };

  _updateFirebase() {
    updateFirebase();
    this.setState({ updateFirebaseText: "Another golf day booked!" });
  }

  _renderSubTexts = (subTexts) => {
    if (!subTexts) return;
    return subTexts.map((subitem) => <Text style={styles.feedbackHead}>{subitem}</Text>);
  };

  _contactBtnAction = (item) => {
    if (item.type == "call" && item.phoneNumber) {
      return () => Communications.phonecall(item.phoneNumber, true);
    }

    if (item.type == "mail" && item.email) {
      return () => Communications.email([item.email], null, null, null, null);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {(global.administrator || this.props.auth.isAdmin) && (
          <TouchableHighlight
            style={styles.adminButton}
            underlayColor="#ff7043"
            onPress={() => this.props.navigation.navigate("contactAdmin", { contactInfo: this.state.contactInfo })}>
            <MaterialIcons name="edit" style={{ fontSize: 25, color: "white" }} />
          </TouchableHighlight>
        )}

        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.contentIconsContainer}>
            <Grid>
              {this.state.contactInfo.map((item, idx) => {
                return (
                  <Row style={{ paddingTop: 20 }} key={idx}>
                    <Col style={{ width: 80 }}>
                      <Button transparent style={styles.roundedButton} onPress={this._contactBtnAction(item)}>
                        <Ionicons name={contactIconType[item.type]} size={30} color="#FFF" />
                      </Button>
                    </Col>
                    <Col>
                      <Text style={styles.feedbackHeader}>{item.headerText}</Text>
                      <Text style={styles.feedbackHead}>
                        {typeof item.headerSubTexts == "object" ? item.headerSubTexts.join("\n") : item.headerSubTexts}
                      </Text>
                      {item.email ? <Anchor href={"mailto:" + item.email} title={item.email} /> : null}
                    </Col>
                  </Row>
                );
              })}
            </Grid>
          </View>
        </Content>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Contact);
