 

import React, { Component } from "react";
import { View, Linking, TouchableHighlight, StyleSheet } from "react-native";
import * as firebase from "firebase";
import { Content, Button } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Communications from "react-native-communications";
import Analytics from "../lib/analytics";
import { connect } from "react-redux";
import { Text } from "../components/sComponent";

const contactIconType = {
  call: "ios-call",
  mail: "ios-mail",
  location: "ios-pin"
};

class Anchor extends React.Component {
  _handlePress = () => {
    Linking.openURL(this.props.href);
    this.props.onPress && this.props.onPress();
  };

  render() {
    return <Text style={styles.feedbackHead} onPress={this._handlePress}>
			{this.props.title}
		</Text>;
  }
}

class Contact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      updateFirebaseText: "",
      contactInfo: []
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
      firebase.firestore().collection(global.domain).doc("config").get().then(doc => {
        if (doc.exists) {
          const docData = doc.data();
          if (docData.contacts) this.setState({ contactInfo: docData.contacts });
        }
      });
    } catch (error) {
      // Error retrieving data
    }
  };

  _renderSubTexts = subTexts => {
    if (!subTexts) return;
    return subTexts.map(subitem => <Text style={styles.feedbackHead}>{subitem}</Text>);
  };

  _contactBtnAction = item => {
    if (item.type == "call" && item.phoneNumber) {
      return () => Communications.phonecall(item.phoneNumber, true);
    }

    if (item.type == "mail" && item.email) {
      return () => Communications.email([item.email], null, null, null, null);
    }
  };

  render() {
    return <View style={styles.container}>
			{(global.administrator || this.props.auth.isAdmin) && <TouchableHighlight style={styles.adminButton} underlayColor="#ff7043" onPress={() => this.props.navigation.navigate("contactAdmin", { contactInfo: this.state.contactInfo })}>
				<MaterialIcons name="edit" style={styles.a657d5710b21211ea8aa31930972200e5} />
			</TouchableHighlight>}

			<Content showsVerticalScrollIndicator={false}>
				<View style={styles.contentIconsContainer}>
					<Grid>
						{this.state.contactInfo.map((item, idx) => {
              return <Row style={styles.a657d7e20b21211ea8aa31930972200e5} key={idx}>
								<Col style={styles.a657d7e21b21211ea8aa31930972200e5}>
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
							</Row>;
            })}
					</Grid>
				</View>
			</Content>
		</View>;
  }
}

const styles = StyleSheet.create({
  a657d5710b21211ea8aa31930972200e5: { color: "white", fontSize: 25 },
  a657d7e20b21211ea8aa31930972200e5: { paddingTop: 20 },
  a657d7e21b21211ea8aa31930972200e5: { width: 80 },

  adminButton: {
    alignItems: "center",
    backgroundColor: "#ff5722",
    borderColor: "#ff5722",
    borderRadius: 50 / 2,
    borderWidth: 1,
    bottom: 20,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    shadowColor: "#000000",
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: 50,
    zIndex: 1
  },
  container: {
    flex: 1,
    height: null,
    width: null
  },
  contentIconsContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30
  },

  feedbackHead: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
    opacity: 0.8
  },
  feedbackHeader: {
    color: "black",
    fontSize: 22,
    fontWeight: "600",
    paddingBottom: 10
  },

  roundedButton: {
    alignItems: "center",
    backgroundColor: "#141b4d",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60
  }

});

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Contact);