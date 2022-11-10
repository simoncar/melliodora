import React, { useState, useEffect } from "react";
import { View, Linking, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions, TouchableHighlight } from "react-native";
import Constants from "expo-constants";
import ListItem from "../components/StoryListItem";
import { Text, ShortList } from "../components/sComponent";
import VersionCheck from "../lib/versionCheck";
import DemoData from "../lib/demoData";
import { useAdmin, AuthObj, DomainObj } from "../lib/globalState";
import { getStories } from "../lib/APIStory";
import { getCalendarToday } from "../lib/APICalendar";
import { Ionicons, Entypo } from "@expo/vector-icons";
import I18n from "../lib/i18n";

const versionCheck = new VersionCheck();
const WINDOW_WIDTH = Dimensions.get("window").width;
const demo = DemoData;

interface TProps {
	navigation: any;
}

export default function Home(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [featureItems, setFeatureItems] = useState([]);
	const [calendarItems, setCalendarItems] = useState([]);

	const [admin] = useAdmin();

	const auth = AuthObj();
	const domain = DomainObj();

	const storyRead = (stories) => {
		setFeatureItems(stories);
		setLoading(false);
	};

	const calendarRead = (calendarItems) => {
		setCalendarItems(calendarItems);
		setLoading(false);
	};

	useEffect(() => {
		console.log("AAAAA" + JSON.stringify(domain));

		props.navigation.setOptions({
			headerTitle: domain.name
		});

		if (domain.node === "oakforest_international_edu") {
			demo.setupDemoData();
		}

		const unsubscribeStory = getStories(domain.node, auth.language, storyRead);
		const unsubscribeCalendar = getCalendarToday(domain.node, auth.language, calendarRead);

		// loadCalendar();

		// this.unsubscribeFeature = this.feature.onSnapshot(this.onFeatureUpdate);

		// const { navigation } = this.props;
		// this.focusListener = navigation.addListener("didFocus", () => {
		// 	this.loadCalendar();
		// });

		// versionCheck.lookupAppStoreVersion((updateType) => {
		// 	switch (updateType) {
		// 		case "none":
		// 			//you are all up to date
		// 			this.setState({ appUpdateMessage: "none" });
		// 			break;
		// 		case "googlePlay":
		// 			this.setState({ appUpdateMessage: "googlePlay" });
		// 			break;
		// 		case "appleAppStore":
		// 			this.setState({ appUpdateMessage: "appleAppStore" });
		// 			break;
		// 		case "codePushReload":
		// 			this.setState({ appUpdateMessage: "codePushReload" });
		// 			break;
		// 	}
		// });

		return () => {
			unsubscribeStory;
			unsubscribeCalendar;
		};
	}, []);

	useEffect(() => {
		console.log("BBBB" + domain);

		props.navigation.setOptions({
			headerTitle: domain.name
		});

		const unsubscribe = getStories(domain.node, auth.language, storyRead);

		return () => {
			unsubscribe;
		};
	}, [domain.node, auth.language]);

	const handleOpenWithLinking = (sURL) => {
		Linking.openURL(sURL);
	};

	const renderItem = (navigation, item) => {
		if (item.visible === true) return <ListItem key={item.key} navigation={navigation} story={item} card={true} language={auth.language} domain={domain.node} admin={admin} />;
	};

	const renderItemNoCard = (navigation, item) => {
		return <ListItem key={item.key} navigation={navigation} story={item} card={false} language={auth.language} domain={domain.node} admin={admin} />;
	};

	const renderToday = () => {
		if (calendarItems.length > 0) {
			return (
				<View style={styles.card}>
					<ShortList navigation={props.navigation} data={calendarItems} renderItem={renderItemNoCard} />
				</View>
			);
		}
	};

	const addNew = () => {
		if (admin) {
			return (
				<TouchableHighlight
					key="rightSideShare"
					style={styles.button}
					testID="story.shareButton"
					onPress={() => {
						props.navigation.navigate("Form", {
							edit: false,
							domain: domain
						});
					}}>
					<View style={styles.buttonView}>
						<Entypo testID="story.addNew" name="plus" style={styles.buttonText} />
						<Text style={styles.buttonText}>{I18n.t("addPolo")}</Text>
					</View>
				</TouchableHighlight>
			);
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.newsContentLine}>
					{renderToday()}

					<ShortList navigation={props.navigation} data={featureItems} renderItem={renderItem} />
				</View>

				<View style={styles.card}>
					<View style={styles.cookiesLogoView}>
						<TouchableOpacity
							onPress={() => {
								handleOpenWithLinking("https://smartcookies.io/smart-community");
							}}>
							<Image source={require("../../images/sais_edu_sg/SCLogo.png")} style={styles.sclogo} />
						</TouchableOpacity>
					</View>

					<View style={styles.userDiagnostics}>
						<Text style={styles.version}>{Constants.manifest.revisionId}</Text>
						<Text style={styles.version}>{Constants.manifest.version}</Text>
						<Text style={styles.user}>{auth.displayName}</Text>
						<Text style={styles.user}>{auth.email}</Text>
						<Text style={styles.user}>{auth.uid}</Text>
						<Text style={styles.user}>{auth.language}</Text>
					</View>
				</View>
			</ScrollView>
			{addNew()}
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "#25A456",
		borderRadius: 50 / 2,
		bottom: 30,
		height: 40,
		position: "absolute",
		width: 150,
		zIndex: 990
	},
	buttonText: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
		marginRight: 5
	},
	buttonView: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},

	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		paddingLeft: 5,
		width: "97%"
	},
	cardAddNew: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		marginTop: 10,
		paddingLeft: 5,
		width: "97%"
	},
	container: {
		backgroundColor: "#EFEFF4",
		flex: 1
	},

	cookiesLogoView: {
		alignItems: "center",
		marginTop: 100
	},
	headerIcon: { width: 60 },
	headerRightIcons: {
		flexDirection: "row-reverse",
		marginLeft: 5
	},
	headerRow: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		width: WINDOW_WIDTH - 35
	},
	headerTextPanel: { flex: 1, marginLeft: 5, width: "100%" },
	icon: {
		marginLeft: 15,
		marginRight: 5
	},
	iconPhoto: {
		alignItems: "center",
		borderColor: "lightgray",
		borderRadius: 18,
		borderWidth: StyleSheet.hairlineWidth,
		height: 36,
		justifyContent: "center",
		left: 6,
		margin: 12,
		width: 36
	},
	newsContentLine: {
		backgroundColor: "#f2f2f2",
		paddingTop: 10
	},
	sclogo: {
		alignSelf: "center",
		borderTopWidth: 1,
		height: 40,
		width: 40
	},
	user: {
		alignSelf: "center",
		backgroundColor: "white",
		color: "#666",
		flex: 1,
		flexDirection: "column",
		fontSize: 12,
		textAlign: "center"
	},
	userDiagnostics: {
		paddingBottom: 30
	},
	version: {
		alignSelf: "center",
		backgroundColor: "white",
		color: "#666",
		flex: 1,
		flexDirection: "column",
		fontSize: 12,
		textAlign: "center"
	}
});
