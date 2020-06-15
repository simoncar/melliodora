import React, { Component } from "react";
import { StyleSheet, View, TextInput, Button, SafeAreaView } from "react-native";
import firebase from "firebase";
import _ from "lodash";
import { connect } from "react-redux";
import Loader from "../common/Loader";
import { TouchableOpacity } from "react-native-gesture-handler";
import Svg, { Line, Text as SvgText } from "react-native-svg";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

class LoginScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "Log In",
		};
	};

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
		return (
			<SafeAreaView style={styles.container}>
				<Loader modalVisible={this.state.loading} animationType="fade" />
				<Text>{this.state.errorMessage}</Text>
				<View style={styles.SectionStyle}>
					<Ionicons name="ios-mail" size={25} color="grey" style={styles.ImageStyle} />
					<TextInput
						style={{ flex: 1, fontWeight: "bold" }}
						placeholder="Email Address"
						onChangeText={(text) => this.setState({ email: text })}
						value={this.state.email}
						autoCapitalize="none"
						testID="email"
						keyboardType="email-address"
						autoFocus={true}
						underlineColorAndroid="transparent"
					/>
					<Ionicons name="md-checkmark" size={25} color="grey" style={styles.ImageStyle} />
				</View>

				<View style={styles.SectionStyle}>
					<Ionicons name="ios-lock" size={25} color="grey" style={styles.ImageStyle} />
					<TextInput
						style={{ flex: 1, fontWeight: "bold" }}
						placeholder="Password"
						onChangeText={(text) => this.setState({ password: text })}
						value={this.state.password}
						autoCapitalize="none"
						secureTextEntry={true}
						testID="password"
						underlineColorAndroid="transparent"
					/>
					<Ionicons name="ios-eye-off" size={25} color="grey" style={styles.ImageStyle} />
				</View>

				<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
					<TouchableOpacity
						style={{ marginVertical: 5, marginHorizontal: 10 }}
						onPress={() => this.props.navigation.navigate("forgetpassword")}>
						<Text
							style={{
								color: "#111111",
								fontSize: 16,
							}}>
							Forgot password?
            </Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					onPress={this.handleLogin}
					style={{
						height: 55,
						borderRadius: 15,
						backgroundColor: "#777777",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						margin: 12,
					}}>
					<Text style={{ color: "white", fontSize: 22 }}>Login</Text>
				</TouchableOpacity>

				<View style={{ height: 20, paddingHorizontal: 20, flexDirection: "row" }}>
					<View style={{ height: 12, borderBottomColor: "black", borderBottomWidth: 1, flex: 1, borderBottomColor: "#777777" }}></View>
					<Text style={{ marginHorizontal: 3, fontSize: 18, alignSelf: "center", color: "#777777" }}>or</Text>
					<View style={{ height: 12, borderBottomColor: "black", borderBottomWidth: 1, flex: 1, borderBottomColor: "#777777" }}></View>
				</View>

				<TouchableOpacity
					onPress={() => this.props.navigation.navigate("signup")}
					style={{
						height: 55,
						borderRadius: 15,
						backgroundColor: "#777777",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						margin: 12,
					}}>
					<Text style={{ color: "white", fontSize: 22 }}>Register</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10,
	},

	containerStyle: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "#d2d2d2",
		backgroundColor: "#ffffff",
		marginVertical: 8,
		color: "black",
		fontSize: 18,
		minHeight: 40,
		paddingHorizontal: 12,
	},

	SectionStyle: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderBottomWidth: 2,
		borderColor: "#000",
		height: 40,
		borderRadius: 5,
		margin: 10,
	},

	ImageStyle: {
		padding: 5,
		paddingHorizontal: 15,
	},
});

const mapStateToProps = (state) => ({
	auth: state.auth,
});
export default connect(mapStateToProps)(LoginScreen);
