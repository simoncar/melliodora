
import React, { Component } from "react";
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Button } from "react-native";
import firebase from "firebase";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import _ from "lodash";
import { saveProfilePic, launchProfileImagePicker, getPermissionAsync } from "../lib/uploadImage";
import { Text } from "../components/sComponent";

export default class EditUserProfile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			user: {}
		};
	}

	componentDidMount() {
		const { uid, user } = this.props.route.params;
		console.log(this.props.route.params)

		this.props.route.params._updateProfile = this._updateProfile;
		this.originData = { ...user, uid };
		this.setState({ user: { ...user, uid } });
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
			console.log("DIFF:", diff)
			console.log(this.state)

			if (!_.isEmpty(diff)) {
				const updateProfileObj = {};
				if (diff.photoURL) {
					const downloadURL = await saveProfilePic(diff.photoURL);
					updateProfileObj["photoURL"] = downloadURL;
					diff["photoURL"] = downloadURL;
				}

				await firebase
					.firestore()
					.collection(global.domain)
					.doc("user")
					.collection("registered")
					.doc(this.state.user.uid)
					.set(diff, { merge: true });
			}

			const refreshFunction = this.props.route.params.refreshFunction;
			refreshFunction(diff);

			this.props.navigation.pop();
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

		this.props.navigation.setOptions({
			headerRight: () =>
				<Button
					onPress={() => this.props.route.params._updateProfile()}
					title={I18n.t("save")} />

		});

		return <SafeAreaView style={styles.ac0abe6c0b2d911ea999f193302967c6e}>
			<ScrollView bounces={false}>

				<Text>{this.state.errorMessage}</Text>
				{this._renderProfilePic()}

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						{I18n.t("email")}:
            </Text>
					<Text style={[styles.sectionContentText]} numberOfLines={1}>
						{this.state.user.email}
					</Text>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Display Name:
            </Text>
					<Input style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, displayName: text } }))} value={this.state.user.displayName} />
				</View>

				<View style={[styles.titleContainer, { flexDirection: "row" }]}>
					<View style={styles.ac0ac34e0b2d911ea999f193302967c6e}>
						<Text style={styles.nameText} numberOfLines={1}>
							First Name:
              </Text>
						<Input style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, firstName: text } }))} value={this.state.user.firstName} />
					</View>
					<View style={styles.ac0ac34e1b2d911ea999f193302967c6e}></View>
					<View style={styles.ac0ac34e2b2d911ea999f193302967c6e}>
						<Text style={styles.nameText} numberOfLines={1}>
							Last Name:
              </Text>
						<Input style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, lastName: text } }))} value={this.state.user.lastName} />
					</View>
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Country:
            </Text>
					<Input style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, country: text } }))} value={this.state.user.country} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Region:
            </Text>
					<Input style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, region: text } }))} value={this.state.user.region} />
				</View>

				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						Organization:
            </Text>
					<Input style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, organization: text } }))} value={this.state.user.organization} />
				</View>
			</ScrollView>
		</SafeAreaView>;
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