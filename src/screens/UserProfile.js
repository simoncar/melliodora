
import React, { Component } from "react";
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Button } from "react-native";
import firebase from "firebase";
import { Text } from "../components/sComponent";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
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

		this.setState({ user: newUser });
	}

	_renderProfilePic = () => {
		const width = 128;
		const photoURL = this.state.user.photoURL;

		return <View style={styles.profilePicContainer}>

			{photoURL ? <Image style={styles.profilePhoto} source={{ uri: photoURL }} /> : <Ionicons name="ios-person" size={width * 0.85} color="grey" style={styles.profilePhotoNone} />}
		</View>;
	};

	privateMessageUser = async (targetUID, sourcUID, targetName) => {
		const dict = {
			type: "private",
			title: targetName,
			createdTimeStamp: firebase.firestore.Timestamp.now()
		};

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

		this.props.navigation.pop();
		this.props.navigation.navigate("chatPrivate", navParams);
	};

	render() {
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

		return <SafeAreaView style={styles.saveAreaView}>
			<ScrollView ScrollView bounces={false}>
				{this._renderProfilePic()}



				<View style={styles.titleContainer}>
					<Text style={styles.nameText} >
						{this.state.user.displayName}
					</Text>
					<Text style={styles.emailText}>
						{this.state.user.email}
					</Text>


					<Text style={styles.groupText} >Groups</Text>

					{Array.isArray(this.state.user.interestGroups) && this.state.user.interestGroups.length ? this.state.user.interestGroups.map(grp => <Text style={styles.sectionContentText} key={grp}>
						{grp}
					</Text>) : <Text style={styles.sectionContentText} >
							None
								</Text>}


					{this.showChat ? <View>
						<TouchableOpacity onPress={() => {
							this.privateMessageUser(this.state.user.uid, global.uid, this.state.user.displayName || this.state.user.firstName + " " + this.state.user.lastName);
						}}>
							<View style={styles.chatIconView}>
								<SimpleLineIcons name="bubble"
									size={25}
									color={"white"}
									style={styles.chatIcon} />
							</View>

						</TouchableOpacity>
					</View> : null}
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

	chatIcon: {
		color: "#222",
		fontSize: 30,
		textAlign: "center"
	},
	chatIconView: {
		color: "#222",
		fontSize: 16,
	},
	emailText: {
		color: "black",
		fontSize: 13,
		textAlign: "center"
	},
	groupText: {
		color: "black",
		fontSize: 13,
		marginTop: 20,
		textAlign: "center"
	},
	nameText: {
		color: "black",
		fontSize: 25,
		fontWeight: "bold",
		textAlign: "center"
	},
	profilePhoto: {
		borderColor: "lightgray",
		borderRadius: 150 / 2,
		borderWidth: StyleSheet.hairlineWidth,
		height: 150,
		overflow: "hidden",
		width: 150
	},

	profilePhotoNone: {
		borderColor: "grey",
		borderRadius: 150 / 2,
		borderWidth: StyleSheet.hairlineWidth,
		height: 150,
		overflow: "hidden",
		textAlign: "center",
		width: 150,
	},
	profilePicContainer: {
		alignItems: "center",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	},
	saveArea: { flex: 1 },
	sectionContentText: {
		color: "#808080",
		fontSize: 14,
		marginBottom: 30,
		textAlign: "center"
	},
	titleContainer: {
		backgroundColor: "#fdfdfd",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,

	}
});