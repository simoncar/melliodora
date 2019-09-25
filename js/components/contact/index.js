import React, { Component } from "react";
import { View, Linking, TouchableHighlight } from "react-native";
import * as firebase from "firebase";
import { Content, Text, Button } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Communications from "react-native-communications";
import updateFirebase from "./../../lib/updateFirebase";
import styles from "./styles";

const contactIconType = {
  call: "ios-call",
  mail: "ios-mail",
  location: "ios-pin"
}

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

export default class Contact extends Component {
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
      contactInfo: []
    };
  }

  componentWillMount() {
    this._retrieveContactInfo();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this._retrieveContactInfo();
      }
    );
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
      let data = []
      firebase
        .firestore()
        .collection(global.domain)
        .doc("config")
        .get()
        .then(doc => {
          if (doc.exists) {
            const docData = doc.data();
            this.setState({ contactInfo: docData.contacts });
          } else {
            console.log("No such contacts config");
          }

        });

    } catch (error) {
      // Error retrieving data
    }
  }

  _updateFirebase() {
    updateFirebase();
    this.setState({ updateFirebaseText: "Another golf day booked!" });
  }


  _renderSubTexts = (subTexts) => {
    if (!subTexts) return;
    return (subTexts.map(subitem =>
      <Text style={styles.feedbackHead}>{subitem}</Text>
    ));

  }

  _contactBtnAction = (item) => {

    if (item.type == "call" && item.phoneNumber) {
      return () => Communications.phonecall(item.phoneNumber, true)
    }

    if (item.type == "mail" && item.email) {
      return () => Communications.email([item.email], null, null, null, null)
    }
  }

  render() {
    return (
      <View style={styles.container}>

        {global.administrator && (
          <TouchableHighlight
            style={styles.adminButton}
            underlayColor="#ff7043"
            onPress={() => this.props.navigation.navigate("contactAdmin")}
          >
            <Text style={{ fontSize: 25, color: "white" }}>+</Text>
          </TouchableHighlight>
        )}

        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.contentIconsContainer}>
            <Grid>

              {
                this.state.contactInfo.map(item => {

                  return (
                    <Row style={{ paddingTop: 20 }}>
                      <Col style={{ width: 80 }}>
                        <Button transparent style={styles.roundedButton} onPress={this._contactBtnAction(item)}>
                          <Ionicons name={contactIconType[item.type]} size={30} color="#FFF" />

                        </Button>
                      </Col>
                      <Col>
                        <Text style={styles.feedbackHeader}>{item.headerText}</Text>
                        <Text style={styles.feedbackHead}>{typeof item.headerSubTexts == "object" ? item.headerSubTexts.join("\n") : item.headerSubTexts}</Text>
                        {
                          item.email &&
                          <Anchor href={"mailto:" + item.email} title={item.email} />
                        }
                      </Col>
                    </Row>

                  )
                })
              }

              {/*               
              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton} onPress={() => this._call()}>
                    <Ionicons name="ios-call" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>Call Parent Helpdesk</Text>
                  <Text style={styles.feedbackHead}>{global.switch_call}</Text>
                </Col>
              </Row>
              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button
                    transparent
                    style={styles.roundedButton}
                    onPress={() => this._email(global.switch_contactEmail)}
                  >
                    <Ionicons name="ios-mail" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>Email</Text>
                  <Text style={styles.feedbackHead} />
                  <Anchor href="mailto:help@sais.edu.sg" title={global.switch_contactEmail} />
                </Col>
              </Row>

              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton}>
                    <Ionicons name="ios-pin" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>Visit</Text>
                  <Text style={styles.feedbackHead}>{global.switch_address}</Text>
                </Col>
              </Row>

              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton}>
                    <Ionicons name="ios-mail" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>Early Years School Office</Text>
                  <Text style={styles.feedbackHead}>(Pre-N - KG1)</Text>
                  <Text style={styles.feedbackHead}>+65 6602 7258 </Text>
                  <Anchor href="mailto:earlyyears@sais.edu.sg" title="earlyyears@sais.edu.sg" />
                </Col>
              </Row>

              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton}>
                    <Ionicons name="ios-mail" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>Lower Elementary School Office</Text>
                  <Text style={styles.feedbackHead}>(KG2 - Grade 2)</Text>
                  <Text style={styles.feedbackHead}>+65 6602 4195</Text>
                  <Anchor href="mailto:lowerelementary@sais.edu.sg" title="lowerelementary@sais.edu.sg" />
                </Col>
              </Row>

              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton}>
                    <Ionicons name="ios-mail" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>Upper Elementary School Office</Text>
                  <Text style={styles.feedbackHead}>(Grade 3 - Grade 5)</Text>
                  <Text style={styles.feedbackHead}>+65 6709 4811 </Text>
                  <Anchor href="mailto:upperelementary@sais.edu.sg" title="upperelementary@sais.edu.sg" />
                </Col>
              </Row>

              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton}>
                    <Ionicons name="ios-mail" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>Middle School Office</Text>
                  <Anchor href="mailto:middleschool@sais.edu.sg" title="middleschool@sais.edu.sg" />
                </Col>
              </Row>

              <Row style={{ paddingTop: 20 }}>
                <Col style={{ width: 80 }}>
                  <Button transparent style={styles.roundedButton}>
                    <Ionicons name="ios-mail" style={{ fontSize: 30, width: 30, color: "#FFF" }} />
                  </Button>
                </Col>
                <Col>
                  <Text style={styles.feedbackHeader}>High School Office</Text>
                  <Text style={styles.feedbackHead}>(Grade 9 - Grade 12)</Text>
                  <Text style={styles.feedbackHead}>+65 6602 7262</Text>
                  <Anchor href="mailto:highschool@sais.edu.sg" title="highschool@sais.edu.sg" />
                </Col>
              </Row> */}
            </Grid>
          </View>
        </Content>
      </View>
    );
  }
}
