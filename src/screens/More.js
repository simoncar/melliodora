
import React, { Component } from "react";
import { Image, StyleSheet, View, Alert, AsyncStorage, TouchableHighlight, TouchableOpacity } from "react-native";
import { isAdmin } from "../lib/global";
import I18n from "../lib/i18n";
import { MaterialIcons, FontAwesome, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Updates } from "expo";
import FeatureMoreItems from "../components/settings/FeatureMoreItems";

import Analytics from "../lib/analytics";
import _ from "lodash";
import { connect } from "react-redux";
import * as Linking from "expo-linking";

import { SettingsListItem, Separator } from "../components/settings/SettingsListItem";
import { Text } from "../components/common/sComponent"

class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null
		};
	}

	componentDidMount() {
		Analytics.track("More");
	}

	_logout() {
		AsyncStorage.clear().then(() => {
			global = {};
			Analytics.track("Logout");

			Alert.alert("Restarting");
			Updates.reloadFromCache();
		});
	}

	_renderUser() {
		const user = this.props.auth.userInfo;
		if (_.has(user, "email") && user.email) {
			const email = user.email;
			return <TouchableOpacity onPress={() => this.props.navigation.navigate("UserProfile", {
				uid: user.uid,
				permitEdit: true
			})}>
				<View style={styles.titleContainer}>
					<Text style={styles.nameText} numberOfLines={1}>
						{I18n.t("loggedInAs")}
					</Text>
					<Text style={styles.sectionContentText} numberOfLines={1}>
						{email}
					</Text>
				</View>
			</TouchableOpacity>;
		} else {
			return <SettingsListItem hasNavArrow={false} icon={<MaterialCommunityIcons name="account-plus" style={styles.imageStyleIcon} />} title={I18n.t("signIn") + " / " + I18n.t("signUp")} onPress={() => this.props.navigation.navigate("login")} />;
		}
	}

	separator(i) {
		if (i > 0) {
			console.log("separator = ", i);
			return <Separator />;
		}
	}

	render() {
		var i = 0;
		const features = this.props.settings.features ? this.props.settings.features : [];
		return <View style={styles.adminEditView}>
			{(global.administrator || this.props.auth.isAdmin) && <TouchableHighlight style={styles.adminButton} underlayColor="#ff7043" onPress={() => this.props.navigation.navigate("moreAdmin", {
				moreFeatures: this.state.features
			})}>
				<MaterialIcons name="edit" style={styles.adminEditButton} />
			</TouchableHighlight>}
			<Text></Text>
			{this._renderUser()}
			<SettingsListItem icon={<MaterialIcons name="search" style={styles.imageStyleIcon} />} title={I18n.t("searchUsers")} onPress={() => this.props.navigation.navigate("UserSearch")} />

			<FeatureMoreItems navigation={this.props.navigation} show="visibleMore" />

			{features.filter(item => item.visible !== false).map((el, idx) => {
				i++;
				const navTitle = el.navTitle || el.title;
				const navProps = el.navURL ? {
					url: el.navURL,
					title: I18n.t(navTitle, { defaultValue: navTitle })
				} : {};

				const imgSource = el.icon ? icons[el.icon] : icons["wifi"];
				return <SettingsListItem key={"feature" + idx} icon={<Image style={styles.imageStyle} source={imgSource} />} title={I18n.t(el.title || "", {
					defaultValue: el.title || ""
				})} titleInfo={el.titleInfo || ""} onPress={() => this.props.navigation.navigate(el.navigate || "WebPortal", navProps)} />;
			})}

			{this.separator(i)}

			<SettingsListItem icon={<FontAwesome name="language" style={styles.imageStyleIcon} />} title={"Language"} titleInfo={this.props.auth.language} onPress={() => this.props.navigation.navigate("selectLanguage")} />
			<SettingsListItem icon={<FontAwesome name="lock" style={styles.imageStyleIcon} />} hasNavArrow={true} title={I18n.t("adminAccess")} onPress={() => this.props.navigation.navigate("adminPassword")} />

			{isAdmin(this.props.adminPassword) && <SettingsListItem icon={<FontAwesome name="edit" style={styles.imageStyleIcon} />} title={I18n.t("editor")} onPress={() => this.props.navigation.navigate("Content")} />}

			<SettingsListItem hasNavArrow={false} icon={<MaterialIcons name="info-outline" style={styles.imageStyleIcon} />} title={I18n.t("aboutThisApp")} onPress={() => {
				Linking.openURL("https://smartcookies.io/smart-community");
			}} />
			<SettingsListItem hasNavArrow={false} icon={<SimpleLineIcons name="logout" style={styles.imageStyleIcon} />} title={I18n.t("logout")} onPress={() => this._logout()} />
		</View>;
	}
	toggleAuthView() {
		this.setState({ toggleAuthView: !this.state.toggleAuthView });
	}
}

const styles = StyleSheet.create({
	adminButton: {
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
	adminEditButton: { color: "white", fontSize: 25 },

	adminEditView: { backgroundColor: "#EFEFF4", flex: 1 },
	imageStyle: {
		alignSelf: "center",
		height: 30,
		marginLeft: 15,
		width: 30
	},

	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		textAlign: "center",
		width: 30
	},
	nameText: {
		fontSize: 18,
		fontWeight: "600"
	},
	sectionContentText: {
		color: "#808080",
		fontSize: 14
	},
	titleContainer: {
		backgroundColor: "#ffffff80",
		paddingBottom: 15,
		paddingHorizontal: 15,
		paddingTop: 15
	}
});


const mapStateToProps = state => ({
	settings: state.settings,
	auth: state.auth
});
export default connect(mapStateToProps)(Settings);