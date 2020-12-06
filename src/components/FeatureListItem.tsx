
import React, { Component } from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet, Alert } from "react-native";

import { Ionicons, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { getLanguageString } from "../lib/global";
import firebase from "firebase";
import { Text } from "./sComponent";

class FeatureListItem extends Component {
	constructor(props) {
		super(props);
	}

	deleteStory = () => {
		const storyID = this.props.item._key;
		firebase.firestore().collection(global.domain).doc("feature").collection("features").doc(storyID).delete();
	};

	confirmDelete = () => {
		Alert.alert("Confirm Delete Story", this.props.item.summary + "?", [{
			text: "Cancel",
			style: "cancel"
		}, { text: "OK", onPress: () => this.deleteStory() }], { cancelable: true });
	};

	adminMode = () => {
		if (this.props.editMode) {
			return <TouchableOpacity style={styles.a73433540af6a11ea88c25dbffc760ad0} onPress={() => this.confirmDelete()}>
				<AntDesign name="delete" size={30} color="black" style={styles.a73433541af6a11ea88c25dbffc760ad0} />
			</TouchableOpacity>;
		}

		return <TouchableOpacity style={styles.a73433542af6a11ea88c25dbffc760ad0} onPress={() => {
			this.props.navigation.navigate("chat", {
				chatroom: this.props.item._key,
				title: summary
			});
		}}>
			<SimpleLineIcons name="bubble" size={30} color="black" style={styles.a73435c50af6a11ea88c25dbffc760ad0} />
		</TouchableOpacity>;
	};

	render() {
		const preview = {
			uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
		};
		const summary = getLanguageString(this.props.language, this.props.item, "summary");
		const uri = this.props.item.photo1;

		return <View style={styles.newsContentLine}>
			<TouchableOpacity onPress={() => this.props.navigation.navigate("storyMore", this.props.item)}>
				<View style={styles.a73435c51af6a11ea88c25dbffc760ad0}>
					<Image style={styles.a73435c52af6a11ea88c25dbffc760ad0} {...{ preview, uri }} />

					<Text style={styles.itemTitle}>{summary}</Text>

					{this.adminMode()}
					<Ionicons name="ios-more" size={30} color="black" style={styles.a73438360af6a11ea88c25dbffc760ad0} />
				</View>
			</TouchableOpacity>
		</View>;
	}
}

const styles = StyleSheet.create({
	a73433540af6a11ea88c25dbffc760ad0: {
		flexDirection: "row"
	},
	a73433541af6a11ea88c25dbffc760ad0: {
		lineHeight: 60,
		marginRight: 15
	},
	a73433542af6a11ea88c25dbffc760ad0: {
		flexDirection: "row"
	},
	a73435c50af6a11ea88c25dbffc760ad0: {
		lineHeight: 60,
		marginRight: 15
	},
	a73435c51af6a11ea88c25dbffc760ad0: {
		flexDirection: "row",
		flex: 1,
		height: 60,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center"
	},
	a73435c52af6a11ea88c25dbffc760ad0: {
		borderColor: "lightgray",
		borderRadius: 18,
		borderWidth: StyleSheet.hairlineWidth,
		height: 36,
		margin: 12,
		width: 36
	},
	a73438360af6a11ea88c25dbffc760ad0: {
		lineHeight: 60,
		marginRight: 15
	},
	itemTitle: {
		alignItems: "center",
		color: "black",
		flex: 1,
		fontSize: 18,
		justifyContent: "center"
	},
	newsContentLine: {
		borderTopColor: "#ddd",
		borderTopWidth: 1
	}
});

export default FeatureListItem;