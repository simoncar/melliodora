import React, { Component } from "react";
import { View, Linking, TouchableOpacity, TouchableHighlight, Image, ScrollView, StyleSheet } from "react-native";
import Constants from "expo-constants";
import firebase from "firebase";
import AsyncStorage from '@react-native-community/async-storage';
import { getLanguageString } from "../lib/global";
import ListItem from "../components/StoryListItem";
import moment from "moment";
import { setUserInfo } from "../store/auth";
import { connect } from "react-redux";
import { Text, ShortList } from "../components/sComponent"
import { ButtonBar } from "../components/ButtonBar"
import VersionCheck from "../lib/versionCheck";
import DemoData from "../lib/demoData";
import { actionAdd } from "../components/StoryActions"


const versionCheck = new VersionCheck();

const demo = DemoData;

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			featureItems: [],
			calendarItems: [],
			balanceItems: [],
			appUpdateMessage: "none",
		};

		this.loadFromAsyncStorage();
	}

	componentDidMount() {
		this.language = this.props.auth.language;

		this.props.navigation.setParams({
			title: this.props.community.selectedCommunity.name
		});

		global.domain = this.props.community.selectedCommunity.node || global.domain;
		//this.props.dispatch(processSelectedCommunity(global.domain));

		if (global.domain == "oakforest_international_edu") {
			demo.setupDemoData();
		}

		this.feature = firebase
			.firestore()
			.collection(global.domain)
			.doc("feature")
			.collection("features")
			.orderBy("order");

		this.loadCalendar();

		this.unsubscribeFeature = this.feature.onSnapshot(this.onFeatureUpdate);

		const { navigation } = this.props;
		this.focusListener = navigation.addListener("didFocus", () => {
			this.loadCalendar();
		});

		versionCheck.lookupAppStoreVersion((updateType) => {

			switch (updateType) {
				case "none":
					//you are all up to date
					this.setState({ appUpdateMessage: "none" });
					break;
				case "googlePlay":
					this.setState({ appUpdateMessage: "googlePlay" });
					break;
				case "appleAppStore":
					this.setState({ appUpdateMessage: "appleAppStore" });
					break;
				case "codePushReload":
					this.setState({ appUpdateMessage: "codePushReload" });
					break;
			}
		});
	}

	componentDidUpdate() {
		if (this.state.timer === 1) {
			clearInterval(this.interval);
		}
	}

	componentWillUnmount() {
		this.unsubscribeFeature();
		clearInterval(this.interval);
	}
	updateMessage() {
		if (this.state.appUpdateMessage != "none") {
			return versionCheck.updateMessage(this.state.appUpdateMessage);
		}
	}


	loadCalendar() {
		const todayDate = moment().format("YYYY-MM-DD");

		var calendarItems = [];

		firebase
			.firestore()
			.collection(global.domain)
			.doc("calendar")
			.collection("calendarItems")
			.where("date_start", "==", todayDate)
			.get()
			.then(snapshot => {
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

	_renderItem(navigation, item) {
		return <ListItem
			key={item._key}
			navigation={navigation}
			story={item}
			card={true}
			language={this.language} />
	}

	_renderItemNoCard(navigation, item) {
		return <ListItem
			key={item._key}
			navigation={navigation}
			story={item}
			card={false}
			language={this.language}
		/>;
	}
	_renderBalance() {
		if (global.domain === "oakforest_international_edu") {
			return (
				<ListItem navigation={this.props.navigation} story={this.state.balanceItems} card={true} language={this.language} />
			)
		}
	}

	_renderToday() {
		if (this.state.calendarItems.length > 0) {
			return <View style={styles.card}>
				<ShortList navigation={this.props.navigation} data={this.state.calendarItems} keyExtractor={this.keyExtractor} renderItem={this._renderItemNoCard} />
			</View>;
		}
	}
	isTrue(val) {
		if (val === true) return "true"
	}

	env() { }

	render() {
		return <View style={styles.container}>
			{(this.props.auth.isAdmin === true) &&
				actionAdd(this.props.navigation, this.refreshFunction)

			}

			{(global.domain === "ais_edu_sg") && <ButtonBar navigation={this.props.navigation} />}
			<ScrollView>
				<View style={styles.newsContentLine}>
					{this._renderBalance()}
					{this._renderToday()}

					<ShortList
						navigation={this.props.navigation}
						data={this.state.featureItems}
						keyExtractor={this.keyExtractor}
						renderItem={this._renderItem} />
				</View>
				<View style={styles.card}>

					<View style={styles.cookiesLogoView}>
						<TouchableOpacity onPress={() => {
							this._handleOpenWithLinking("https://smartcookies.io/smart-community");
						}}>
							<Image source={require("../../images/sais_edu_sg/SCLogo.png")} style={styles.sclogo} />
						</TouchableOpacity>
					</View>

					{this.updateMessage()}

					<View style={styles.userDiagnostics} >
						<Text style={styles.version}>{Constants.manifest.revisionId}</Text>
						<Text style={styles.version}>{Constants.manifest.version}</Text>
						<Text style={styles.user}>{global.name}</Text>
						<Text style={styles.user}>{global.email}</Text>
						<Text style={styles.user}>{global.uid}</Text>
						<Text style={styles.user}>{this.language}</Text>
					</View>
				</View>
			</ScrollView>

		</View>
	}
}

const styles = StyleSheet.create({

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
			width: 0,
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		width: 50,
		zIndex: 990,
	},
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
		marginTop: 10
	},
	cookiesLogoView: {
		alignItems: "center",
		marginTop: 100
	},

	editIcon: {
		color: "white",
		fontSize: 44,
		left: "20%",
		position: "absolute",
		top: "-20%"
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
		paddingBottom: 30,
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



const mapStateToProps = state => ({
	auth: state.auth,
	community: state.community
});
export default connect(mapStateToProps)(Home);

