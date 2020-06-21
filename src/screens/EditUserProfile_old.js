
import React, { Component } from "react";
import { View, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Button } from "react-native";
import firebase from "firebase";

import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import _ from "lodash";
import { saveProfilePic, launchProfileImagePicker, getPermissionAsync } from "../lib/uploadImage";
import Loader from "../components/Loader";
import { Text } from "../components/sComponent";

class EditUserProfile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			user: {}
		};




	}

	componentDidMount() {
		const { uid, user, email } = this.props.route.params;

		const currentUser = firebase.auth().currentUser;
		if (currentUser.uid != uid || currentUser.isAnonymous) {
			return this.props.navigation.pop();
		}
		this.props.route.params._updateProfile = this._updateProfile;
		this.originData = { ...user, uid };
		this.setState({ user: { ...user, uid, email: currentUser.email } });
	}

	/**
	 * Deep diff between two object, using lodash
	 * @param  {Object} object Object compared
	 * @param  {Object} base   Object to compare with
	 * @return {Object}        Return a new object who represent the diff
	 */
	difference = (object, base) => {
		function changes(object, base) {
			return _.transform(object, function (result, value, key) {
				if (!_.isEqual(value, base[key])) {
					result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
				}
			});
		}
		return changes(object, base);
	};

	_updateProfile = async () => {
		this.setState({ loading: true });

		try {
			// const modifiedObj = _.pick(this.state.user, Object.keys(this.originData));
			const diff = this.difference(this.state.user, this.originData);

			const user = firebase.auth().currentUser;
			if (user && user.uid === this.originData.uid && !_.isEmpty(diff)) {
				const updateProfileObj = {};
				if (diff.photoURL) {
					const downloadURL = await saveProfilePic(diff.photoURL);

					//set auth photo info
					updateProfileObj["photoURL"] = downloadURL;

					//set firestore photo info
					diff["photoURL"] = downloadURL;
				}

				//update displayname
				if (diff.displayName) updateProfileObj["displayName"] = diff.displayName;

				//update auth user info
				if (!_.isEmpty(updateProfileObj)) user.updateProfile(updateProfileObj);

				//update firestore user info
				await firebase.firestore().collection(global.domain).doc("user").collection("registered").doc(user.uid).set(diff, { merge: true });
			}

			await this.setState({ loading: false });
			this.props.navigation.popToTop();
		} catch (error) {
			this.setState({
				errorMessage: error.message,
				loading: false
			});
		}
	};

	_pickImage = async () => {
		let result = await launchProfileImagePicker();
		console.log(result);

		if (!result.cancelled) {
			this.setProfilePic({ profilePic: result.uri });
		}
	};

	setProfilePic = ({ profilePic }) => {
		this.setState(prevState => ({ user: { ...prevState.user, photoURL: profilePic } }));
	};

	_onOpenActionSheet = () => {
		getPermissionAsync();
		const options = ["Take photo from camera", "Select from gallery", "Clear", "Cancel"];
		const destructiveButtonIndex = options.length - 2;
		const cancelButtonIndex = options.length - 1;

		this.props.showActionSheetWithOptions({
			options,
			cancelButtonIndex,
			destructiveButtonIndex
		}, buttonIndex => {
			// Do something here depending on the button index selected
			switch (buttonIndex) {
				case 0:
					this.props.navigation.push("CameraApp", {
						onGoBack: this.setProfilePic
					});
					break;
				case 1:
					this._pickImage();
					break;
			}
		});
	};

	_renderProfilePic = () => {
		const width = 120;
		const containerHeight = 200;
		const photoURL = this.state.user.photoURL;

		return <View style={styles.profilePicContainer}>
			<TouchableOpacity style={styles.ac0ab98a0b2d911ea999f193302967c6e} onPress={this._onOpenActionSheet}>
				{photoURL ? <Image style={styles.ac0ab98a1b2d911ea999f193302967c6e} source={{ uri: photoURL }} /> : <Ionicons name="ios-person" size={width * 0.85} color="#999999" style={styles.ac0abbfb0b2d911ea999f193302967c6e} />}
				{}
			</TouchableOpacity>
			<Text></Text>
			<Text style={styles.profilePicText} numberOfLines={1}>
				Add profile picture
        </Text>
		</View>;
	};
	render() {



		return <SafeAreaView style={styles.ac0abe6c0b2d911ea999f193302967c6e}>
			<ScrollView bounces={false}>
				<Loader modalVisible={this.state.loading} animationType="fade" />
				<Text>{this.state.errorMessage}</Text>
				{this._renderProfilePic()}

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Email:
            </Text>
					<Text style={[styles.sectionContentText, { height: 18 }]} numberOfLines={1}>
						{this.state.user.email}
					</Text>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Display Name:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, displayName: text } }))} value={this.state.user.displayName} />
				</View>

				<View style={[styles.titleContainer, { flexDirection: "row" }]}>
					<View style={styles.ac0ac34e0b2d911ea999f193302967c6e}>
						<Text style={styles.nameText} numberOfLines={1}>
							First Name:
              </Text>
						<TextInput style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, firstName: text } }))} value={this.state.user.firstName} />
					</View>
					<View style={styles.ac0ac34e1b2d911ea999f193302967c6e}></View>
					<View style={styles.ac0ac34e2b2d911ea999f193302967c6e}>
						<Text style={styles.nameText} numberOfLines={1}>
							Last Name:
              </Text>
						<TextInput style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, lastName: text } }))} value={this.state.user.lastName} />
					</View>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Country:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, country: text } }))} value={this.state.user.country} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Region:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, region: text } }))} value={this.state.user.region} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Organization:
            </Text>
					<TextInput style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, organization: text } }))} value={this.state.user.organization} />
				</View>
			</ScrollView>
		</SafeAreaView>;
	}
}

