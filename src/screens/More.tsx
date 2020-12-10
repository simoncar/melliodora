
import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { isAdmin } from "../lib/global";
import Constants from "expo-constants";
import I18n from "../lib/i18n";
import { MaterialIcons, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import _ from "lodash";
import { connect } from "react-redux";
import * as Linking from "expo-linking";
import { SettingsListItem, Separator } from "../components/SettingsListItem";
import FeatureMoreItems from "../components/FeatureMoreItems";
import Profile from "../components/Profile"
import { processSelectedCommunity } from "../store/community";

interface TProps {

	navigation: any,
	auth: any,
	route: any,
	adminPassword: string,
}
interface TState {
	user: string | null,
}

class Settings extends Component<TProps, TState> {
	constructor(props: TProps) {
		super(props);

		this.state = {
			user: null
		};
	}

	_logout() {
		this.props.dispatch(processSelectedCommunity(null))
	}

	separator(i: number) {
		if (i > 0) {
			return <Separator />;
		}
	}

	render() {
		var i = 0;
		return <View style={styles.container}>
			<ScrollView>
				<View style={styles.card}>
					<Profile
						auth={this.props.auth}
						navigation={this.props.navigation} />
					{Constants.manifest.extra.instance != "sais_edu_sg" &&
						<SettingsListItem
							lastItem={true}
							icon={<MaterialIcons name="search" style={styles.imageStyleIcon} />}
							title={I18n.t("searchUsers")}
							onPress={() => this.props.navigation.navigate("UserSearch")}
						/>
					}
				</View>


				{this.separator(i)}
				<View style={styles.card}>
					<SettingsListItem
						icon={<FontAwesome
							name="language"
							style={styles.imageStyleIcon} />}
						title={"Language"}
						titleInfo={this.props.auth.language}
						onPress={() => this.props.navigation.navigate("selectLanguage")}
					/>



					<SettingsListItem
						hasNavArrow={false}
						icon={<MaterialIcons
							name="info-outline"
							style={styles.imageStyleIcon} />}
						title={I18n.t("aboutThisApp")}
						onPress={() => {
							Linking.openURL("https://smartcookies.io/smart-community");
						}}
					/>
					<SettingsListItem
						lastItem={true}
						hasNavArrow={false}
						icon={<SimpleLineIcons
							name="logout"
							style={styles.imageStyleIcon} />}
						title={I18n.t("changeDomain")}
						onPress={() => this._logout()} />
				</View>

				{this.separator(i)}

				<View style={styles.card}>
					<SettingsListItem
						icon={<FontAwesome
							name="lock"
							style={styles.imageStyleIcon} />}
						hasNavArrow={true}
						title={I18n.t("adminAccess")}
						onPress={() => this.props.navigation.navigate("AdminPassword")}
					/>

					{isAdmin(this.props.adminPassword) &&

						<FeatureMoreItems
							navigation={this.props.navigation}
							language={this.props.auth.language}
						/>

					}
				</View>


			</ScrollView>
		</View>;
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
});

const mapStateToProps = (state: { settings: any; auth: any; }) => ({
	settings: state.settings,
	auth: state.auth
});
export default connect(mapStateToProps)(Settings);