import React, { Component } from "react";
import { StyleSheet, View, TextInput, SafeAreaView } from "react-native";
import firebase from "firebase";
import _ from "lodash";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button } from "../components/sComponent";
import Loader from "../components/Loader";
import I18n from "../lib/i18n";

interface TProps {
	navigation: any
	auth: any
}

interface TState {
	email: string
	password: string
	errorMessage: string | null
	loading: boolean
}


export class LoginScreen extends Component<TProps, TState> {

	constructor(props: Readonly<TProps>) {
		super(props);

		this.state = { email: "", password: "", errorMessage: null, loading: false };
	}

	handleLogin = async () => {
		try {
			this.setState({ loading: true });

			const { email, password } = this.state;
			await firebase.auth().signInWithEmailAndPassword(email, password);
			console.log("signInWithEmailAndPassword:", email, password)
		} catch (error) {
			console.log("Login error:", error)
			this.setState({ errorMessage: error.message, loading: false });
		}
	};

	componentDidUpdate(prevProps, prevState) {
		console.log("Component did update: ")
		console.log("prevProps:", prevProps);
		console.log("prevState:", prevState)

		const { userInfo } = this.props.auth;
		if (this.state.loading && userInfo.email == this.state.email && !_.isEmpty(userInfo)) {
			this.setState({ loading: false });
			console.log
			if (!global.domain || _.has(this.props, "navigation.state.param.toWelcomeScreen")) {
				this.props.navigation.navigate("welcomeScreen");
			} else {
				this.props.navigation.popToTop();
			}
		}
	}

	render() {
		return <SafeAreaView style={styles.container}>
			<Loader modalVisible={this.state.loading} animationType="fade" />
			<Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
			<View style={styles.SectionStyle}>
				<Ionicons name="ios-mail" size={25} color="grey" style={styles.ImageStyle} />
				<TextInput
					style={styles.inputField}
					placeholder={I18n.t("email")}
					onChangeText={text => this.setState({ email: text })}
					value={this.state.email} autoCapitalize="none"
					testID="login.email"
					keyboardType="email-address"
					autoFocus={true}
					underlineColorAndroid="transparent" />

				<Ionicons name="md-checkmark" size={25} color="grey" style={styles.ImageStyle} />
			</View>

			<View style={styles.SectionStyle}>
				<Ionicons name="ios-lock" size={25} color="grey" style={styles.ImageStyle} />
				<TextInput
					style={styles.inputField}
					placeholder={I18n.t("password")}
					onChangeText={text => this.setState({ password: text })}
					value={this.state.password}
					autoCapitalize="none"
					secureTextEntry={true}
					testID="login.password"
					underlineColorAndroid="transparent" />
				<Ionicons name="ios-eye-off" size={25} color="grey" style={styles.ImageStyle} />
			</View>

			<View>
				<TouchableOpacity onPress={() => this.props.navigation.navigate("forgetpassword")}>
					<Text style={styles.textAction}>
						{I18n.t("forgetPassword")}?
            </Text>
				</TouchableOpacity>
			</View>

			<Button title={I18n.t("login")} onPress={this.handleLogin} testID="login.loginButton" />
			<Button title={I18n.t("signUp")} onPress={() => this.props.navigation.navigate("signup")} testID="login.signupButton" />

		</SafeAreaView>;
	}
}

const styles = StyleSheet.create({
	ImageStyle: {
		padding: 5,
		paddingHorizontal: 15
	},
	SectionStyle: {
		alignItems: "center",
		borderBottomWidth: 2,
		borderColor: "#000",
		borderRadius: 5,
		flexDirection: "row",
		height: 40,
		justifyContent: "center",
		margin: 10
	},

	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10
	},
	errorMessage: { color: "red", paddingTop: 10, textAlign: 'center' },
	inputField: {
		flex: 1,
	},


	textAction: {
		color: "#111111",
		fontSize: 16,
		marginLeft: 30
	}
});


const mapStateToProps = (state: { auth: any; }) => ({
	auth: state.auth
});
export default connect(mapStateToProps)(LoginScreen);