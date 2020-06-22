
import React, { Component } from "react";
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Button } from "react-native";
import firebase from "firebase";
import { Text } from "../components/sComponent";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import I18n from "../lib/i18n";

class UserProfile extends Component {

	state = {
		user: {}
	};

	componentDidMount() {
		const { uid, user } = this.props.route.params;

		this.showChat = uid != global.uid;
		if (user) {
			this.setState({ user, uid });
		} else if (uid) {
			firebase.firestore().collection(this.props.community.selectedCommunity.node).doc("user").collection("registered").doc(uid).get().then(snapshot => {
				if (!snapshot.exists) {
					// return this.props.navigation.push("EditUserProfile", {
					// 	...this.props.navigation.state.params
					// });
				}
				const data = snapshot.data();
				this.props.navigation.setParams({ uid: uid, user: data });
				this.setState({ user: data });
			});
		}
	}

	refreshFunction(data) {
		const oldUser = this.state.user
		const newUser = {
			...oldUser,
			...data
		}


		console.log("REFRESH FUNCTION:", oldUser, newUser)
		this.setState({ user: newUser });
	}

	_renderProfilePic = () => {
		const width = 128;
		const photoURL = this.state.user.photoURL;

		return <View style={styles.abfa02ad0b2d311ea999f193302967c6e}>
			{}
			<View style={styles.abfa02ad1b2d311ea999f193302967c6e}>
				{photoURL ? <Image style={styles.abfa02ad2b2d311ea999f193302967c6e} source={{ uri: photoURL }} /> : <Ionicons name="ios-person" size={width * 0.85} color="grey" style={styles.abfa051e0b2d311ea999f193302967c6e} />}
			</View>
		</View>;
	};

	privateMessageUser = async (targetUID, sourcUID, targetName) => {
		//only for new chat
		const dict = {
			type: "private",
			title: targetName,
			createdTimeStamp: firebase.firestore.Timestamp.now()
		};

		// const data = [];

		let docID = "";
		if (targetUID < sourcUID) {
			docID = targetUID + "_" + sourcUID;
			dict["members"] = [targetUID, sourcUID];
		} else {
			docID = sourcUID + "_" + targetUID;
			dict["members"] = [sourcUID, targetUID];
		}

		const navParams = {
			chatroom: docID,
			type: "private"
		};

		const communityDomain = this.props.community.selectedCommunity.node;
		const querySnapshot = await firebase.firestore().collection(communityDomain).doc("chat").collection("chatrooms").doc(docID).get();

		if (!querySnapshot.exists) {
			navParams["title"] = dict.title;
			await firebase.firestore().collection(communityDomain).doc("chat").collection("chatrooms").doc(docID).set(dict, { merge: true });
		}

		this.setState({ modalVisible: false });

		console.log(navParams)
		this.props.navigation.pop();
		this.props.navigation.navigate("chatPrivate", navParams);
	};

