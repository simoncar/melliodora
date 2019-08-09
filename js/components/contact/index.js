import React, { Component } from "react";
import { View, Linking } from "react-native";

import { Content, Text, Button } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Communications from "react-native-communications";
import updateFirebase from "./../../lib/updateFirebase";

import styles from "./styles";

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
    };
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

  _updateFirebase() {
    updateFirebase();
    this.setState({ updateFirebaseText: "Another golf day booked!" });
  }

  render() {
    return (
      <View style={styles.container}>
        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.contentIconsContainer}>
            <Grid>
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
                  <Text style={styles.feedbackHead}>(Grade 6 - Grade 8)</Text>
                  <Text style={styles.feedbackHead}>+65 6602 7181</Text>
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
              </Row>
            </Grid>
          </View>
        </Content>
      </View>
    );
  }
}
