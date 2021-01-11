import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Constants from "expo-constants";
import I18n from "../lib/i18n";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { SettingsListItem, Separator } from "../components/SettingsListItem";
import Profile from "../components/Profile";
import { useDomainP, useDomainNameP, useLanguage, useLogin } from "../lib/globalState";

interface TProps {
	navigation: any;
	route: any;
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
					<Profile navigation={props.navigation} />
				</View>

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

					{Constants.manifest.extra.domain === "" && (
						<SettingsListItem
							lastItem={true}
							hasNavArrow={false}
							icon={<MaterialIcons name="camera-roll" style={styles.imageStyleIcon} />}
							title={I18n.t("changeDomain")}
							onPress={() => changeDomain()}
						/>
					)}


					

				</View>
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
});
