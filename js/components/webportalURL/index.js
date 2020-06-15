import React, { Component } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import Analytics from "../../lib/analytics";
var WEBVIEW_REF = "webview";

class WebportalSports extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam("title"),
		headerBackTitle: null,
	});

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		Analytics.track("Web Portal", { url: this.props.url });
	}

	state = {
		url: this.props.route.params.url,
		status: "No Page Loaded",
		backButtonEnabled: false,
		forwardButtonEnabled: false,
		loading: true,
		cookies: {},
		webViewUrl: "",
	};

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
			<View>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 2 }}>
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
							startInLoadingState={true}
							ref={WEBVIEW_REF}
						/>
					</View>
				</View>
			</View>
		);
	}
}

export default WebportalSports;
