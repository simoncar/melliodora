
import React, { Component } from "react";
import { StyleSheet, View, Alert, AsyncStorage, TouchableOpacity, ScrollView } from "react-native";
import { isAdmin } from "../lib/global";
import I18n from "../lib/i18n";
import { MaterialIcons, FontAwesome, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Updates from 'expo-updates'
import Analytics from "../lib/analytics";
import _ from "lodash";
import { connect } from "react-redux";
import * as Linking from "expo-linking";
import { SettingsListItem, Separator } from "../components/SettingsListItem";
import FeatureMoreItems from "../components/FeatureMoreItems";
import { Text } from "../components/sComponent"

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
			Analytics.track("Logout");
			Alert.alert("Restarting");
			Updates.reloadAsync();
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
			return <Separator />;
		}
	}

	render() {
		var i = 0;
		return <View style={styles.container}>
			<ScrollView>
				<View style={styles.card}>
					{this._renderUser()}
					<SettingsListItem lastItem={true} icon={<MaterialIcons name="search" style={styles.imageStyleIcon} />} title={I18n.t("searchUsers")} onPress={() => this.props.navigation.navigate("UserSearch")} />
				</View>

				<View style={styles.card}>
					<FeatureMoreItems navigation={this.props.navigation} show="visibleMore" />
				</View>

				{this.separator(i)}
				<View style={styles.card}>
					<SettingsListItem icon={<FontAwesome name="language" style={styles.imageStyleIcon} />} title={"Language"} titleInfo={this.props.auth.language} onPress={() => this.props.navigation.navigate("selectLanguage")} />
					<SettingsListItem icon={<FontAwesome name="lock" style={styles.imageStyleIcon} />} hasNavArrow={true} title={I18n.t("adminAccess")} onPress={() => this.props.navigation.navigate("adminPassword")} />

					{isAdmin(this.props.adminPassword) && <SettingsListItem icon={<FontAwesome name="edit" style={styles.imageStyleIcon} />} title={I18n.t("editor")} onPress={() => this.props.navigation.navigate("Content")} />}

					<SettingsListItem hasNavArrow={false} icon={<MaterialIcons name="info-outline" style={styles.imageStyleIcon} />} title={I18n.t("aboutThisApp")} onPress={() => {
						Linking.openURL("https://smartcookies.io/smart-community");
					}} />
					<SettingsListItem lastItem={true} hasNavArrow={false} icon={<SimpleLineIcons name="logout" style={styles.imageStyleIcon} />} title={I18n.t("logout")} onPress={() => this._logout()} />
				</View>
			</ScrollView>
		</View>;
	}
	toggleAuthView() {
		this.setState({ toggleAuthView: !this.state.toggleAuthView });
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

	container: { backgroundColor: "#EFEFF4", flex: 1, marginTop: 10 },
	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
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