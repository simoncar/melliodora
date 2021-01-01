import React from "react";
import firebase from "../lib/firebase";
import Constants from "expo-constants";
import { TouchableOpacity, View, Text, Linking, StyleSheet } from "react-native";
import _ from "lodash";
import { FontAwesome } from "@expo/vector-icons";
import { Updates } from "expo";

const versionDoc = "latestAppStoreVersion-" + (Constants.manifest && Constants.manifest && Constants.manifest.slug);
export default class VersionCheck {
	constructor() { }

	lookupAppStoreVersion(callback) {
		const revisionId = Constants.manifest.revisionId ? Constants.manifest.revisionId : "Simulator";
		var revisionIdLatest = "";

		// Check the version is the latest in the app store
		this.ref = firebase.firestore().collection("domains").doc("config").collection("version").doc(versionDoc).get().then(doc => {
			if (doc.exists) {
				revisionIdLatest = doc.data().revisionId;

				if (_.isObject(Constants.platform.ios)) {
					if (doc.data().iosAppStore != Constants.manifest.version) {
						// old version - get new version from app store
						callback("appleAppStore");
					} else {
						if (revisionIdLatest != revisionId) {
							callback("codePushReload");
							this.writeNewPushCodeVersionIfRequired(revisionId);
						} else {
							callback("none");
						}
					}
				} else if (_.isObject(Constants.platform.android)) {
					if (doc.data().androidGooglePlay != Constants.manifest.version) {
						// old version - get new version from google play
						callback("googlePlay");
					} else {
						if (revisionIdLatest != revisionId) {
							callback("codePushReload");
							this.writeNewPushCodeVersionIfRequired(revisionId);
						} else {
							callback("none");
						}
					}
				}
			}
		})
	}

	writeNewPushCodeVersionIfRequired(myRevision) {
		this.ref = firebase.firestore().collection("domains").doc("config").collection("version").doc(myRevision).get().then(doc => {
			if (!doc.exists) {
				firebase.firestore().collection("domains").doc("config").collection("version").doc(myRevision).set({
					revisionId: myRevision,
					manifest: Constants.manifest,
					nativeAppVersion: Constants.nativeAppVersion,
					version: Constants.manifest.version,
					timestamp: Date.now()
				});

				firebase.firestore().collection("domains").doc("config").collection("version").doc(versionDoc).set({ revisionId: myRevision }, { merge: true });
			}
		});
	}

	updateAction(updateType) {

		const { manifest } = Constants;
		const googlePlay = manifest.extra && manifest.extra.googlePlay;
		const appleAppStore = manifest.extra && manifest.extra.appleAppStore;
		switch (updateType) {
			case "googlePlay":
				Linking.openURL(googlePlay);
				break;
			case "appleAppStore":
				Linking.openURL(appleAppStore);
				break;
			case "codePushReload":
				Updates.reload();
				break;
		}
	}

	updateMessage(updateType) {
		return <TouchableOpacity onPress={() => {
			this.updateAction(updateType);
		}}>
			<View style={styles.versionPanel}>
				<Text>Upgrade Available </Text>
				<FontAwesome name="refresh" style={styles.refreshIcon} />
			</View>
		</TouchableOpacity>;
	}
}

const styles = StyleSheet.create({
	refreshIcon: {
		color: "#000"
	},
	versionPanel: {
		alignItems: "center",
		backgroundColor: "#ffce44",
		flexDirection: "row",
		height: 40,
		justifyContent: "center",
		marginTop: 20
	}
}); 