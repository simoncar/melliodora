import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Image from "../components/Imgix";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import { ActionSheetProvider, connectActionSheet } from "@expo/react-native-action-sheet";
import I18n from "../lib/i18n";
import _ from "lodash";
import { launchProfileImagePicker } from "../lib/APIUploadImage";
import { Text, Button } from "../components/sComponent";
import { UserEntity } from "../lib/interfaces";
import { UpdateUser } from "../lib/APIUser";
import { useAuth, useDisplayName } from "../lib/globalState";

interface TProps {
	navigation: any;
	route: any;
}

export default function EditUserProfile(props: TProps) {
	const [errorMessage, setErrorMessage] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [refresh, setDisplayName, state, isUpdated] = useDisplayName();
	const user = props.route.params.user;

	useEffect(() => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
	}, []);

	const save = async () => {
		const newUser = {
			firstName: firstName,
			lastName: lastName,
			uid: user.uid,
		};

		

		UpdateUser(newUser, setDisplayName);
		// const updateProfileObj = {};

		// const downloadURL = await saveProfilePic(diff.photoURL);
		// updateProfileObj["photoURL"] = downloadURL;
		// diff["photoURL"] = downloadURL;

		// await firebase.firestore()
		// 	.collection(globalAny.domain)
		// 	.doc("user")
		// 	.collection("registered")
		// 	.doc(this.state.user.uid)
		// 	.set(diff, { merge: true });

		//const refreshFunction = this.props.refreshFunction;
		//refreshFunction(diff);

		//this.props.navigation.pop();
	};

	const _pickImage = async () => {
		let result = await launchProfileImagePicker();

		if (!result.cancelled) {
			this.setProfilePic({ profilePic: result.uri });
		}
	};

	const setProfilePic = ({ profilePic }) => {
		this.setState((prevState) => ({ user: { ...prevState.user, photoURL: profilePic } }));
	};

	const _onOpenActionSheet = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
		if (status === "granted") {
			const options = [I18n.t("photoTake"), I18n.t("photoChoose"), I18n.t("delete"), I18n.t("cancel")];
			const destructiveButtonIndex = options.length - 2;
			const cancelButtonIndex = options.length - 1;

			this.props.showActionSheetWithOptions(
				{
					options,
					cancelButtonIndex,
					destructiveButtonIndex,
				},
				(buttonIndex) => {
					// Do something here depending on the button index selected
					switch (buttonIndex) {
						case 0:
							this.props.navigation.push("CameraApp", {
								onGoBack: this.setProfilePic,
							});
							break;
						case 1:
							this._pickImage();
							break;
					}
				}
			);
		}
	};

	const _renderProfilePic = () => {
		const photoURL = user.photoURL;

		return (
			<View style={styles.profilePicContainer}>
				<TouchableOpacity onPress={_onOpenActionSheet}>
					{photoURL ? (
						<Image style={styles.profilePhoto} source={{ uri: photoURL }} />
					) : (
						<Ionicons name="ios-person" size={100} color="#999999" style={styles.profilePic} />
					)}
					{}
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.saveAreaView}>
			<ScrollView>
				<Text>{errorMessage}</Text>
				<Text>{firstName}</Text>
				<Text>{lastName}</Text>

				{_renderProfilePic()}

				<View style={styles.titleContainer}>
					<Text style={styles.nameText}>{I18n.t("email")}: </Text>
					<Input style={styles.sectionContentText} value={user.email} />
				</View>

				<View style={styles.titleContainerRow}>
					<View style={styles.rowFlex}>
						<Text style={styles.nameText}>{I18n.t("firstName")}:</Text>
						<Input
							style={styles.sectionContentText}
							onChangeText={(firstName) => setFirstName(firstName)}
							value={firstName}
						/>
					</View>
					<View style={styles.rowFlex}>
						<Text style={styles.nameText}>{I18n.t("lastName")}:</Text>
						<Input
							style={styles.sectionContentText}
							onChangeText={(lastName) => setLastName(lastName)}
							value={lastName}
						/>
					</View>
				</View>

				<Button onPress={() => save()} title={I18n.t("save")} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	nameText: {
		color: "#777777",
		fontSize: 10,
		fontWeight: "600",
	},

	profilePhoto: {
		borderColor: "grey",
		borderRadius: 150 / 2,
		borderWidth: 1,
		height: 150,
		overflow: "hidden",
		width: 150,
	},
	profilePic: {
		borderColor: "lightgray",
		height: 200,
	},
	profilePicContainer: {
		alignItems: "center",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,
	},

	rowFlex: { flex: 1 },
	saveAreaView: { backgroundColor: "#fdfdfd", flex: 1 },
	sectionContentText: {
		borderBottomWidth: 1,
		borderColor: "#100c08",
		color: "#111111",
		fontSize: 14,
		height: 40,
	},
	titleContainer: {
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,
	},
	titleContainerRow: {
		flexDirection: "row",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,
	},
});
