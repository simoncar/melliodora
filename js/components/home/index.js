import React, { Component } from "react";
import {
	FlatList,
	View,
	Linking,
	TouchableOpacity,
	TouchableHighlight,
	StyleSheet,
	Dimensions,
	AsyncStorage,
	Image,
	Platform,
	ScrollView,
} from "react-native";
import { Container, Content, Text } from "native-base";
import Constants from "expo-constants";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
import { getLanguageString } from "../global";
import I18n from "../../lib/i18n";
import styles from "./styles";
import systemHero from "../../lib/systemHero";

import ListItem from "./ListItem";
import Analytics from "../../lib/analytics";
import moment from "moment";
import { setUserInfo } from "../../store/auth";
import { connect } from "react-redux";

import DemoData from "../../lib/demoData";

const demo = DemoData;

const bottomLogo = {
	sais_edu_sg: require("../../../images/sais_edu_sg/10yearLogo.png"),
	ais_edu_sg: require("../../../images/ais_edu_sg/ifla-apr.jpeg"),
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

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		let title = "";
		if (params.title) title = params.title;

		let headerTitle = null;
		if (global.domain == "ais_edu_sg") {
			headerTitle = (
				<Image
					source={require("../../../images/ais_edu_sg/ifla-apr.jpeg")}
					style={{ height: 39, resizeMode: "contain" }}
				/>
			);
		}
		return {
			title: title,
			headerTitle: headerTitle,
			headerBackTitle: null,
		};
	};

	componentDidMount() {
		this.language = this.props.auth.language;

		this.props.navigation.setParams({
			title: this.props.community.selectedCommunity.name,
		});

		global.domain = this.props.community.selectedCommunity.node || global.domain;

		if (domain == "oakforest_international_edu") {
			demo.setupDemoData();
		}

		systemHero.logToCalendar(
			"AppStarts-" + global.domain,
			"Startup Count",
			global.domain,
			this.props.auth.userInfo.email || ""
		);

		this.feature = firebase
			.firestore()
			.collection(global.domain)
			.doc("feature")
			.collection("features")
			.orderBy("order");

		Analytics.track("Home");

		this.loadCalendar();

		this.unsubscribeFeature = this.feature.onSnapshot(this.onFeatureUpdate);
		this.loadCalendar();
		const { navigation } = this.props;
		this.focusListener = navigation.addListener("didFocus", () => {
			// The screen is focused
			// Call any action
			this.loadBalance();
			this.loadCalendar();
		});
	}

	componentWillUnmount() {
		this.unsubscribeFeature();
		//this.focusListener.remove();
	}

	loadBalance() {
		var balanceItems = [];

		let balance = firebase
			.firestore()
			.collection("sais_edu_sg")
			.doc("user")
			.collection("usernames")
			.doc("Rh9hEJmOyLR12WfflrLCCvvpIWD2")
			.get()

			.then((snapshot) => {
				if (!snapshot.exists) {
					return;
				}
				const data = snapshot.data();
				//.push({ campusBalance: data.campusBalance });

				var trans = {
					visible: true,
					source: "balance",
					summaryMyLanguage: "$" + data.campusBalance.toFixed(2),
					summary: "$" + data.campusBalance.toFixed(2),
					summaryEN: "$" + data.campusBalance.toFixed(2),
					color: "red",
					showIconChat: false,
					location: "Cafeteria Account Balance",
				};

				var familyId = data.guid.substring(data.guid.indexOf("iSAMSparents:") + 13, data.guid.indexOf("-"));

				balanceItems.push({ ...{ _key: snapshot.id }, ...data, ...trans });
				if (balanceItems.length > 0) {
					this.setState({
						balanceItems,
					});
				}
			});

		// this.setState({
		//   loading: false
		// });
	}

	loadCalendar() {
		const todayDate = moment().format("YYYY-MM-DD");
		//const todayDate = "2020-02-19";

		var calendarItems = [];
		let calendar = firebase
			.firestore()
			.collection(global.domain)
			.doc("calendar")
			.collection("calendarItems")
			// .orderBy("date_start");
			.where("date_start", "==", todayDate)
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					console.log(
						"AAAA:",
						this.language,
						doc.data().summary,
						getLanguageString(this.language, doc.data(), "summaryX")
					);
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
						number: doc.data().number,
					};
					calendarItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
				});
				if (calendarItems.length > 0) {
					this.setState({
						calendarItems,
						loading: false,
					});
				}
				this.setState({
					loading: false,
				});
			});
	}

	onFeatureUpdate = (querySnapshot) => {
		var featureItems = [];

		querySnapshot.forEach((doc) => {
			var trans = {
				source: "feature",
				summaryMyLanguage: getLanguageString(this.language, doc.data(), "summary"),
				descriptionMyLanguage: getLanguageString(this.language, doc.data(), "description"),
			};

			if (!doc.data().visible == false) {
				featureItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
			}
		});

		if (featureItems.length > 0) {
			this._storeData(JSON.stringify(featureItems));
			this.setState({
				featureItems,
			});
		}

		// this.setState({
		//   loading: false
		// });
	};

	_handleOpenWithLinking = (sURL) => {
		Linking.openURL(sURL);
	};

	keyExtractor = (item) => item._key;

	setupUser = () => {
		const { communityJoined } = this.props.auth.userInfo;
		if (Array.isArray(communityJoined) && communityJoined.indexOf(global.domain) < 0) {
			const userInfo = {
				...this.props.auth.userInfo,
				communityJoined: [...communityJoined, global.domain],
			};
			this.props.dispatch(setUserInfo(userInfo, true));
		}

		//check if user is admin
	};
	loadFromAsyncStorage() {
		AsyncStorage.multiGet(["featureItems"], (err, stores) => {
			const featureItems = JSON.parse(stores[0][1]);
			this.setState({
				featureItems,
			});
		});
	}

	_storeData = async (featureItems) => {
		try {
			AsyncStorage.setItem("featureItems", featureItems);
		} catch (error) {
			console.log(error);
			// Error saving data
		}
	};

	_renderItem = ({ item }, cardStyle) => {
		return (
			<ListItem
				navigation={this.props.navigation}
				item={item}
				card={true}
				language={this.language}
				cardStyle={cardStyle}
			/>
		);
	};

	_renderItemNoCard = ({ item }) => {
		return <ListItem navigation={this.props.navigation} item={item} card={false} language={this.language} />;
	};
	_renderBalance() {
		if (global.domain === "oakforest_international_edu") {
			return (
				<FlatList
					data={this.state.balanceItems}
					keyExtractor={this.keyExtractor}
					renderItem={this._renderItem}
				/>
			);
		}
	}

	_renderToday() {
		if (this.state.calendarItems.length > 0) {
			return (
				<View style={styles.card}>
					<FlatList
						data={this.state.calendarItems}
						keyExtractor={this.keyExtractor}
						renderItem={this._renderItemNoCard}
					/>
				</View>
			);
		}
	}

	env() {}

	render() {
		return (
			<Container>
				{(global.administrator || this.props.auth.isAdmin) && (
					<TouchableHighlight
						style={styles.addButton}
						underlayColor="#ff7043"
						onPress={() => {
							this.props.navigation.navigate("Form", { edit: false });
						}}>
						<Text style={{ fontSize: 44, color: "white", position: "absolute", left: "20%", top: "-20%" }}>
							+
						</Text>
					</TouchableHighlight>
				)}
				<Content showsVerticalScrollIndicator={false}>
					{global.domain === "ais_edu_sg" ? (
						<View style={styles.newsContentLine}>
							<ScrollView
								horizontal={true}
								bounces={false}
								contentContainerStyle={{
									paddingHorizontal: 12,

									paddingVertical: 8,
								}}
								style={{ backgroundColor: "white", marginVertical: 6 }}
								showsHorizontalScrollIndicator={false}>
								<TouchableOpacity
									style={styles.homeMenuItemContainer}
									onPress={() => {
										this.props.navigation.navigate("webportalURL", {
											url: "https://iflaapr.org/newsletters",
											title: "Newsletters",
										});
									}}>
									<Image
										style={styles.homeMenuIcon}
										source={require("../../../resources/icons/news.png")}
									/>
									<Text style={{ color: "black", fontSize: 12 }}>{I18n.t("newsletters")}</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.homeMenuItemContainer}
									onPress={() => {
										this.props.navigation.navigate("webportalURL", {
											url: "https://iflaapr.org/news/listing/design",
											title: "Design News",
										});
									}}>
									<Image
										style={styles.homeMenuIcon}
										source={require("../../../resources/icons/_Design.jpeg")}
									/>
									<Text style={styles.homeMenuText}>
										{I18n.t("design") + "\n" + I18n.t("design")}
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.homeMenuItemContainer}
									onPress={() => {
										this.props.navigation.navigate("webportalURL", {
											url: "https://iflaapr.org/news/listing/management",
											title: "Management News",
										});
									}}>
									<Image
										style={styles.homeMenuIcon}
										source={require("../../../resources/icons/_Management.jpeg")}
									/>
									<Text style={styles.homeMenuText}>
										{I18n.t("management") + "\n" + I18n.t("news")}
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.homeMenuItemContainer}
									onPress={() => {
										this.props.navigation.navigate("webportalURL", {
											url: "https://iflaapr.org/news/listing/planning",
											title: "Planning News",
										});
									}}>
									<Image
										style={styles.homeMenuIcon}
										source={require("../../../resources/icons/_Planning.jpeg")}
									/>
									<Text style={styles.homeMenuText}>
										{I18n.t("planning") + "\n" + I18n.t("news")}
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.homeMenuItemContainer}
									onPress={() => {
										this.props.navigation.navigate("webportalURL", {
											url: "https://iflaapr.org/membership-directory/corporate",
											title: "Directory",
										});
									}}>
									<Image
										style={styles.homeMenuIcon}
										source={require("../../../resources/icons/_Directory.jpeg")}
									/>
									<Text style={styles.homeMenuText}>{I18n.t("directory")}</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.homeMenuItemContainer}
									// onPress={() => {
									//   this.props.navigation.navigate("webportalURL", {
									//     url: "https://smartcookies.io/smart-community",
									//     title: "Member Associations",
									//   });
									// }}
								>
									<Image
										style={styles.homeMenuIcon}
										source={require("../../../resources/icons/_Associations.png")}
									/>
									<Text style={styles.homeMenuText}>
										{I18n.t("member") + "\n" + I18n.t("associations")}
									</Text>
								</TouchableOpacity>
							</ScrollView>
						</View>
					) : null}

					<View style={styles.newsContentLine}>
						{this._renderBalance()}
						{this._renderToday()}

						<FlatList
							data={this.state.featureItems}
							keyExtractor={this.keyExtractor}
							renderItem={(item) => this._renderItem(item, { borderWidth: 0 })}
						/>
					</View>
					<View style={styles.card}>
						<View
							style={{
								marginTop: 70,
								alignItems: "center",
								width: "100%",
							}}>
							<Image
								style={styles.tenYearLogo}
								source={
									bottomLogo[global.domain] || {
										uri: global.switch_homeLogoURI,
									}
								}
							/>
						</View>
						<View
							style={{
								marginTop: 100,
								alignItems: "center",
							}}>
							<TouchableOpacity
								onPress={() => {
									this._handleOpenWithLinking("https://smartcookies.io/smart-community");
								}}
								style={{
									width: 40,
									height: 40,
								}}>
								<Image
									source={require("../../../images/sais_edu_sg/SCLogo.png")}
									style={styles.sclogo}
								/>
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
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	community: state.community,
});
export default connect(mapStateToProps)(Home);
