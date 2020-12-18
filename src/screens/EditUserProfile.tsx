import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import firebase from "firebase";
import Image from "../components/Imgix"
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import { ActionSheetProvider, connectActionSheet } from "@expo/react-native-action-sheet";
import I18n from "../lib/i18n";
import _ from "lodash";
import { saveProfilePic, launchProfileImagePicker } from "../lib/uploadImageAPI";
import { Text, Button } from "../components/sComponent";

const globalAny: any = global;

class EditUserProfile extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			user: {
				photoURL: "",
				firstName: "",
				lastName: "",
				email: ""
			},
		};

	}

	componentDidMount() {
		const { uid, user } = this.props;

		//this.props.route.params._updateProfile = this._updateProfile;
		this.originData = { ...user, uid };
		this.setState({ user: { ...user, uid } });
	}

	save = async () => {
		this.setState({ loading: true });
		try {

			// const updateProfileObj = {};

			// const downloadURL = await saveProfilePic(diff.photoURL);
			// updateProfileObj["photoURL"] = downloadURL;
			// diff["photoURL"] = downloadURL;

			await firebase.firestore()
				.collection(globalAny.domain)
				.doc("user")
				.collection("registered")
				.doc(this.state.user.uid)
				.set(diff, { merge: true });

			const refreshFunction = this.props.refreshFunction;
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

		if (!result.cancelled) {
			this.setProfilePic({ profilePic: result.uri });
		}
	};

	setProfilePic = ({ profilePic }) => {
		this.setState(prevState => ({ user: { ...prevState.user, photoURL: profilePic } }));
	};

	_onOpenActionSheet = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
		if (status === 'granted') {
			const options = [I18n.t("photoTake"), I18n.t("photoChoose"), I18n.t("delete"), I18n.t("cancel")];
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
		}
	};

	_renderProfilePic = () => {
		const photoURL = this.state.user.photoURL;

		return <View style={styles.profilePicContainer}>
			<TouchableOpacity onPress={this._onOpenActionSheet}>
				{photoURL ? <Image style={styles.profilePhoto} source={{ uri: photoURL }} /> : <Ionicons name="ios-person" size={100} color="#999999" style={styles.profilePic} />}
				{ }
			</TouchableOpacity>
		</View>;
	};

	render() {
		return <SafeAreaView style={styles.saveAreaView}>
			<ScrollView>

				<Text>{this.state.errorMessage}</Text>

				{this._renderProfilePic()}

				<View style={styles.titleContainer}>
					<Text style={styles.nameText}>{I18n.t("email")}: </Text>
					<Input style={styles.sectionContentText} onChangeText={text => this.setState(prevState => ({ user: { ...prevState.user, email: text } }))} value={this.state.user.email} />
				</View>

				<View style={styles.titleContainerRow}>
					<View style={styles.rowFlex}>
						<Text style={styles.nameText}>{I18n.t("firstName")}:</Text>
						<Input
							style={styles.sectionContentText}
							onChangeText={text =>
								this.setState(prevState =>
								(
									{
										user:
										{
											...prevState.user,
											firstName: text,
										}
									}
								)
								)
							}
							value={this.state.user.firstName}
						/>
					</View>
					<View style={styles.rowFlex}><Text style={styles.nameText}>{I18n.t("lastName")}:</Text>
						<Input
							style={styles.sectionContentText}
							onChangeText={text =>
								this.setState(prevState =>
								(
									{
										user:
										{
											...prevState.user,
											lastName: text,
										}
									}
								)
								)
							}
							value={this.state.user.lastName} />
					</View>
				</View>

				<Button onPress={() => this.save()} title={I18n.t("save")} />
			</ScrollView>
		</SafeAreaView>;
	}
}

const ConnectedApp = connectActionSheet(EditUserProfile);

export default class ActionSheetContainer extends Component {

	render() {
		return <ActionSheetProvider>
			<ConnectedApp navigation={this.props.navigation} refreshFunction={this.props.route.params.refreshFunction} uid={this.props.route.params.uid} user={this.props.route.params.user} />
		</ActionSheetProvider>;
	}
}

const styles = StyleSheet.create({
	nameText: {
		color: "#777777",
		fontSize: 10,
		fontWeight: "600"
	},

	profilePhoto: {
		borderColor: "grey",
		borderRadius: 150 / 2,
		borderWidth: 1,
		height: 150,
		overflow: "hidden",
		width: 150
	},
	profilePic: {
		borderColor: "lightgray",
		height: 200
	},
	profilePicContainer: {
		alignItems: "center",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	},

	rowFlex: { flex: 1 },
	saveAreaView: { backgroundColor: "#fdfdfd", flex: 1 },
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
	},
	titleContainerRow: {
		flexDirection: "row",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	}

});