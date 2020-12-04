import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ListRenderItemInfo, View as BareView } from 'react-native';
import { MaterialIcons, FontAwesome, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsListItem, Separator } from "./SettingsListItem";
import Constants from "expo-constants";
import I18n from "../lib/i18n";
import _ from "lodash";

interface IProps {
	auth: any
	navigation: any,
}

export default function Profile(props: IProps) {


	if (Constants.manifest.extra.instance != "sais_edu_sg") {
		const user = props.auth.userInfo;
		if (_.has(user, "email") && user.email) {
			const email = user.email;
			return <TouchableOpacity onPress={() => props.navigation.navigate("UserProfile", {
				uid: user.uid,
				permitEdit: true
			})}>
				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						{I18n.t("loggedInAs")}
					</Text>
					<Text style={styles.sectionContentText} numberOfLines={1}>
						{email}
					</Text>
				</View>
			</TouchableOpacity>;
		} else {
			return <SettingsListItem
				hasNavArrow={true}
				icon={<MaterialCommunityIcons
					name="account-plus"
					style={styles.imageStyleIcon} />}
				title={I18n.t("signIn") + " / " + I18n.t("signUp")}
				onPress={() => props.navigation.navigate("login")}
			/>;
		}
	}

}

const styles = StyleSheet.create({
	nameText: {
		fontSize: 18,
		fontWeight: "600"
	},
	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		width: 30
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
	storyPhoto: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		borderColor: "lightgray",
		borderWidth: 1,
		elevation: 1,
		flex: 1,
		height: 200,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%",
	},
	overlay: {
		//...StyleSheet.absoluteFillObject,
		//backgroundColor: 'rgba(255,255,255,0.7)',
		borderColor: "blue",
		margin: 2,
	},
	selectionBorder: {
		borderRadius: 3,
		borderRightWidth: 50,
		flex: 1,
	},
	itemView: {
		flex: 1,
		flexDirection: 'column',
		margin: 1,
	},
	badge: {
		position: 'absolute',
		top: 10,
		left: 10,
	},
	badge2: {
		position: 'absolute',
		top: 10,
		left: 10,
	},

});

