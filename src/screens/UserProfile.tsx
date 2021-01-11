import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native";

import { Text } from "../components/sComponent";
import { Ionicons } from "@expo/vector-icons";

import { useDisplayName, useEmail } from "../lib/globalState";

const WINDOW_WIDTH = Dimensions.get("window").width;

interface IProps {
	user: any;
	navigation: any;
	route: any;
	permitEdit: boolean;
	uid: string;
	domain: string;
}

export default function UserProfile(props: IProps) {
	const [user, setUser] = useState({});

	if (user !== props.route.params.user) setUser(props.route.params.user);

	const edit = () => {
		// edit should only be available if the current profile = the logged in user profile
		props.navigation.navigate("EditUserProfile");
	};

	const width = 128;
	const photoURL = user && user.photoURL;
	console.log("user edit profile:", user);

	return (
		<SafeAreaView>
			<ScrollView>
				<TouchableOpacity
					onPress={() => {
						edit();
					}}>
					<View style={styles.profilePicContainer}>
						{photoURL ? (
							<Image style={styles.profilePhoto} source={{ uri: photoURL }} />
						) : (
							<Ionicons
								name="ios-person"
								size={width * 0.85}
								color="grey"
								style={styles.profilePhotoNone}
							/>
						)}
					</View>

					<View style={styles.titleContainer}>
						<Text style={styles.nameText}>{user.displayName}</Text>
						<Text style={styles.emailText}>{user.email}</Text>
					</View>
				</TouchableOpacity>
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
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: WINDOW_WIDTH - 15,
	},
});
