import React, { useEffect, useReducer } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsListItem } from "./SettingsListItem";
import Constants from "expo-constants";
import I18n from "../lib/i18n";
import _ from "lodash";
import { useLoginP, useDomainP, useEmailP, useDisplayNameP, useUidP } from "../lib/globalState";

interface IProps {
	navigation: any;
}

export default function Profile(props: IProps) {
	const [login, ,] = useLoginP();
	const [uid, ,] = useUidP();
	const [displayName, ,] = useDisplayNameP();
	const [email, setEmail, isUpdatedEmail] = useEmailP();
	const [domain, setDomain, isUpdatedDomain] = useDomainP();

	if (Constants.manifest.extra.instance === "sais_edu_sg") {
		return <View />;
	}
	console.log(login);
	if (login === true) {
		const user = {
			firstName: "",
			lastName: "",
			displayName: displayName,
			uid: uid,
			email: email,
		};

		console.log("sending>", user);

		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate("UserProfile", {
							uid: uid,
							user: user,
							permitEdit: true,
							domain: domain,
						});
					}}>
					<View style={styles.titleContainer}>
						<Text style={styles.nameText}>{displayName}</Text>
						<Text style={styles.sectionContentText}>{email}</Text>
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
