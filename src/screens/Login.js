import React, { Component } from "react";
import { StyleSheet, View, TextInput, SafeAreaView } from "react-native";
import firebase from "firebase";
import _ from "lodash";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "../components/sComponent";
import Loader from "../components/Loader";


export class LoginScreen extends Component {

	state = { email: "", password: "", errorMessage: null, loading: false };

	handleLogin = async () => {
		try {
			this.setState({ loading: true });

			const { email, password } = this.state;
			await firebase.auth().signInWithEmailAndPassword(email, password);
		} catch (error) {
			this.setState({ errorMessage: error.message, loading: false });
		}
	};

	componentDidUpdate(prevProps, prevState) {
		const { userInfo } = this.props.auth;
		if (this.state.loading && userInfo.email == this.state.email && !_.isEmpty(userInfo)) {
			this.setState({ loading: false });
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
			<Text>{this.state.errorMessage}</Text>
			<View style={styles.SectionStyle}>
				<Ionicons name="ios-mail" size={25} color="grey" style={styles.ImageStyle} />
				<TextInput
					style={styles.inputField}
					placeholder="Email Address"
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
					placeholder="Password"
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
						Forgot password?
            </Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity onPress={this.handleLogin} style={styles.button}>
				<Text style={styles.loginText}>Login</Text>
			</TouchableOpacity>



			<TouchableOpacity onPress={() => this.props.navigation.navigate("signup")}>
				<Text style={styles.textAction}>Don't have an account?  Sign Up</Text>
			</TouchableOpacity>
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
	button: {
		alignItems: "center",
		backgroundColor: "#777777",
		borderRadius: 15,
		flexDirection: "row",
		height: 55,
		justifyContent: "center",
		margin: 12
	},
	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10
	},
	inputField: {
		flex: 1,
	},
	loginText: { color: "white", fontSize: 22 },

	textAction: {
		color: "#111111",
		fontSize: 16,
		marginLeft: 30
	}
});


const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(LoginScreen);