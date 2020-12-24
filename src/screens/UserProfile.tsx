import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import firebase from "firebase";
import { Text, Button } from "../components/sComponent";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import I18n from "../lib/i18n";

interface IProps {
	user: any;
	navigation: any;
	route: any;
	permitEdit: boolean;
	uid: string;
	domain: string;
}

export default function UserProfile(props: IProps) {
	const [user, setUser] = useState(props.route.params.user);

	console.log("props.user:", user);

	const refreshFunction = (data) => {
		const oldUser = props.user;
		const newUser = {
			...oldUser,
			...data,
		};

		setUser(newUser);
	};

	const edit = () => {
		props.navigation.navigate("EditUserProfile", {
			user,
			//refreshFunction: refreshFunction.bind(),
		});
	};

	const logout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log("signed out");
				props.navigation.popToTop();
			});
	};

	const renderProfilePic = () => {
		const width = 128;
		const photoURL = user && user.photoURL;

		return (
			<TouchableOpacity
				onPress={() => {
					edit();
				}}>
				<View style={styles.profilePicContainer}>
					{photoURL ? (
						<Image style={styles.profilePhoto} source={{ uri: photoURL }} />
					) : (
						<Ionicons name="ios-person" size={width * 0.85} color="grey" style={styles.profilePhotoNone} />
					)}
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView>
			<ScrollView>
				{renderProfilePic()}

				<View style={styles.titleContainer}>
					<Text style={styles.nameText}>
						{user.firstName} {user.lastName}
					</Text>
					<Text style={styles.emailText}>{user.email}</Text>
				</View>
				<Button onPress={() => logout()} title={I18n.t("logout")} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	emailText: {
		color: "black",
		fontSize: 13,
		textAlign: "center",
	},

	nameText: {
		color: "black",
		fontSize: 25,
		fontWeight: "bold",
		textAlign: "center",
	},
	profilePhoto: {
		borderColor: "lightgray",
		borderRadius: 150 / 2,
		borderWidth: StyleSheet.hairlineWidth,
		height: 150,
		overflow: "hidden",
		width: 150,
	},

	profilePhotoNone: {
		borderColor: "grey",
		borderRadius: 150 / 2,
		borderWidth: StyleSheet.hairlineWidth,
		height: 150,
		overflow: "hidden",
		textAlign: "center",
		width: 150,
	},
	profilePicContainer: {
		alignItems: "center",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,
	},

	titleContainer: {
		backgroundColor: "#fdfdfd",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,
	},
});
