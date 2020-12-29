import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { isAdmin } from "../lib/global";
import Constants from "expo-constants";
import I18n from "../lib/i18n";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import { connect } from "react-redux";
import * as Linking from "expo-linking";
import { SettingsListItem, Separator } from "../components/SettingsListItem";
import FeatureMoreItems from "../components/FeatureMoreItems";
import Profile from "../components/Profile";
import { processSelectedCommunity } from "../store/community";
import { useDomainP, useDomainNameP, useLanguage, useLogin } from "../lib/globalState";

interface TProps {
	navigation: any;
	auth: any;
	route: any;
	adminPassword: string;
}

export default function Settings(props: TProps) {
	const [domain, domainSetter, domainIsUpdated] = useDomainP();
	const [domainName, domainNameSetter, domainNameIsUpdated] = useDomainNameP();
	const [refreshLanguage, setLanguage, language, languageIsUpdated] = useLanguage();
	const [, setGLogin, gLogin] = useLogin();

	const changeDomain = () => {
		domainNameSetter("");
		domainSetter(""); //this will trigger a new navigator
	};

	const separator = (i: number) => {
		if (i > 0) {
			return <Separator />;
		}
	};

	var i = 0;
	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.card}>
					{Constants.manifest.extra.instance != "sais_edu_sg" && (
						<Profile auth={props.auth} navigation={props.navigation} />
					)}
				</View>

				{gLogin && (
					<View style={styles.card}>
						<SettingsListItem
							lastItem={true}
							icon={<MaterialIcons name="search" style={styles.imageStyleIcon} />}
							title={I18n.t("searchUsers")}
							onPress={() => props.navigation.navigate("UserSearch", { domain: domain })}
						/>
					</View>
				)}

				{separator(i)}
				<View style={styles.card}>
					<SettingsListItem
						icon={<FontAwesome name="language" style={styles.imageStyleIcon} />}
						title={"Language"}
						titleInfo={language}
						onPress={() =>
							props.navigation.navigate("selectLanguage", {
								language: language,
							})
						}
					/>

					<SettingsListItem
						hasNavArrow={false}
						icon={<MaterialIcons name="info-outline" style={styles.imageStyleIcon} />}
						title={I18n.t("aboutThisApp")}
						onPress={() => {
							Linking.openURL("https://smartcookies.io/smart-community");
						}}
					/>

					{Constants.manifest.extra.instance === "" && (
						<SettingsListItem
							lastItem={true}
							hasNavArrow={false}
							icon={<MaterialIcons name="camera-roll" style={styles.imageStyleIcon} />}
							title={I18n.t("changeDomain")}
							onPress={() => changeDomain()}
						/>
					)}
				</View>

				{separator(i)}

				<View style={styles.card}>
					<SettingsListItem
						icon={<FontAwesome name="lock" style={styles.imageStyleIcon} />}
						hasNavArrow={true}
						title={I18n.t("adminAccess")}
						onPress={() => props.navigation.navigate("AdminPassword")}
					/>
				</View>
			</ScrollView>
		</View>
	);
}

// {
// 	isAdmin(props.adminPassword) && <FeatureMoreItems navigation={props.navigation} language={"en"} />;
// }

const styles = StyleSheet.create({
	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: "95%",
	},

	container: { backgroundColor: "#EFEFF4", flex: 1, marginTop: 10 },
	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		width: 30,
	},
});
