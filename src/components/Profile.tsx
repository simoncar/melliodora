import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsListItem } from "./SettingsListItem";
import Constants from "expo-constants";
import I18n from "../lib/i18n";
import _ from "lodash";

interface IProps {
	auth: any,
	navigation: any,
}

export default function Profile(props: IProps) {

	if (Constants.manifest.extra.instance === "sais_edu_sg") {
		return <View />
	}

	const user = props.auth.userInfo;


	if (_.has(user, "email") && user.email) {
		const email = user.email;
		return <TouchableOpacity onPress={() => {
			props.navigation.navigate("UserProfile", {
				uid: user.uid,
				user: user,
				permitEdit: true
			})
		}
		}>
			<View style={styles.titleContainer}>
				<Text style={styles.nameText} >
					{I18n.t("loggedInAs")}
				</Text>
				<Text style={styles.sectionContentText} >
					{email}
				</Text>
			</View>
		</TouchableOpacity>;
	} else {
		return <View>
			<SettingsListItem
				hasNavArrow={true}
				icon={<MaterialCommunityIcons
					name="account-plus"
					style={styles.imageStyleIcon} />}
				title={I18n.t("signIn")}
				onPress={() => props.navigation.navigate("login")}
				lastItem={true}
			/>
			<SettingsListItem
				hasNavArrow={true}
				icon={<MaterialCommunityIcons
					name="account-plus"
					style={styles.imageStyleIcon} />}
				title={I18n.t("signUp")}
				onPress={() => props.navigation.navigate("signup")}
				lastItem={true}
			/></View>
	}

}

const styles = StyleSheet.create({

	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		width: 30
	},

	nameText: {
		fontSize: 18,
		fontWeight: "600"
	},

	sectionContentText: {
		color: "#808080",
		fontSize: 14
	},

	titleContainer: {
		backgroundColor: "#ffffff80",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	},

});