	render() {

		var permitEdit = this.props.route.params.permitEdit;

		permitEdit = true

		if (permitEdit) {
			this.props.navigation.setOptions({
				headerRight: () =>
					<Button
						onPress={() => {
							this.props.navigation.navigate("EditUserProfile", {
								...this.state,
								refreshFunction: this.refreshFunction.bind(this)
							})
						}}
						title={I18n.t("edit")} />
			});
		}

		return <SafeAreaView style={styles.abfa078f0b2d311ea999f193302967c6e}>
			<ScrollView ScrollView bounces={false}>
				{this._renderProfilePic()}
				{this.showChat ? <View style={[styles.titleContainer, { flexDirection: "row", justifyContent: "center" }]}>
					<TouchableOpacity style={styles.abfa0c710b2d311ea999f193302967c6e} onPress={() => {
						this.privateMessageUser(this.state.user.uid, global.uid, this.state.user.displayName || this.state.user.firstName + " " + this.state.user.lastName);
					}}>
						<View style={styles.abfa0ee20b2d311ea999f193302967c6e}>
							<MaterialIcons name="message" size={25} color={"white"} />
						</View>
						<Text style={styles.abfa0ee21b2d311ea999f193302967c6e}>
							Private{"\n"}Message
                </Text>
					</TouchableOpacity>
				</View> : null}

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Email:
            </Text>
					<Text style={styles.sectionContentText} numberOfLines={1}>
						{this.state.user.email}
					</Text>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Display Name:
            </Text>
					<Text style={styles.sectionContentText} numberOfLines={1}>
						{this.state.user.displayName}
					</Text>
				</View>

				<View style={[styles.titleContainer, { flexDirection: "row" }]}>
					<View style={styles.abfa18a60b2d311ea999f193302967c6e}>
						<Text style={styles.nameText} numberOfLines={1}>
							First Name:
              </Text>
						<Text style={styles.sectionContentText} numberOfLines={1}>
							{this.state.user.firstName}
						</Text>
					</View>

					<View style={styles.abfa18a61b2d311ea999f193302967c6e}>
						<Text style={styles.nameText} numberOfLines={1}>
							Last Name:
              </Text>
						<Text style={styles.sectionContentText} numberOfLines={1}>
							{this.state.user.lastName}
						</Text>
					</View>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Country:
            </Text>
					<Text style={styles.sectionContentText} numberOfLines={1}>
						{this.state.user.country}
					</Text>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Region:
            </Text>
					<Text style={styles.sectionContentText} numberOfLines={1}>
						{this.state.user.region}
					</Text>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Organization:
            </Text>
					<Text style={styles.sectionContentText} numberOfLines={1}>
						{this.state.user.organization}
					</Text>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Interest Group(s):
            </Text>

					{Array.isArray(this.state.user.interestGroups) && this.state.user.interestGroups.length ? this.state.user.interestGroups.map(grp => <Text style={styles.sectionContentText} numberOfLines={1} key={grp}>
						{grp}
					</Text>) : <Text style={styles.sectionContentText} numberOfLines={1}>
							None
								</Text>}
				</View>
			</ScrollView>
		</SafeAreaView >;
	}
}
const mapStateToProps = state => ({
	community: state.community
});
export default connect(mapStateToProps)(UserProfile);

const styles = StyleSheet.create({

	abfa02ad1b2d311ea999f193302967c6e: {
		alignItems: "center",
		backgroundColor: "#fdfdfd",
		bottom: 0,
		justifyContent: "center",
		left: 0,
		position: "absolute",
		right: 0,
		top: 0,
		zIndex: 2
	},
	abfa02ad2b2d311ea999f193302967c6e: {
		borderColor: "lightgray",
		borderWidth: 5,
	},
	abfa051e0b2d311ea999f193302967c6e: {
		borderColor: "lightgray",
		borderWidth: StyleSheet.hairlineWidth,
		color: "#0075b7",
		textAlign: "center",
	},
	abfa078f0b2d311ea999f193302967c6e: { flex: 1 },
	abfa0c710b2d311ea999f193302967c6e: {
		alignItems: "center",
		justifyContent: "center"
	},
	abfa0ee20b2d311ea999f193302967c6e: {
		alignItems: "center",
		backgroundColor: "#4CAF50",
		borderTopLeftRadius: 50 / 2,
		height: 50,
		justifyContent: "center",
		shadowColor: "#000000",
		shadowOffset: {
			height: 1,
			width: 1
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		width: 50
	},
	abfa0ee21b2d311ea999f193302967c6e: {
		alignItems: "center",
		color: "#808080",
		fontSize: 12,
		justifyContent: "center",
		marginTop: 4,
		textAlign: "center"
	},
	abfa18a60b2d311ea999f193302967c6e: { flex: 1 },
	abfa18a61b2d311ea999f193302967c6e: { flex: 1 },

	nameText: {
		color: "black",
		fontSize: 18,
		fontWeight: "600"
	},
	sectionContentText: {
		color: "#808080",
		fontSize: 14
	},
	titleContainer: {
		backgroundColor: "#fdfdfd",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	}
});