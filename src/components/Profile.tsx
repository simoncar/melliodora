import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsListItem } from "./SettingsListItem";
import I18n from "../lib/i18n";
import Image from "../components/Imgix";
import { AuthObj, useDomainP } from "../lib/globalState";

interface IProps {
	navigation: any;
}

export default function Profile(props: IProps) {
	const [domain, ,] = useDomainP();
	const auth = AuthObj();
	console.log("auth:", auth);

	if (auth.login === true && auth.email != null) {
		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate("UserProfile", {
							uid: auth.uid,
							user: auth,
							permitEdit: true,
							domain: domain,
						});
					}}>
					<View style={styles.row}>
						<View style={styles.titleContainer}>
							<Text style={styles.nameText}>{auth.displayName}</Text>
							<Text style={styles.sectionContentText}>{auth.email}</Text>
						</View>
						<View>
							<Image style={styles.profilePhoto} source={{ uri: auth.photoURL }} auto={true} />
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	} else {
		return (
			<View>
				<SettingsListItem
					hasNavArrow={true}
					icon={<MaterialCommunityIcons name="account-plus" style={styles.imageStyleIcon} />}
					title={I18n.t("signIn")}
					onPress={() => props.navigation.navigate("login")}
					lastItem={true}
				/>
				<SettingsListItem
					hasNavArrow={true}
					icon={<MaterialCommunityIcons name="account-plus" style={styles.imageStyleIcon} />}
					title={I18n.t("signUp")}
					onPress={() => props.navigation.navigate("signup")}
					lastItem={true}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		width: 30,
	},
	nameText: {
		fontSize: 18,
		fontWeight: "600",
	},

	profilePhoto: {
		alignItems: "center",
		borderColor: "lightgray",
		borderRadius: 30,
		height: 60,
		justifyContent: "center",
		marginRight: 5,
		marginTop: 5,
		width: 60,
	},

	row: { flexDirection: "row", justifyContent: "space-between" },

	sectionContentText: {
		color: "#808080",
		fontSize: 14,
	},
	titleContainer: {
		backgroundColor: "#ffffff80",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15,
	},
});
