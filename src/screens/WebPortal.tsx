import React, { Component } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

var WEBVIEW_REF = "webview";

export class WebPortal extends Component {
	constructor(props) {
		super(props);

		var url = "";
		if (this.props.route.params === undefined) {
			url = "https://www.smartcookies.io";
		} else {
			url = this.props.route.params.url;
		}

		//https://connect.ais.com.sg/login/login.aspx?prelogin=https%3a%2f%2fconnect.ais.com.sg%2f&kr=iSAMS:ParentPP

		this.state = {
			url: url,
			status: "No Page Loaded",
			backButtonEnabled: false,
			forwardButtonEnabled: false,
			loading: true,
			cookies: {},
			webViewUrl: "",
		};
	}

	onNavigationStateChange = (navState) => {
		this.setState({ url: navState.url });
	};

	onBack() {
		this.refs[WEBVIEW_REF].goBack();
	}

	reload = () => {
		this.refs[WEBVIEW_REF].reload();
	};

	render() {
		return (
			<View style={styles.flex1}>
				<View style={styles.flex2}>
					<View>
						<TouchableOpacity disabled={!this.state.canGoBack} onPress={this.onBack.bind(this)}>
							<Ionicons style={styles.navIcon} name="ios-arrow-back" />
						</TouchableOpacity>

						<TextInput
							ref="pageURL"
							value={this.state.url}
							placeholderTextColor="#FFF"
							style={styles.url}
							autoCapitalize="none"
							selectionColor="#FFF"
							testID="webPortal.urlField"
						/>

						<Ionicons style={styles.navIcon} name="ios-arrow-forward" />
					</View>

					<WebView
						source={{ uri: this.state.url }}
						javaScriptEnabled={true}
						automaticallyAdjustContentInsets={false}
						onNavigationStateChange={this.onNavigationStateChange.bind(this)}
						domStorageEnabled={true}
						ref={WEBVIEW_REF}
						testID="webPortal.RNCWebView"
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	flex1: { flex: 1 },
	flex2: { flex: 2 },
	navIcon: {
		color: "#FFF",
		fontSize: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},

	url: {
		color: "#FFF",
		fontSize: 14,
	},
});

export default WebPortal;
