import React, { Component } from "react";
import { I18nManager } from "react-native";
import App from "./App";
import I18n from "./lib/i18n";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import _ from "lodash";
import * as firebase from "firebase";
import "firebase/firestore";

import Firebase from "./lib/firebase";
import AuthStackNavigator from "./AuthStackNavigator";
import Constants from "expo-constants";
import { connect } from "react-redux";
import { getCommunityDetails } from "./store/community";

class Setup extends Component {
	constructor() {
		super();
	}
	state = {
		loading: true,
	};

	componentDidMount() {
		Firebase.initialise().then(() =>
			this.props.dispatch({ type: "FIREBASE_READY" })
		);

		if (Constants.manifest.extra.instance) {
			const node = Constants.manifest.extra.instance;
			this.props.dispatch(getCommunityDetails(node));
		}

		Font.loadAsync({
			SegoeUI: require("../resources/segoe-ui.ttf"),
		}).then(() => this.setState({ loading: false }));

		let language = this.props.auth.language;
		if (language === "ar") {
			I18nManager.forceRTL(true);
		} else {
			I18nManager.forceRTL(false);
		}
		I18n.locale = language;
	}

	render() {
		if (
			this.state.loading ||
			!this.props.auth.userInfo ||
			_.isEmpty(this.props.auth.userInfo) ||
			(_.isEmpty(this.props.community.selectedCommunity) &&
				Constants.manifest.extra.instance)
		) {
			return <AppLoading />;
		} else if (_.isEmpty(this.props.community.selectedCommunity)) {
			return (
				<AuthStackNavigator />
			);
		} else {
			// check if user is admin
			return (
				<App />
			);
		}
	}
}

const mapStateToProps = (state) => ({
	communityCreation: state.communityCreation,
	community: state.community,
	auth: state.auth,
});
export default connect(mapStateToProps)(Setup);
