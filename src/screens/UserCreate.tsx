import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, View, Image, ScrollView } from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import uuid from "uuid";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../lib/firebase";
import { Text, Button } from "../components/sComponent";
import { saveProfilePic, launchProfileImagePicker, getPermissionAsync } from "../lib/APIUploadImage";
import I18n from "../lib/i18n";

const width = 100;
const globalAny: any = global;

interface TProps {
	navigation: any;
	auth: any;
}

interface TState {
	email: string;
	password: string;
	confirmPassword: string;
	profilePic: string;
	displayName: string;
	firstName: string;
	lastName: string;
	errorMessage: string | null;
	loading: boolean;
}

export class SignUp extends Component<TProps, TState> {
	state = {
		email: "",
		password: "",
		confirmPassword: "",
		profilePic: "",
		displayName: "",
		firstName: "",
		lastName: "",
		errorMessage: null,
		loading: false,
	};

	handleSignUp = () => {
		try {
			this.setState({ loading: true });
			console.log("Create account:", this.state.email);
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then(async (userCredential) => {
					console.log("userCredential:", userCredential);
					let downloadURL = "";
					if (this.state.profilePic) {
						downloadURL = await saveProfilePic(this.state.profilePic);
						userCredential.user.updateProfile({
							photoURL: downloadURL,
							displayName: this.state.displayName,
						});
					}
					const communityJoined = globalAny.domain ? [globalAny.domain] : [];

					const photoURLObj = downloadURL ? { photoURL: downloadURL } : {};
					const userDict = {
						...photoURLObj,
						email: userCredential.user.email,
						uid: userCredential.user.uid,
						displayName: this.state.displayName,
						firstName: this.state.firstName,
						lastName: this.state.lastName,
					};

					// create global registered user
					// NOTE: leucoxylon: exports.processSignUp = functions.auth.user().onCreate((user) => {
					firebase
						.firestore()
						.collection("users")
						.doc(userCredential.user.uid)
						.set({ ...userDict, communityJoined }, { merge: true });

					// create domain specific user
					if (globalAny.domain) {
						firebase
							.firestore()
							.collection(globalAny.domain)
							.doc("user")
							.collection("registered")
							.doc(userCredential.user.uid)
							.set(userDict, { merge: true });
					}
				})
				// .then(() => {
				//   const setUserClaim = firebase.functions().httpsCallable('setUserClaim');
				//   setUserClaim({ email: this.state.email, domain: globalAny.domain })
				// })
				.then((result) => {
					console.log("resultA:", result);
					this.setState({ loading: false });
				})
				.then((result) => {
					console.log("resultB:", result);
					this.props.navigation.popToTop();
				})
				.catch((error) => {
					console.log("CCC:", error);
					this.setState({
						errorMessage: error.message,
						loading: false,
					});
				});
		} catch (error) {
			this.setState({
				errorMessage: error.message,
				loading: false,
			});
		}
	};

	setProfilePic = ({ profilePic }) => {
		this.setState({ profilePic: profilePic });
	};

	async saveProfilePic(imgURI) {
		var fileToUpload = imgURI;
		var mime = "image/jpeg";

		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", fileToUpload, true);
			xhr.send(null);
		});

		const ref = firebase.storage().ref("smartcommunity/profile").child(uuid.v4());

		const snapshot = await ref.put(blob, {
			contentType: mime,
			cacheControl: "max-age=31536000",
		});
		const downloadURL = await snapshot.ref.getDownloadURL();

		blob.close();
		return downloadURL;
	}

	_pickImage = async () => {
		let result = await launchProfileImagePicker();

		if (!result.cancelled) {
			this.setState({ profilePic: result.uri });
		}
	};

	_onOpenActionSheet = () => {
		getPermissionAsync();
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
	};

	icon(source) {
		const width = 100;
		if (!source) {
			return <Ionicons name="ios-person" size={width * 0.85} color="grey" style={styles.profileIcon} />;
		} else {
			return <Image style={styles.profileImage} source={{ uri: source }} />;
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={styles.profileImageView}>
						<TouchableOpacity onPress={this._onOpenActionSheet}>
							{this.icon(this.state.profilePic)}
						</TouchableOpacity>
					</View>
					<Text>{this.state.errorMessage}</Text>
					<Input
						placeholder={I18n.t("email")}
						onChangeText={(text) => this.setState({ email: text })}
						value={this.state.email}
						containerStyle={styles.containerStyle}
						inputContainerStyle={styles.containerInput}
						autoCapitalize="none"
						keyboardType="email-address"
						autoFocus={true}
						testID="signup.email"
					/>

					<View style={styles.passwordField}>
						<Input
							placeholder={I18n.t("password")}
							onChangeText={(text) => this.setState({ password: text })}
							value={this.state.password}
							autoCapitalize="none"
							secureTextEntry={false}
							testID="signup.password"
							containerStyle={styles.containerStyle}
							inputContainerStyle={styles.containerInput}
						/>
						<Ionicons name="ios-eye-off" size={25} color="grey" style={styles.imageStyle} />
					</View>

					<Input
						placeholder={I18n.t("firstName")}
						onChangeText={(text) => this.setState({ firstName: text })}
						value={this.state.firstName}
						containerStyle={styles.containerStyle}
						inputContainerStyle={styles.containerInput}
						autoCapitalize="words"
						testID="signup.firstName"
					/>
					<Input
						placeholder={I18n.t("lastName")}
						onChangeText={(text) => this.setState({ lastName: text })}
						value={this.state.lastName}
						containerStyle={styles.containerStyle}
						inputContainerStyle={styles.containerInput}
						autoCapitalize="words"
						testID="signup.lastName"
					/>

					<Button title={I18n.t("signUp")} onPress={this.handleSignUp} testID="forgotpasswordsubmit" />
				</ScrollView>
			</View>
		);
	}
}

const ConnectedApp = connectActionSheet(SignUp);

export default class ActionSheetContainer extends Component {
	render() {
		return (
			<ActionSheetProvider>
				<ConnectedApp navigation={this.props.navigation} />
			</ActionSheetProvider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10,
	},

	containerInput: {
		borderBottomWidth: 0,
	},
	containerStyle: {
		backgroundColor: "#ffffff",
		borderColor: "#d2d2d2",
		borderRadius: 10,
		borderWidth: 1,
		height: 45,
		marginVertical: 8,
	},

	imageStyle: {
		paddingHorizontal: 15,
	},
	passwordField: {
		alignItems: "center",
		borderColor: "#000",
		borderRadius: 5,
		flexDirection: "row",
		height: 40,
		justifyContent: "center",
		margin: 20,
		padding: 10,
	},

	profileIcon: {
		borderColor: "lightgray",
		borderRadius: width / 2,
		borderWidth: StyleSheet.hairlineWidth,
		color: "#0075b7",
		height: width,
		margin: 12,
		textAlign: "center",
		width: width,
	},

	profileImage: {
		alignItems: "center",
		borderColor: "lightgray",
		borderRadius: width / 2,
		borderWidth: StyleSheet.hairlineWidth,
		height: width,
		justifyContent: "center",
		margin: 12,
		width: width,
	},

	profileImageView: { alignItems: "center" },
});
