import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "../../components/common/sComponent"
import * as firebase from "firebase";
import { Button, Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";

export default class chatTitle extends Component {
	constructor(props) {
		super(props);

		const { chatroomTitle, chatroom, type, edit, onGoBack } = this.props.route.params;

		this.state = {
			chatroomTitle: chatroomTitle || "",
			chatroom: chatroom,
			type: type,
			errorMsg: "",
			edit: edit,
		};
	}

	_setChatroomTitle(title) {
		this.setState({ chatroomTitle: title });
	}

	async _saveChatroom() {
		try {
			const chatroomTitle = this.state.chatroomTitle.trim();
			const regexPattern = new RegExp("[a-zA-Z0-9s]+$");
			if (chatroomTitle.length < 1 || !regexPattern.test(this.state.chatroomTitle)) {
				throw new Error("Invalid Characters");
			}
			var dict = {
				title: chatroomTitle,
				type: "public",
			};

			if (this.state.edit == true) {
				await firebase.firestore().collection(global.domain).doc("chat").collection("chatrooms").doc(this.state.chatroom).set(dict, { merge: true });
			} else {
				await firebase.firestore().collection(global.domain).doc("chat").collection("chatrooms").add(dict);
			}
			console.log("ChatTitle go back");
			this.props.navigation.goBack(null);
			this.props.navigation.state.params.onGoBack({ title: this.state.chatroomTitle });
		} catch (err) {
			this.setState({ errorMsg: err.message });
		}
	}

	_hideChatroom() {
		var dict = {
			visible: false,
		};
		console.log("hiding");
		firebase.firestore().collection(global.domain).doc("chat").collection("chatrooms").doc(this.props.navigation.getParam("chatroom")).set(dict, { merge: true });

		this.props.navigation.navigate("chatRooms");
	}

	_goback() {
		const { goBack } = this.props.navigation;
		setTimeout(function () {
			goBack();
		}, 1500);
		goBack();
	}

	_closeHideButton() {
		console.log(this.state.type);
		if (["user", "private", "interestGroup"].indexOf(this.state.type) > -1) {
			return <Button icon={<MaterialIcons name="delete" size={25} color="white" />} title="Close/Hide Chat Group" style={styles.button} onPress={() => this._hideChatroom()} />;
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
					inputContainerStyle={{ borderBottomWidth: 0 }}
					containerStyle={styles.containerStyle}
					placeholder={this.state.chatroomTitle}
					value={this.state.chatroomTitle}
				/>

				<View style={{ flexDirection: "column", alignItems: "center", marginTop: 12 }}>
					<TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity={0.5} onPress={() => this._saveChatroom()}>
						<Text style={styles.TextStyle}>{I18n.t("save")}</Text>
					</TouchableOpacity>
				</View>
				{this._closeHideButton()}
			</View>
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
	},
	SubmitButtonStyle: {
		backgroundColor: "#fff",
		height: 50,
		width: 250,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		elevation: 4,
		marginBottom: 30,
	},
	subjectRow: {
		flexDirection: "row",
	},
	title: {
		paddingBottom: 1,
	},
	titleField: {
		height: 40,
		borderColor: "gray",
		borderWidth: 0,
		paddingLeft: 10,
	},
	TextStyle: {
		fontWeight: "bold",
		color: "#000",
	},
	button: {
		paddingTop: 20,
		paddingBottom: 20,
	},
});
