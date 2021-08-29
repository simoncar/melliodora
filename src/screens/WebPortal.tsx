import React, { useEffect, useLayoutEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import Constants from "expo-constants";

interface TProps {
	navigation: any;
	route: any;
}

export default function WebPortal(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [url, setUrl] = useState("");
	const [canGoBack, setBack] = useState(false);
	const [canGoForward, setForward] = useState(false);

	var webview: any;

	useEffect(() => {
		if (props.route.params === undefined) {
			if (Constants.manifest.extra.domain === "sais_edu_sg") {
				setUrl(
					"https://mystamford.fireflycloud.asia/login/login.aspx?prelogin=https%3a%2f%2fmystamford.fireflycloud.asia%2f"
				);
			} else {
				setUrl("https://www.smartcookies.io");
			}
		} else {
			setUrl(props.route.params.url);
		}
		setLoading(false);

		//https://connect.ais.com.sg/login/login.aspx?prelogin=https%3a%2f%2fconnect.ais.com.sg%2f&kr=iSAMS:ParentPP
	}, []);

	useLayoutEffect(() => {
		const onPress = () => {
			Linking.openURL(url);
		};

		props.navigation.setOptions({
			// eslint-disable-next-line react/display-name
			headerRight: () => {
				return (
					<TouchableOpacity onPress={onPress}>
						<Feather style={styles.share} name="share" size={24} color="black" />
					</TouchableOpacity>
				);
			},
		});
	}, [props.navigation, url]);

	const onBack = () => {
		webview.goBack();
	};

	const onForward = () => {
		webview.goForward();
	};

	return (
		<View style={styles.flex1}>
			<View style={styles.headerRow}>
				<TouchableOpacity disabled={!canGoBack} onPress={onBack}>
					<Ionicons style={styles.navIconLeft} name="ios-arrow-back" />
				</TouchableOpacity>

				<TextInput
					value={url}
					placeholderTextColor="#FFF"
					style={styles.url}
					autoCapitalize="none"
					selectionColor="#FFF"
					testID="webPortal.urlField"
				/>
				<TouchableOpacity disabled={!canGoForward} onPress={onForward}>
					<Ionicons style={styles.navIconRight} name="ios-arrow-forward" />
				</TouchableOpacity>
			</View>

			{!loading && (
				<WebView
					source={{ uri: url }}
					javaScriptEnabled={true}
					automaticallyAdjustContentInsets={false}
					onNavigationStateChange={(navState) => {
						setUrl(navState.url);
						setBack(navState.canGoBack);
						setForward(navState.canGoForward);
					}}
					domStorageEnabled={true}
					ref={(ref) => {
						webview = ref;
					}}
					testID="webPortal.RNCWebView"
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	flex1: { flex: 1 },
	headerRow: {
		flexDirection: "row",
	},
	navIconLeft: {
		alignContent: "center",
		color: "black",
		fontSize: 20,
		height: 30,
		padding: 5,
	},

	navIconRight: {
		alignSelf: "flex-end",
		color: "black",
		fontSize: 20,
		height: 30,
		padding: 5,
	},
	share: {
		paddingRight: 10,
	},
	url: {
		color: "black",
		flex: 1,
		fontSize: 14,
		height: 30,
		width: "100%",
	},
});