const ConnectedApp = connectActionSheet(EditUserProfile);

export default class ActionSheetContainer extends Component {


	static navigationOptions = ({ navigation }) => ({
		// title: I18n.t("Edit", { defaultValue: "Edit" }),
		title: "Edit Profile",
		headerRight: () => {
			const permitEdit = this.props.route.params.permitEdit;

			if (!permitEdit) return;
			return <TouchableOpacity onPress={() => this.props.route.params._updateProfile()}>
				<View style={styles.ac0ac5bf0b2d911ea999f193302967c6e}>
					<Text style={styles.ac0ac5bf1b2d911ea999f193302967c6e}>Save </Text>
					<MaterialIcons name="done" style={styles.ac0ac5bf2b2d911ea999f193302967c6e} />
				</View>
			</TouchableOpacity>;
		}
	});

	render() {

		console.log("EDIT PROPS:", this.props)

		return <ActionSheetProvider>
			<ConnectedApp navigation={this.props.navigation} />
		</ActionSheetProvider>;
	}
}

const styles = StyleSheet.create({
	ac0ab98a1b2d911ea999f193302967c6e: {
		borderColor: "lightgray",
		borderWidth: 5,
	},
	ac0abbfb0b2d911ea999f193302967c6e: {
		borderColor: "lightgray",
		borderWidth: StyleSheet.hairlineWidth,
		textAlign: "center",
	},
	ac0abe6c0b2d911ea999f193302967c6e: { backgroundColor: "#fdfdfd", flex: 1 },
	ac0ac34e0b2d911ea999f193302967c6e: { flex: 1 },
	ac0ac34e2b2d911ea999f193302967c6e: { flex: 1 },
	ac0ac5bf0b2d911ea999f193302967c6e: {
		alignItems: "center",
		color: "#48484A",
		flexDirection: "row",
		fontSize: 25,
		marginRight: 10
	},
	ac0ac5bf1b2d911ea999f193302967c6e: { color: "#777777" },
	ac0ac5bf2b2d911ea999f193302967c6e: {
		color: "#777777",
		fontSize: 25,
		marginRight: 10
	},

	nameText: {
		color: "#777777",
		fontSize: 10,
		fontWeight: "600"
	},
	profilePicContainer: {
		alignItems: "center",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	},
	profilePicText: {
		color: "#777777",
		fontSize: 14,
		fontWeight: "600"
	},
	sectionContentText: {
		borderBottomWidth: 1,
		borderColor: "#100c08",
		color: "#111111",
		fontSize: 14,
		height: 40
	},
	titleContainer: {
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	}
});