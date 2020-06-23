
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { SettingsListItem } from "../components/SettingsListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import { Text } from "../components/sComponent";
import Analytics from "../lib/analytics";
import { connect } from "react-redux";
import { changeLanguage } from "../store/auth";

export class SelectLanguage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			switchValue: false,
			language: ""
		};

	}

	componentDidMount() {
		this._retrieveLanguage();
		Analytics.track("Language");
	}

	_retrieveLanguage = () => {
		const value = this.props.auth.language;
		if (value != null) {
			this.setState({ language: value });
		}
	};

	_changeLanguage(language) {
		this.setState({ language: language });
		this.props.dispatch(changeLanguage(language));
	}
	_getStyle(language) {
		if (language == this.state.language) {
			return styles.imageStyleCheckOn;
		} else {
			return styles.imageStyleCheckOff;
		}
	}

	render() {
		return <View style={styles.languageView}>
			<SettingsListItem hasSwitch={false} hasNavArrow={false} title="English" onPress={() => this._changeLanguage("en")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("en")} />} />
			<SettingsListItem hasSwitch={false} hasNavArrow={false} title="中文(简体)" onPress={() => this._changeLanguage("zh")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("zh")} />} />
			<SettingsListItem hasSwitch={false} hasNavArrow={false} title="日本語" onPress={() => this._changeLanguage("ja")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("ja")} />} />
			<SettingsListItem hasSwitch={false} hasNavArrow={false} title="Français" onPress={() => this._changeLanguage("fr")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("fr")} />} />
			<SettingsListItem hasSwitch={false} hasNavArrow={false} title="한국어" onPress={() => this._changeLanguage("ko")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("ko")} />} />
			<SettingsListItem hasSwitch={false} hasNavArrow={false} title="Español" onPress={() => this._changeLanguage("es")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("es")} />} />
			<SettingsListItem hasSwitch={false} hasNavArrow={false} title="bahasa Indonesia" onPress={() => this._changeLanguage("id")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("id")} />} />
			<Text style={styles.titleInfoStyle}>{I18n.t("languageChangeWarning")}</Text>
		</View>;
	}

}

const styles = StyleSheet.create({
	imageStyleCheckOff: {
		alignSelf: "center",
		color: "#FFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	},

	imageStyleCheckOn: {
		alignSelf: "center",
		color: "#007AFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	},
	languageView: { backgroundColor: "#EFEFF4", flex: 1 },

	titleInfoStyle: {
		alignSelf: "center",
		color: "#8e8e93",
		fontSize: 16,
		marginLeft: 10,
		marginTop: 20
	}
});


const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(SelectLanguage);