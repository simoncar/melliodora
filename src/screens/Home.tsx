import React, { useState, useEffect } from "react";
import { View, Linking, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import Constants from "expo-constants";
import firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLanguageString } from "../lib/global";
import ListItem from "../components/StoryListItem";
import moment from "moment";
import { setUserInfo } from "../store/auth";
import { connect } from "react-redux";
import { Text, ShortList } from "../components/sComponent";
import VersionCheck from "../lib/versionCheck";
import DemoData from "../lib/demoData";
import { actionAdd } from "../components/StoryActions";
import { useDomain, useLanguage, useLogin } from "../lib/globalState";
import { getStories } from "../lib/APIStory";

const versionCheck = new VersionCheck();

const demo = DemoData;

interface TProps {
	navigation: any;
}

export default function Home(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [featureItems, setFeatureItems] = useState([]);
	const [calendarItems, setCalendarItems] = useState([]);
	const [balanceItems, setBalanceItems] = useState([]);
	const [appUpdateMessage, setAppUpdateMessage] = useState("none");
	const [refreshDomain, setDomain, domain, domainIsUpdated] = useDomain();
	const [refreshLanguage, setLanguage, language, languageIsUpdated] = useLanguage();
	const [, setGLogin, gLogin] = useLogin();

	useEffect(() => {
		//	loadFromAsyncStorage();

		console.log("domain node:", domain);

		props.navigation.setParams({
			title: domain,
		});

		if (domain == "oakforest_international_edu") {
			demo.setupDemoData();
		}

		getStories(domain, language)
			.then((stories) => {
				setFeatureItems(stories);
				setLoading(false);
			})
			.catch((e) => {
				console.error(e.message);
			});

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
	}, []);

	useEffect(() => {
		getStories(domain, language)
			.then((stories) => {
				setFeatureItems(stories);
				setLoading(false);
			})
			.catch((e) => {
				console.error(e.message);
			});
	}, [domain, language]);

	// loadCalendar() {
	// 	const todayDate = moment().format("YYYY-MM-DD");

	// 	var calendarItems = [];

	// 	firebase
	// 		.firestore()
	// 		.collection(global.domain)
	// 		.doc("calendar")
	// 		.collection("calendarItems")
	// 		.where("date_start", "==", todayDate)
	// 		.get()
	// 		.then((snapshot) => {
	// 			snapshot.forEach((doc) => {
	// 				var trans = {
	// 					visible: true,
	// 					source: "calendar",
	// 					summaryMyLanguage: getLanguageString(
	// 						this.language,
	// 						doc.data(),
	// 						"summary"
	// 					),
	// 					summary: doc.data().summary,
	// 					summaryEN: doc.data().summary,
	// 					date_start: doc.data().date_start,
	// 					color: "red",
	// 					showIconChat: false,
	// 					descriptionMyLanguage: getLanguageString(
	// 						this.language,
	// 						doc.data(),
	// 						"description"
	// 					),
	// 					number: doc.data().number,
	// 				};
	// 				calendarItems.push({
	// 					...{ _key: doc.id },
	// 					...doc.data(),
	// 					...trans,
	// 				});
	// 			});
	// 			if (calendarItems.length > 0) {
	// 				this.setState({
	// 					calendarItems,
	// 					loading: false,
	// 				});
	// 			}
	// 			this.setState({
	// 				loading: false,
	// 			});
	// 		});
	// }

	// onFeatureUpdate = (querySnapshot) => {
	// 	var featureItems = [];

	// 	querySnapshot.forEach((doc) => {
	// 		var trans = {
	// 			source: "feature",
	// 			summaryMyLanguage: getLanguageString(
	// 				this.language,
	// 				doc.data(),
	// 				"summary"
	// 			),
	// 			descriptionMyLanguage: getLanguageString(
	// 				this.language,
	// 				doc.data(),
	// 				"description"
	// 			),
	// 		};

	// 		if (!doc.data().visible == false) {
	// 			featureItems.push({
	// 				...{ _key: doc.id },
	// 				...doc.data(),
	// 				...trans,
	// 			});
	// 		}
	// 	});

	// 	if (featureItems.length > 0) {
	// 		this._storeData(JSON.stringify(featureItems));
	// 		this.setState({
	// 			featureItems,
	// 		});
	// 	}
	// };

	const handleOpenWithLinking = (sURL) => {
		Linking.openURL(sURL);
	};

	const keyExtractor = (item) => item._key;

	// setupUser = () => {
	// 	const { communityJoined } = this.props.auth.userInfo;
	// 	if (
	// 		Array.isArray(communityJoined) &&
	// 		communityJoined.indexOf(global.domain) < 0
	// 	) {
	// 		const userInfo = {
	// 			...this.props.auth.userInfo,
	// 			communityJoined: [...communityJoined, global.domain],
	// 		};
	// 		this.props.dispatch(setUserInfo(userInfo, true));
	// 	}
	// };

	const renderItem = (navigation, item) => {
		return (
			<ListItem
				key={item._key}
				navigation={props.navigation}
				story={item}
				card={true}
				language={language}
				domain={domain}
			/>
		);
	};

	const renderItemNoCard = (item) => {
		return (
			<ListItem
				key={item._key}
				navigation={props.navigation}
				story={item}
				card={false}
				language={language}
				domain={domain}
			/>
		);
	};

	const renderToday = () => {
		if (calendarItems.length > 0) {
			return (
				<View style={styles.card}>
					<ShortList
						navigation={props.navigation}
						data={calendarItems}
						keyExtractor={keyExtractor}
						renderItem={renderItemNoCard}
					/>
				</View>
			);
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.newsContentLine}>
					{renderToday()}
					<Text>Logged In: {gLogin === false ? "False" : "true"}</Text>

					<ShortList
						navigation={props.navigation}
						data={featureItems}
						keyExtractor={keyExtractor}
						renderItem={renderItem}
					/>
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
						<Text style={styles.user}>{global.name}</Text>
						<Text style={styles.user}>{global.email}</Text>
						<Text style={styles.user}>{global.uid}</Text>
						<Text style={styles.user}>{language}</Text>
					</View>
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
	container: {
		backgroundColor: "#EFEFF4",
		flex: 1,
		marginTop: 10,
	},
	cookiesLogoView: {
		alignItems: "center",
		marginTop: 100,
	},

	newsContentLine: {
		backgroundColor: "#f2f2f2",
		paddingTop: 10,
	},
	sclogo: {
		alignSelf: "center",
		borderTopWidth: 1,
		height: 40,
		width: 40,
	},

	user: {
		alignSelf: "center",
		backgroundColor: "white",
		color: "#666",
		flex: 1,
		flexDirection: "column",
		fontSize: 12,
		textAlign: "center",
	},
	userDiagnostics: {
		paddingBottom: 30,
	},
	version: {
		alignSelf: "center",
		backgroundColor: "white",
		color: "#666",
		flex: 1,
		flexDirection: "column",
		fontSize: 12,
		textAlign: "center",
	},
});
