import React, { Component } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import Analytics from "../lib/analytics";
var WEBVIEW_REF = "webview";

class WebPortal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			url: this.props.route.params.url,
			status: "No Page Loaded",
			backButtonEnabled: false,
			forwardButtonEnabled: false,
			loading: true,
			cookies: {},
			webViewUrl: ""
		};
	}

	componentDidMount() {
		Analytics.track("Web Portal", { url: this.state.url });
	}

	onNavigationStateChange = navState => {
		this.setState({ url: navState.url });
	};

	onBack() {
		this.refs[WEBVIEW_REF].goBack();
	}

	reload = () => {
		this.refs[WEBVIEW_REF].reload();
	};

	render() {

		return <View style={styles.flex1}>
			<View style={styles.flex2}>
				<View style={styles.topbar}>
					<TouchableOpacity disabled={!this.state.canGoBack} onPress={this.onBack.bind(this)}>
						<Ionicons style={styles.navIcon} name="ios-arrow-back" />
					</TouchableOpacity>

					<TextInput ref="pageURL" value={this.state.url} placeholderTextColor="#FFF" style={styles.url} autoCapitalize="none" selectionColor="#FFF" />

					<Ionicons style={styles.navIcon} name="ios-arrow-forward" />
				</View>

				<WebView
					source={{ uri: this.state.url }}
					javaScriptEnabled={true}
					automaticallyAdjustContentInsets={false}
					onNavigationStateChange={this.onNavigationStateChange.bind(this)}
					domStorageEnabled={true}
					ref={WEBVIEW_REF} />
			</View>
		</View>;
	}
}

const styles = StyleSheet.create({
	flex1: { flex: 1 },
	flex2: { flex: 2 },
	navIcon: {
		color: "#FFF",
		fontSize: 20,
		paddingLeft: 10,
		paddingRight: 10
	},
	topbar: {
		alignItems: "center",
		backgroundColor: "grey",
		flexDirection: "row",
		height: 40
	},
	url: {
		color: "#FFF",
		fontSize: 14
	}
});


export default WebPortal;