import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { SettingsListItem } from "../components/SettingsListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import { Text } from "../components/sComponent";
import { connect } from "react-redux";

export default function SelectLanguage(props) {
	console.log("SelectLanguage:", props.route.params.language);

	const _getStyle = (language) => {
		if (language === language) {
			language, setLanguageFn;
			return styles.imageStyleCheckOn;
		} else {
			return styles.imageStyleCheckOff;
		}
	};

	const changeLanguage = (newLanguage) => {
		//setLanguageFn(newLanguage)
		props.route.params.setLanguageFn(newLanguage);
		I18n.locale = newLanguage;
		props.navigation.pop();
	};

	const getStyle = (newLanguage) => {
		return null;
	};
	return (
		<SafeAreaView style={styles.adminContainer}>
			<View style={styles.card}>
				<SettingsListItem
					hasSwitch={false}
					hasNavArrow={false}
					title="English"
					onPress={() => changeLanguage("en")}
					icon={<MaterialCommunityIcons name="check" style={getStyle("en")} />}
				/>
				<SettingsListItem
					hasSwitch={false}
					hasNavArrow={false}
					title="中文(简体)"
					onPress={() => changeLanguage("zh")}
					icon={<MaterialCommunityIcons name="check" style={getStyle("zh")} />}
				/>
				<SettingsListItem
					hasSwitch={false}
					hasNavArrow={false}
					title="日本語"
					onPress={() => changeLanguage("ja")}
					icon={<MaterialCommunityIcons name="check" style={getStyle("ja")} />}
				/>
				<SettingsListItem
					hasSwitch={false}
					hasNavArrow={false}
					title="Français"
					onPress={() => changeLanguage("fr")}
					icon={<MaterialCommunityIcons name="check" style={getStyle("fr")} />}
				/>
				<SettingsListItem
					hasSwitch={false}
					hasNavArrow={false}
					title="한국어"
					onPress={() => changeLanguage("ko")}
					icon={<MaterialCommunityIcons name="check" style={getStyle("ko")} />}
				/>
				<SettingsListItem
					hasSwitch={false}
					hasNavArrow={false}
					title="Español"
					onPress={() => changeLanguage("es")}
					icon={<MaterialCommunityIcons name="check" style={getStyle("es")} />}
				/>
				<SettingsListItem
					lastItem={true}
					hasSwitch={false}
					hasNavArrow={false}
					title="bahasa Indonesia"
					onPress={() => changeLanguage("id")}
					icon={<MaterialCommunityIcons name="check" style={getStyle("id")} />}
				/>
			</View>
			<View style={styles.card}>
				<Text style={styles.restartWarning}>{I18n.t("languageChangeWarning")}</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	adminContainer: {
		alignItems: "center",
		flex: 1,
		marginTop: 10,
	},
	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: "95%",
	},
	imageStyleCheckOff: {
		alignSelf: "center",
		color: "#FFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30,
	},
	imageStyleCheckOn: {
		alignSelf: "center",
		color: "#007AFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30,
	},
	restartWarning: {
		alignSelf: "center",
		color: "#8e8e93",
		fontSize: 16,
	},
});
