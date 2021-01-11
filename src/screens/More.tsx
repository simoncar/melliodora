import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Constants from "expo-constants";
import I18n from "../lib/i18n";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { SettingsListItem, Separator } from "../components/SettingsListItem";
import Profile from "../components/Profile";
import { useDomainP, useDomainNameP, AuthObj, useAdmin } from "../lib/globalState";
import MoreAdmin from "../components/MoreAdmin";

interface TProps {
	navigation: any;
	route: any;
}

export default function Settings(props: TProps) {
	const [domain, domainSetter] = useDomainP();
	const [domainName, domainNameSetter] = useDomainNameP();
	const [admin] = useAdmin();

	const auth = AuthObj();

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
					<Profile navigation={props.navigation} />
				</View>

				{separator(i)}
				<View style={styles.card}>
					<SettingsListItem
						icon={<FontAwesome name="language" style={styles.imageStyleIcon} />}
						title={"Language"}
						titleInfo={auth.language}
						onPress={() =>
							props.navigation.navigate("selectLanguage", {
								language: auth.language,
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

					{Constants.manifest.extra.domain === "" && domain != "" && (
						<SettingsListItem
							lastItem={true}
							hasNavArrow={false}
							icon={<MaterialIcons name="camera-roll" style={styles.imageStyleIcon} />}
							title={I18n.t("changeDomain")}
							onPress={() => changeDomain()}
						/>
					)}
				</View>
				{Constants.manifest.extra.domain === "" && domain != "" && admin === true && (
					<View style={styles.card}>
						<SettingsListItem
							icon={<MaterialIcons name="admin-panel-settings" style={styles.imageStyleIconAdmin} />}
							title={"Admin"}
							subTitle="You are an Administrator"
							hasNavArrow={false}
						/>

						<MoreAdmin navigation={props.navigation} />
					</View>
				)}
			</ScrollView>
		</View>
	);
}

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
	imageStyleIconAdmin: {
		alignSelf: "center",
		color: "green",
		fontSize: 25,
		marginLeft: 15,
		width: 30,
	},
});
