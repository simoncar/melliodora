
import React, { Component } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import I18n from "../lib/i18n";
import firebase from "firebase";
import { Text, Button } from "../components/sComponent";

export default class ForgotPassword extends Component {

	state = { email: "", errorMessage: null };

	handleForgotPassword = () => {
		const { email } = this.state;

		const msg = Alert.alert(I18n.t("passwordForgot"), [{ text: I18n.t("ok"), onPress: () => this.props.navigation.popToTop() }]);
		firebase.auth().sendPasswordResetEmail(email).then(() => msg).catch(error => this.setState({ errorMessage: error.message }));
	};

	render() {
		return <View style={styles.container}>
			<Text>{this.state.errorMessage}</Text>

			<TextInput placeholder={I18n.t("email")} style={styles.containerStyle} onChangeText={text => this.setState({ email: text })} value={this.state.email} autoCapitalize="none" testID="email" keyboardType="email-address" autoFocus={true} />

			<Button title={I18n.t("send")} onPress={this.handleForgotPassword} testID="forgotPassword.submit" />
		</View>;
	}
}

const styles = StyleSheet.create({

	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10
	},


	containerStyle: {
		backgroundColor: "#ffffff",
		borderColor: "#d2d2d2",
		borderRadius: 10,
		borderWidth: 1,
		color: "black",
		fontSize: 18,
		marginVertical: 8,
		minHeight: 40,
		paddingHorizontal: 12
	}
});