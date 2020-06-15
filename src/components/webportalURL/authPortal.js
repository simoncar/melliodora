import React, { Component } from "react";
import Constants from "expo-constants";
import { Animated, TextInput, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { connectActionSheet, ActionSheetProvider, ActionSheetOptions } from "@expo/react-native-action-sheet";
//import { withNavigation } from "react-navigation";
import styles from "./styles";
import { MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import AuthParser from "./authParser";
import _ from "lodash";
import Analytics from "../../lib/analytics";
import { connect } from "react-redux";
import { compose } from "redux";
import { saveDetails } from "../../store/authPortal";
import { Text } from "../../components/common/sComponent"

const timer = require("react-native-timer");

const tabBarIcon = (name) => ({ tintColor }) => <MaterialIcons style={{ backgroundColor: "transparent" }} name={name} color={tintColor} size={24} />;

class authPortal extends Component {
	constructor(props) {
		super(props);

		//console.log(this.props.route.params.url);

		if (_.isNil(this.props.route.params && this.props.route.params.url)) {
			var url = global.switch_portalURL;
		} else {
			var url = this.props.route.params.url;
		}

		console.log("PROPS: ", this.props);

		this.state = {
			url: url,
			status: "No Page Loaded",
			backButtonEnabled: false,
			forwardButtonEnabled: false,
			loading: true,
			cookies: {},
			webViewUrl: "",
			myText: "My Original Text",
			showMsg: false,
		};

		this.actionOptions = global.switch_webportalActions ? global.switch_webportalActions.map((item) => Object.keys(item)[0]) : [];
		this.actionOptions.push("Cancel");
	}
	//this.props.chatroom

	componentWillUnmount() {
		timer.clearTimeout(this);
	}

	componentDidMount() {
		console.log("PROPS: ", this.props);

		if (Constants.manifest.extra.instance == "sais_edu_sg") {
			this.setState({ showMsg: true }, () => timer.setTimeout(this, "hideMsg", () => this.setState({ showMsg: false }), 10000));
		}

		this.props.navigation.setParams({
			_onOpenActionSheet: this._onOpenActionSheet,
			reload: this.reload,
		});

		//Analytics.track("Auth Portal", { url: this.props.route.params.url });
	}

	_onOpenActionSheet = () => {
		const options = this.actionOptions;
		const destructiveButtonIndex = 0;
		const cancelButtonIndex = 6;

		this.props.showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
			},
			(buttonIndex) => {
				const key = this.actionOptions[buttonIndex];
				if (key == "Cancel") return;
				const url = global.switch_webportalActions[buttonIndex][key];
				this.setState({ url: url });
			}
		);
	};

	showMsg() {
		if (Constants.manifest.extra.instance == "sais_edu_sg") {
			this.setState({ showMsg: true }, () => timer.setTimeout(this, "hideMsg", () => this.setState({ showMsg: false }), 5000));
		}
	}

	onNavigationStateChange = (navState) => {
		console.log(navState.url);
		if (navState.url.substring(0, 42) != "https://mystamford.edu.sg/login/login.aspx" && navState.url.substring(0, 25) == "https://mystamford.edu.sg") {
			setTimeout(() => {
				var jsCode = "window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);";
				this.webref.injectJavaScript(jsCode);
			}, 5000);
			this.setState({ canGoBack: false });
		} else {
			this.setState({ canGoBack: navState.canGoBack });
		}

		if (navState.url.substring(0, 42) == "https://mystamford.edu.sg/login/login.aspx") {
			if (!navState.url.includes("&kr=iSAMS:ParentPP")) {
				if (navState.url.includes("&kr=ActiveDirectoryKeyRing")) {
					//do overrule - they are staff
				} else {
					navState.url = navState.url + "&kr=iSAMS:ParentPP";
					this.setState({ url: navState.url });
				}
			}
		}
		this.setState({ url: navState.url });
	};

	onBack() {
		this.webref.goBack();
	}

	reload = () => {
		this.webref.reload();
	};

	handleMessage(message) {
		var authName = AuthParser.extractLoginUsername(message.nativeEvent.data);
		var authEmail = AuthParser.extractLoginEmail(message.nativeEvent.data);
		var authID = AuthParser.extractLoginID(message.nativeEvent.data);
		var authRole = AuthParser.extractLoginRole(message.nativeEvent.data);
		this.props.dispatch(saveDetails(authName, authEmail, authRole, authID));
	}

	_onLoadEnd() {
		if (this.state.url.substring(0, 42) == "https://mystamford.edu.sg/login/login.aspx") {
			setTimeout(() => {
				var jsCode = "document.getElementsByClassName('ff-login-personalised-background')[0].style.display = 'none';";
				jsCode = jsCode + "document.getElementById('username').value='" + this.props.authPortal.authEmail || "" + "';true;";
				this.webref.injectJavaScript(jsCode);
			}, 500);
		} else {
			setTimeout(() => {
				var jsCodeNoLogo = "document.getElementById('userbar-react-component').style.display = 'none';";
				jsCodeNoLogo = jsCodeNoLogo + "document.getElementsByClassName('school-logo')[0].style.display = 'none';";
				jsCodeNoLogo = jsCodeNoLogo + "document.getElementById('school-header').style.margin = '0px';";
				jsCodeNoLogo = jsCodeNoLogo + "document.getElementsByClassName('search-container')[0].style.display = 'none';";

				this.webref.injectJavaScript(jsCodeNoLogo);
			}, 700);
		}
	}

	render() {
		const { visible, style, children, ...rest } = this.props;

		return (
			<View>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 2 }}>
						<View style={styles.topbar}>
							<TouchableOpacity disabled={!this.state.canGoBack} onPress={this.onBack.bind(this)}>
								<Ionicons style={styles.navIcon} name="ios-arrow-back" />
							</TouchableOpacity>

							<TextInput ref="pageURL" value={this.state.url} placeholderTextColor="#FFF" style={styles.url} autoCapitalize="none" autoFocus={false} selectionColor="#FFF" />
						</View>

						<WebView
							source={{ uri: this.state.url }}
							javaScriptEnabled={true}
							automaticallyAdjustContentInsets={false}
							onNavigationStateChange={this.onNavigationStateChange.bind(this)}
							domStorageEnabled={true}
							startInLoadingState={true}
							ref={(r) => (this.webref = r)}
							keyboardDisplayRequiresUserAction={true}
							sharedCookiesEnabled={true}
							onMessage={this.handleMessage.bind(this)}
							onLoadEnd={this._onLoadEnd.bind(this)}
						/>
					</View>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	authPortal: state.authPortal,
});
const ConnectedApp = compose(connectActionSheet, connect(mapStateToProps))(authPortal);

export default class AppContainer extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerBackTitle: null,
		headerLeft: (
			<TouchableOpacity
				onPress={() => {
					navigation.state.params.reload();
				}}
			>
				<Ionicons name="md-refresh" style={styles.Leftheading} />
			</TouchableOpacity>
		),

		headerTitle: (
			<TouchableOpacity
				onPress={() => {
					navigation.state.params._onOpenActionSheet();
				}}
			>
				<Text style={{ fontSize: 14, fontWeight: "bold" }}>{global.switch_portalName}</Text>
			</TouchableOpacity>
		),
		headerRight: (
			<TouchableOpacity
				onPress={() => {
					navigation.state.params._onOpenActionSheet();
				}}
			>
				<View style={styles.chatHeading}>
					<Ionicons name="ios-bookmarks" style={styles.heading} />
				</View>
			</TouchableOpacity>
		),
	});
	render() {
		return (
			<ActionSheetProvider>
				<ConnectedApp navigation={this.props.navigation} route={this.props.route} />
			</ActionSheetProvider>
		);
	}
}
