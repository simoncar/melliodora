import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "../components/sComponent";
import * as firebase from "firebase";
import { Button, Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";

export default class ChatTitle extends Component {
	constructor(props) {
		super(props);

		const { chatroom, type, edit, domain } = this.props.route.params;

		this.state = {
			chatroom: chatroom,
			type: type,
			errorMsg: "",
			edit: edit,
			domain: domain,
		};
	}

	_setChatroomTitle(title) {
		this.setState({ chatroom: title });
	}

	async _saveChatroom() {
		try {
			const chatroom = this.state.chatroom.trim();
			const regexPattern = new RegExp("[a-zA-Z0-9s]+$");
			if (chatroom.length < 1 || !regexPattern.test(this.state.chatroom)) {
				throw new Error("Invalid Characters");
			}
			var dict = {
				title: chatroom,
				type: "public",
			};

			if (this.state.edit == true) {
				await firebase
					.firestore()
					.collection(this.state.domain)
					.doc("chat")
					.collection("chatrooms")
					.doc(this.state.chatroom)
					.set(dict, { merge: true });
			} else {
				await firebase.firestore().collection(this.state.domain).doc("chat").collection("chatrooms").add(dict);
			}
			//this.props.route.params.onGoBack({ title: this.state.chatroom });
			this.props.navigation.goBack(null);
		} catch (err) {
			this.setState({ errorMsg: err.message });
		}
	}

	_hideChatroom() {
		var dict = {
			visible: false,
		};
		firebase
			.firestore()
			.collection(this.state.domain)
			.doc("chat")
			.collection("chatrooms")
			.doc(this.props.navigation.getParam("chatroom"))
			.set(dict, { merge: true });

		this.props.navigation.navigate("chatRooms");
	}

	_closeHideButton() {
		if (["user", "private", "interestGroup"].indexOf(this.state.type) > -1) {
			return (
				<Button
					icon={<MaterialIcons name="delete" size={25} color="white" />}
					title="Close/Hide Chat Group"
					style={styles.button}
					onPress={() => this._hideChatroom()}
				/>
			);
		} else {
			return;
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.TextStyle}>{this.state.errorMsg}</Text>
				<Input
					style={styles.titleField}
					onChangeText={(text) => this._setChatroomTitle(text)}
					autoCapitalize="words"
					autoFocus={true}
					inputContainerStyle={styles.inputContainer}
					containerStyle={styles.containerStyle}
					placeholder={I18n.t("groupSubject")}
					value={this.state.chatroom}
				/>

				<View style={styles.saveButtonView}>
					<TouchableOpacity
						style={styles.saveButton}
						activeOpacity={0.5}
						onPress={() => this._saveChatroom()}>
						<Text style={styles.TextStyle}>{I18n.t("save")}</Text>
					</TouchableOpacity>
				</View>
				{this._closeHideButton()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	saveButton: {
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		elevation: 4,
		height: 50,
		justifyContent: "center",
		marginBottom: 30,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		width: 250,
	},
	inputContainer: { borderBottomWidth: 0 },

	TextStyle: {
		color: "#000",
		fontWeight: "bold",
	},
	button: {
		paddingBottom: 20,
		paddingTop: 20,
	},
	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10,
	},

	containerStyle: {
		backgroundColor: "#ffffff",
		borderColor: "#d2d2d2",
		borderRadius: 10,
		borderWidth: 1,
		marginVertical: 8,
	},
	saveButtonView: { alignItems: "center", flexDirection: "column", marginTop: 12 },
	titleField: {
		borderColor: "gray",
		borderWidth: 0,
		height: 40,
		paddingLeft: 10,
	},
});
