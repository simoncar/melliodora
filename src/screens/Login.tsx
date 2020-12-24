import React, { useState } from "react";
import { StyleSheet, View, TextInput, SafeAreaView } from "react-native";
import firebase from "firebase";
import _ from "lodash";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button } from "../components/sComponent";
import Loader from "../components/Loader";
import I18n from "../lib/i18n";
import { saveAuth } from "../lib/APIUser";
import { useAuth, useLogin, useEmail, useUid, useDisplayName, usePhotoURL } from "../lib/globalState";

interface TProps {
	navigation: any;
}

export default function LoginScreen(props: TProps) {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [, setGAuth, gAuth] = useAuth();
	const [, setGLogin, gLogin] = useLogin();
	const [, setGEmail, gEmail] = useEmail();
	const [, setGDisplayName, gDisplayName] = useDisplayName();
	const [, setGPhotoURL, gPhotoURL] = usePhotoURL();
	const [, setGUid, gUid] = useUid();

	const handleLogin = () => {
		setLoading(true);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((auth: firebase.auth.UserCredential) => {
				//saveAuth(auth);

				props.navigation.popToTop();
			})
			.catch(function (error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				if (errorCode === "auth/wrong-password") {
					setErrorMessage("Wrong password.");
				} else {
					setErrorMessage(errorMessage);
				}
				setLoading(false);
				console.log(error);
			});
	};

	return (
		<SafeAreaView style={styles.container}>
			<Loader modalVisible={loading} animationType="fade" />
			<Text style={styles.errorMessage}>{errorMessage}</Text>
			<View style={styles.SectionStyle}>
				<Ionicons name="ios-mail" size={25} color="grey" style={styles.ImageStyle} />
				<TextInput
					style={styles.inputField}
					placeholder={I18n.t("email")}
					onChangeText={(text) => {
						setErrorMessage("");
						setEmail(text);
					}}
					value={email}
					autoCapitalize="none"
					testID="login.email"
					keyboardType="email-address"
					autoFocus={true}
					underlineColorAndroid="transparent"
				/>

				<Ionicons name="md-checkmark" size={25} color="grey" style={styles.ImageStyle} />
			</View>

			<View style={styles.SectionStyle}>
				<Ionicons name="lock-closed" size={25} color="grey" style={styles.ImageStyle} />
				<TextInput
					style={styles.inputField}
					placeholder={I18n.t("password")}
					onChangeText={(text) => {
						setErrorMessage("");
						setPassword(text);
					}}
					value={password}
					autoCapitalize="none"
					secureTextEntry={true}
					testID="login.password"
					underlineColorAndroid="transparent"
				/>
				<Ionicons name="ios-eye-off" size={25} color="grey" style={styles.ImageStyle} />
			</View>

			<View>
				<TouchableOpacity onPress={() => props.navigation.navigate("forgetpassword")}>
					<Text style={styles.textAction}>{I18n.t("forgetPassword")}?</Text>
				</TouchableOpacity>
			</View>

			<Button title={I18n.t("login")} onPress={() => handleLogin()} testID="login.loginButton" />
			<Button
				title={I18n.t("signUp")}
				onPress={() => props.navigation.navigate("signup")}
				testID="login.signupButton"
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	ImageStyle: {
		padding: 5,
		paddingHorizontal: 15,
	},
	SectionStyle: {
		alignItems: "center",
		borderBottomWidth: 2,
		borderColor: "#000",
		borderRadius: 5,
		flexDirection: "row",
		height: 40,
		justifyContent: "center",
		margin: 10,
	},

	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10,
	},
	errorMessage: { color: "red", paddingTop: 10, textAlign: "center" },
	inputField: {
		flex: 1,
	},

	textAction: {
		color: "#111111",
		fontSize: 16,
		marginLeft: 30,
	},
});
