
import React, { Component, Dimensions } from "react";
import { FlatList, View, Linking, TouchableOpacity, TouchableHighlight, AsyncStorage, Image, ScrollView, StyleSheet } from "react-native";
import { Container, Content, Text } from "native-base";
import Constants from "expo-constants";
import firebase from "firebase";
import { getLanguageString } from "../global";
import I18n from "../../lib/i18n";
import { logToCalendar } from "../../lib/systemHero";

import ListItem from "./ListItem";
import Analytics from "../../lib/analytics";
import moment from "moment";
import { setUserInfo } from "../../store/auth";
import { connect } from "react-redux";

import DemoData from "../../lib/demoData";

const demo = DemoData;

const bottomLogo = {
	sais_edu_sg: require("../../../images/sais_edu_sg/10yearLogo.png"),
	ais_edu_sg: require("../../../images/ais_edu_sg/ifla-apr.jpeg")
};

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			featureItems: [],
			calendarItems: [],
			balanceItems: [],

		};

		this.loadFromAsyncStorage();
	}

	componentDidMount() {
		this.language = this.props.auth.language;

		this.props.navigation.setParams({
			title: this.props.community.selectedCommunity.name
		});

		global.domain = this.props.community.selectedCommunity.node || global.domain;

		if (global.domain == "oakforest_international_edu") {
			demo.setupDemoData();
			this.loadBalance();
		}

		logToCalendar("AppStarts-" + global.domain, "Startup Count", global.domain, this.props.auth.userInfo.email || "");

		this.feature = firebase.firestore().collection(global.domain).doc("feature").collection("features").orderBy("order");

		Analytics.track("Home");

		this.loadCalendar();

		this.unsubscribeFeature = this.feature.onSnapshot(this.onFeatureUpdate);

		const { navigation } = this.props;
		this.focusListener = navigation.addListener("didFocus", () => {
			// The screen is focused
			// Call any action
			this.loadBalance();
			this.loadCalendar();
		});


	}


	componentDidUpdate() {
		if (this.state.timer === 1) {
			clearInterval(this.interval);
		}
	}

	componentWillUnmount() {
		this.unsubscribeFeature();
		//this.focusListener.remove();
		clearInterval(this.interval);
	}

	loadBalance() {


	}

	// loadBalance() {
	// 	var balanceItems = [];

	// 	let balance = firebase.firestore().collection("sais_edu_sg").doc("user").collection("usernames").doc("Rh9hEJmOyLR12WfflrLCCvvpIWD2").get().then(snapshot => {
	// 		if (!snapshot.exists) {
	// 			return;
	// 		}
	// 		const data = snapshot.data();
	// 		//.push({ campusBalance: data.campusBalance });

	// 		var trans = {
	// 			visible: true,
	// 			source: "balance",
	// 			summaryMyLanguage: "$" + data.campusBalance.toFixed(2),
	// 			summary: "$" + data.campusBalance.toFixed(2),
	// 			summaryEN: "$" + data.campusBalance.toFixed(2),
	// 			color: "red",
	// 			showIconChat: false,
	// 			location: "Cafeteria Account Balance"
	// 		};

	// 		var familyId = data.guid.substring(data.guid.indexOf("iSAMSparents:") + 13, data.guid.indexOf("-"));

	// 		balanceItems.push({ ...{ _key: snapshot.id }, ...data, ...trans });
	// 		if (balanceItems.length > 0) {
	// 			this.setState({
	// 				balanceItems
	// 			});
	// 		}
	// 	});
	// }

	loadCalendar() {
		const todayDate = moment().format("YYYY-MM-DD");

		var calendarItems = [];

		if (global.domain === "sais_edu_sg") {
			var a = moment("2020-08-12");
			var b = moment();
			// =1
			var schoolStarts = a.diff(b, 'days') + 1

			var trans = {
				visible: true,
				source: "calendar",
				summaryMyLanguage: "School Starts In " + schoolStarts + " Days",
				date_start: "2020-08-12",
				color: "red",
				showIconChat: false,
				photo1: "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2F202006%2F7a2af15c-093b-4722-af28-a313a76a6676?alt=media&token=16f5257e-ba70-4906-aa28-48b4c16cf0d5",
				descriptionMyLanguage: "2020/2021 Calendar\n\nhttps://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2F202006%2FPTACalendar.pdf?alt=media&token=9c93542f-1d0d-4d13-bd55-4c22c191d703"
			};
			calendarItems.push({ ...{ _key: "schoolStarts" }, ...trans });
		}

		let calendar = firebase.firestore().collection(global.domain).doc("calendar").collection("calendarItems").where("date_start", "==", todayDate).get().then(snapshot => {
			snapshot.forEach(doc => {
				var trans = {
					visible: true,
					source: "calendar",
					summaryMyLanguage: getLanguageString(this.language, doc.data(), "summary"),
					summary: doc.data().summary,
					summaryEN: doc.data().summary,
					date_start: doc.data().date_start,
					color: "red",
					showIconChat: false,
					descriptionMyLanguage: getLanguageString(this.language, doc.data(), "description"),
					number: doc.data().number
				};
				calendarItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
			});
			if (calendarItems.length > 0) {
				this.setState({
					calendarItems,
					loading: false
				});
			}
			this.setState({
				loading: false
			});
		});

		var trans = {
			visible: true,
			source: "balance",
			summaryMyLanguage: "$56.20",
			summary: "$56.20",
			summaryEN: "$56.20",
			color: "red",
			showIconChat: false,
			location: "Cafeteria Account Balance"
		};

		this.setState({
			balanceItems: trans
		});
	}

	onFeatureUpdate = querySnapshot => {
		var featureItems = [];

		querySnapshot.forEach(doc => {
			var trans = {
				source: "feature",
				summaryMyLanguage: getLanguageString(this.language, doc.data(), "summary"),
				descriptionMyLanguage: getLanguageString(this.language, doc.data(), "description")
			};

			if (!doc.data().visible == false) {
				featureItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
			}
		});

		if (featureItems.length > 0) {
			this._storeData(JSON.stringify(featureItems));
			this.setState({
				featureItems
			});
		}
	};

	_handleOpenWithLinking = sURL => {
		Linking.openURL(sURL);
	};

	keyExtractor = item => item._key;

	setupUser = () => {
		const { communityJoined } = this.props.auth.userInfo;
		if (Array.isArray(communityJoined) && communityJoined.indexOf(global.domain) < 0) {
			const userInfo = {
				...this.props.auth.userInfo,
				communityJoined: [...communityJoined, global.domain]
			};
			this.props.dispatch(setUserInfo(userInfo, true));
		}
	};
	loadFromAsyncStorage() {
		AsyncStorage.multiGet(["featureItems"], (err, stores) => {
			const featureItems = JSON.parse(stores[0][1]);
			this.setState({
				featureItems
			});
		});
	}

	_storeData = async featureItems => {
		try {
			AsyncStorage.setItem("featureItems", featureItems);
		} catch (error) {
			console.log(error);
			// Error saving data
		}
	};

	_renderItem = ({ item }, cardStyle) => {
		return <ListItem navigation={this.props.navigation} item={item} card={true} language={this.language} cardStyle={cardStyle} />;
	};

	_renderItemNoCard = ({ item }) => {
		return <ListItem navigation={this.props.navigation} item={item} card={false} language={this.language} />;
	};
	_renderBalance() {
		if (global.domain === "oakforest_international_edu") {
			return (
				<ListItem navigation={this.props.navigation} item={this.state.balanceItems} card={true} language={this.language} />
			)
		}
	}

	_renderToday() {
		if (this.state.calendarItems.length > 0) {
			return <View style={styles.card}>
				<FlatList data={this.state.calendarItems} keyExtractor={this.keyExtractor} renderItem={this._renderItemNoCard} />
			</View>;
		}
	}

	env() { }

	render() {
		return <Container>
			{(global.administrator || this.props.auth.isAdmin) && <TouchableHighlight style={styles.addButton} underlayColor="#ff7043" onPress={() => {
				this.props.navigation.navigate("Form", { edit: false });
			}}>
				<Text style={styles.adab8ac50ac6d11ea973dcfce83f911da}>+</Text>
			</TouchableHighlight>}
			<Content showsVerticalScrollIndicator={false}>
				{global.domain === "ais_edu_sg" ? <View style={styles.newsContentLine}>
					<ScrollView horizontal={true} bounces={false} contentContainerStyle={{
						paddingHorizontal: 12,
						paddingVertical: 8
					}} style={styles.adab8ac51ac6d11ea973dcfce83f911da} showsHorizontalScrollIndicator={false}>
						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("webportalURL", {
								url: "https://iflaapr.org/newsletters",
								title: "Newsletters"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../../resources/icons/news.png")} />
							<Text style={styles.adab8d360ac6d11ea973dcfce83f911da}>{I18n.t("newsletters")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("webportalURL", {
								url: "https://iflaapr.org/news/listing/design",
								title: "Design News"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../../resources/icons/_Design.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("design") + "\n" + I18n.t("design")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("webportalURL", {
								url: "https://iflaapr.org/news/listing/management",
								title: "Management News"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../../resources/icons/_Management.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("management") + "\n" + I18n.t("news")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("webportalURL", {
								url: "https://iflaapr.org/news/listing/planning",
								title: "Planning News"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../../resources/icons/_Planning.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("planning") + "\n" + I18n.t("news")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer} onPress={() => {
							this.props.navigation.navigate("webportalURL", {
								url: "https://iflaapr.org/membership-directory/corporate",
								title: "Directory"
							});
						}}>
							<Image style={styles.homeMenuIcon} source={require("../../../resources/icons/_Directory.jpeg")} />
							<Text style={styles.homeMenuText}>{I18n.t("directory")}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.homeMenuItemContainer}
						// onPress={() => {
						//   this.props.navigation.navigate("webportalURL", {
						//     url: "https://smartcookies.io/smart-community",
						//     title: "Member Associations",
						//   });
						// }}
						>
							<Image style={styles.homeMenuIcon} source={require("../../../resources/icons/_Associations.png")} />
							<Text style={styles.homeMenuText}>{I18n.t("member") + "\n" + I18n.t("associations")}</Text>
						</TouchableOpacity>
					</ScrollView>
				</View> : null}

				<View style={styles.newsContentLine}>
					{this._renderBalance()}
					{this._renderToday()}

					<FlatList data={this.state.featureItems} keyExtractor={this.keyExtractor} renderItem={item => this._renderItem(item, { borderWidth: 0 })} />
				</View>
				<View style={styles.card}>
					<View style={styles.adab8fa70ac6d11ea973dcfce83f911da}>
						<Image style={styles.tenYearLogo} source={bottomLogo[global.domain] || {
							uri: global.switch_homeLogoURI
						}} />
					</View>
					<View style={styles.adab8fa71ac6d11ea973dcfce83f911da}>
						<TouchableOpacity onPress={() => {
							this._handleOpenWithLinking("https://smartcookies.io/smart-community");
						}} style={styles.adab8fa72ac6d11ea973dcfce83f911da}>
							<Image source={require("../../../images/sais_edu_sg/SCLogo.png")} style={styles.sclogo} />
						</TouchableOpacity>
					</View>
					<View>
						<Text style={styles.version}>{Constants.manifest.revisionId}</Text>
						<Text style={styles.user}>{global.name}</Text>
						<Text style={styles.user}>{global.email}</Text>
						<Text style={styles.user}>{global.uid}</Text>
						<Text style={styles.user}>{this.language}</Text>
					</View>
				</View>
			</Content>
		</Container>;
	}
}

const styles = StyleSheet.create({
	adab8ac50ac6d11ea973dcfce83f911da: {
		color: "white",
		fontSize: 44,
		left: "20%",
		position: "absolute",
		top: "-20%"
	},
	adab8ac51ac6d11ea973dcfce83f911da: {
		backgroundColor: "white",
		marginVertical: 6
	},
	adab8d360ac6d11ea973dcfce83f911da: {
		color: "black",
		fontSize: 12
	},
	adab8fa70ac6d11ea973dcfce83f911da: {
		alignItems: "center",
		marginTop: 70,
		width: "100%"
	},
	adab8fa71ac6d11ea973dcfce83f911da: {
		alignItems: "center",
		marginTop: 100
	},
	adab8fa72ac6d11ea973dcfce83f911da: {
		height: 40,
		width: 40
	},
	addButton: {
		alignItems: "center",
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderRadius: 50 / 2,
		borderWidth: 1,
		bottom: 20,
		height: 50,
		justifyContent: "center",
		position: "absolute",
		right: 20,
		shadowColor: "#000000",
		shadowOffset: {
			height: 1,
			width: 0
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		width: 50,
		zIndex: 1
	},
	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderColor: "lightgray",
		borderRadius: 15,
		borderWidth: 1,
		elevation: 1,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%"
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



	homeMenuText: { color: "black", fontSize: 12, textAlign: "center" },
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

	tenYearLogo: {
		height: 200,
		resizeMode: "contain",
		width: "80%"
	},
	user: {
		alignSelf: "center",
		backgroundColor: "white",
		color: "#666",
		flex: 1,
		flexDirection: "column",
		fontSize: 12,
		paddingBottom: 0,
		paddingTop: 0,
		textAlign: "center"
	},
	version: {
		alignSelf: "center",
		backgroundColor: "white",
		color: "#666",
		flex: 1,
		flexDirection: "column",
		fontSize: 12,
		paddingBottom: 20,
		paddingTop: 0,
		textAlign: "center"
	}
});



const mapStateToProps = state => ({
	auth: state.auth,
	community: state.community
});
export default connect(mapStateToProps)(Home);

