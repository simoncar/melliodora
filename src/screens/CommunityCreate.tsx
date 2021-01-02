import React, { Component } from "react";
import { View, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";

import { Text } from "../components/sComponent";
import firebase from "../lib/firebase";
import Loader from "../components/Loader";
import { processSelectedCommunity } from "../store/community";
import I18n from "../lib/i18n";

export default class CommunityCreate extends Component {
	state = {
		communityName: "",
		kind: "",
		users: "",
		region: "",
		language: "",
		errorMessage: null,
		loading: false,
	};

	_handleCommunityCreation = async () => {
		try {
			this.setState({ loading: true });
			let { communityName } = this.state;

			communityName = communityName.trim();
			const node = "DOMAIN_" + communityName.toLowerCase().split(" ").join("_");

			const dict = {
				name: communityName,
				node,
				admins: [this.props.auth.userInfo.uid],
			};

			const communityRef = firebase.firestore().collection("domains").doc(node);

			const doc = await communityRef.get();

			if (doc.exists) {
				throw new Error("Community name already existed");
			} else {
				await communityRef.set(dict);
				global.domain = node;
				this.props.dispatch(processSelectedCommunity(dict));
			}
			this.setState({ loading: false });
		} catch (error) {
			this.setState({
				errorMessage: error.message,
				loading: false,
			});
		}
	};

	render() {
		return (
			<SafeAreaView style={styles.safeArea}>
				<Loader modalVisible={this.state.loading} animationType="fade" />
				<ScrollView>
					<Text>{this.state.errorMessage}</Text>
					<View style={styles.titleContainer}>
						<Text style={styles.nameText}>{I18n.t("name")}</Text>
						<TextInput
							style={styles.sectionContentText}
							onChangeText={(text) => this.setState({ communityName: text })}
							value={this.state.communityName}
						/>
					</View>

					<View style={styles.button}>
						<TouchableOpacity
							style={styles.submitButton}
							activeOpacity={0.5}
							onPress={this._handleCommunityCreation}>
							<Text>{I18n.t("save")}</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		flexDirection: "column",
		marginTop: 12,
	},
	nameText: {
		color: "black",
		fontSize: 18,
		fontWeight: "600",
	},
	safeArea: { marginTop: 30 },
	sectionContentText: {
		borderBottomWidth: 1,
		borderColor: "#100c08",
		color: "#808080",
		fontSize: 14,
		height: 40,
		width: "80%",
	},
	submitButton: {
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
	titleContainer: {
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,
	},
});
