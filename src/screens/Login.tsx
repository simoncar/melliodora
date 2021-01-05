import React, { useState } from "react";
import { StyleSheet, View, TextInput, SafeAreaView } from "react-native";
import firebase from "../lib/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Progress from "expo-progress";
import { Text, Button } from "../components/sComponent";
import I18n from "../lib/i18n";
import { Input } from "react-native-elements";

interface TProps {
	navigation: any;
}

export default function LoginScreen(props: TProps) {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [emailValid, setEmailValid] = useState(false);
	const [passwordComplexity, setPasswordComplexity] = useState(false);
	const [secureEntry, setSecureEntry] = useState(true);

	const handleLogin = () => {
		setLoading(true);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((auth: firebase.auth.UserCredential) => {
				// onAuthStateChanged will fire in Setup.tsx when the login happens
				// onAuthStateChanged handless the updating of Auth state
				console.log("Logging In Done:", auth);
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

	const handleEmail = (email) => {
		setErrorMessage("");
		setEmail(email);

		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(email)) {
			setEmailValid(true);
		} else {
			setEmailValid(false);
		}
	};

	const handlePassword = (pass) => {
		setErrorMessage("");
		setPassword(pass);

		if (pass.length > 5) {
			setPasswordComplexity(true);
		} else {
			setPasswordComplexity(false);
		}
	};

	const toggleSecureEntry = () => {
		setSecureEntry(!secureEntry);
	};

	return (
		<SafeAreaView style={styles.container}>
			{loading && <Progress.Bar isIndeterminate color="blue" />}

			<View style={styles.fieldsContainer}>
				<Text style={styles.errorMessage}>{errorMessage}</Text>
				<View style={styles.sectionStyle}>
					<Input
						placeholder={I18n.t("email")}
						onChangeText={(text) => {
							handleEmail(text);
						}}
						value={email}
						containerStyle={styles.containerStyle}
						inputContainerStyle={styles.containerInput}
						autoCapitalize="none"
						testID="login.email"
						keyboardType="email-address"
						autoFocus={true}
						leftIcon={{
							type: "ionicon",
							name: "ios-mail",
							color: emailValid === true ? "#007aff" : "grey",
						}}
					/>
				</View>

				<View style={styles.sectionStyle}>
					<Input
						placeholder={I18n.t("password")}
						onChangeText={(text) => {
							handlePassword(text);
						}}
						value={password}
						autoCapitalize="none"
						secureTextEntry={secureEntry}
						containerStyle={styles.containerStyle}
						inputContainerStyle={styles.containerInput}
						testID="login.password"
						leftIcon={{
							type: "ionicon",
							name: "lock-closed",
							color: passwordComplexity === true ? "#007aff" : "grey",
						}}
						rightIcon={{
							type: "ionicon",
							name: "ios-eye-off",
							color: "grey",
							onPress: toggleSecureEntry,
						}}
					/>
				</View>
			</View>

			<Button
				title={I18n.t("login")}
				style={styles.loginButton}
				onPress={() => handleLogin()}
				testID="login.loginButton"
			/>
			<Button
				title={I18n.t("signUp")}
				onPress={() => props.navigation.navigate("signup")}
				testID="login.signupButton"
			/>

			<View>
				<TouchableOpacity onPress={() => props.navigation.navigate("forgetpassword")}>
					<Text style={styles.textAction}>{I18n.t("forgetPassword")}?</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f2f2f2",
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
	errorMessage: {
		color: "red",
		paddingTop: 10,
		textAlign: "center",
	},
	fieldsContainer: {
		paddingHorizontal: 15,
		paddingTop: 15,
	},
	loginButton: {
		backgroundColor: "#007aff",
		color: "white",
	},
	sectionStyle: {
		alignItems: "center",
		borderColor: "#000",
		borderRadius: 5,
		height: 40,
		justifyContent: "center",
		margin: 10,
	},
	textAction: {
		color: "#111111",
		fontSize: 16,
		textAlign: "center",
	},
});
