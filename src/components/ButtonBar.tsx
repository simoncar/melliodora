
import React, { Component } from "react";
import { TouchableOpacity, Image, View, StyleSheet } from "react-native";
import { Text } from "./sComponent"
import I18n from "../lib/i18n";
import { ScrollView } from "react-native-gesture-handler";

export class ButtonBar extends Component {

	render() {
		return (
			<View style={styles.card}>
				<ScrollView horizontal={true}>
					<View style={styles.row}>
						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("WebPortal", {
								url: "https://iflaapr.org/newsletters",
								title: "Newsletters"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../resources/icons/news.png")} />
							<Text
								style={styles.homeMenuText}>
								{I18n.t("newsletters")}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("WebPortal", {
								url: "https://iflaapr.org/news/listing/design",
								title: "Design News"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../resources/icons/_Design.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("design") + "\n" + I18n.t("design")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("WebPortal", {
								url: "https://iflaapr.org/news/listing/management",
								title: "Management News"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../resources/icons/_Management.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("management") + "\n" + I18n.t("news")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("WebPortal", {
								url: "https://iflaapr.org/news/listing/planning",
								title: "Planning News"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../resources/icons/_Planning.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("planning") + "\n" + I18n.t("news")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("WebPortal", {
								url: "https://iflaapr.org/membership-directory/corporate",
								title: "Directory"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../resources/icons/_Directory.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("directory")}</Text>
						</TouchableOpacity>

					</View>
				</ScrollView>
			</View>
		)
	}
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
	homeMenuIcon: {
		height: 50,
		width: 50
	},
	homeMenuItemContainer: {
		alignItems: "center",
		flexDirection: "column",
		marginRight: 15
	},
	homeMenuText: {
		color: "black",
		fontSize: 12,
		textAlign: "center"
	},
	row: {
		flex: 1,
		flexDirection: "row",
		paddingTop: 10
	},
})