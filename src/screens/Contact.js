import React, { Component } from "react";
import { View, Linking, TouchableHighlight, StyleSheet } from "react-native";
import * as firebase from "firebase";
import { Content, Button } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Communications from "react-native-communications";
import updateFirebase from "../lib/updateFirebase";
import Analytics from "../lib/analytics";
import { connect } from "react-redux";
import { Text } from "../components/sComponent"

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

const styles = StyleSheet.create({
	adb53c780af6511ea88c25dbffc760ad0: {
		color: "#037AFF",
		alignSelf: "center",
		fontSize: 17,
		paddingBottom: 5,
		paddingRight: 20,
		fontWeight: "600"
	},
	adb54b1e0af6511ea88c25dbffc760ad0: {
		padding: 20,
		flexDirection: "row",
	},
	adb54b1e1af6511ea88c25dbffc760ad0: {
		flex: 1,
		paddingLeft: 10
	},
	adb54b1e2af6511ea88c25dbffc760ad0: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10
	},
	adb54d8f0af6511ea88c25dbffc760ad0: {
		alignItems: "center",
		justifyContent: "center"
	},
	adb54d8f1af6511ea88c25dbffc760ad0: {
		width: 90,
		marginTop: 8
	},
	adb54d8f2af6511ea88c25dbffc760ad0: {
		marginTop: 15
	},
	adb550000af6511ea88c25dbffc760ad0: {
		marginTop: 20
	},
	adb550001af6511ea88c25dbffc760ad0: {
		marginTop: 20
	},
	adb550002af6511ea88c25dbffc760ad0: {
		fontSize: 44,
		color: "white",
		position: "absolute",
		left: "23%",
		top: "-10%"
	},
	adb550003af6511ea88c25dbffc760ad0: {
		position: "absolute",
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "grey",
		zIndex: 2,
		width: "100%",
	},
	adb550004af6511ea88c25dbffc760ad0: {
		height: "98%",
		width: "100%",
		borderColor: "black"
	},
	adb550005af6511ea88c25dbffc760ad0: {
		width: "100%"
	},
	header: {
		paddingLeft: 15,
		paddingRight: 15,
		marginLeft: Platform.OS === "ios" ? undefined : -30
	},
	rowHeader: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignSelf: "stretch",
		paddingTop: Platform.OS === "android" ? 7 : 0
	},
	btnHeader: {
		alignSelf: "center"
	},
	imageHeader: {
		height: 25,
		width: 95,
		resizeMode: "contain",
		alignSelf: "center"
	},
	container: {
		flex: 1,
		width: null,
		height: null,
	},
	contentIconsContainer: {
		paddingTop: 30,
		paddingLeft: 10,
		paddingRight: 10
	},
	roundedButton: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 30,
		width: 60,
		height: 60,
		backgroundColor: "#141b4d"
	},
	roundedCustomButton: {
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		borderRadius: 30,
		width: 60,
		height: 60
	},
	feedbackHeaderContainer: {
		padding: 20,
		paddingTop: 30,
		backgroundColor: "transparent"
	},
	feedbackHeader: {
		fontSize: 22,
		paddingBottom: 10,
		fontWeight: "600",
		color: "black"
	},
	feedbackHead: {
		opacity: 0.8,
		fontSize: 13,
		fontWeight: "bold",
		color: "black"
	},
	feedbackButton: {
		opacity: 0.8,
		fontSize: 13,
		fontWeight: "bold",
		color: "black",
		backgroundColor: "#141b4d"
	},
	spacer: {
		opacity: 0.8,
		fontSize: 13,
		fontWeight: "bold",
		color: "#FFF",
		paddingBottom: 400
	},

	updateNotes: {
		opacity: 1,
		fontSize: 13,
		fontWeight: "bold",
		color: "white",
		paddingTop: 30
	},
	feedbackContainer: {
		marginTop: 30,
		paddingLeft: 20,
		paddingRight: 20
	},
	inputGrp: {
		backgroundColor: "rgba(0,0,0,0.2)",
		marginBottom: 20,
		borderWidth: 0,
		borderColor: "transparent"
	},
	feedbackInputBox: {},
	input: {
		color: "#fff"
	},
	inputBox: {},
	inputBoxIcon: {
		alignSelf: "flex-end"
	},
	forwardIcon: {
		alignSelf: "flex-end",
		paddingBottom: 5
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
	adminContainer: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
	},
	contactText: {
		marginTop: 12,
		fontWeight: "bold"
	}
});

const mapStateToProps = (state) => ({
	auth: state.auth,
});
export default connect(mapStateToProps)(Contact);
