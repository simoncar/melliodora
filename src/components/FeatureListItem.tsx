
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { getLanguageString } from "../lib/global";
import firebase from "firebase";
import { Text } from "./sComponent";
import { StoryEntity } from '../lib/interfaces';

const globalAny: any = global;

interface TProps {
	navigation: any,
	story: StoryEntity,
	editMode: boolean,
	language: string
}

class FeatureListItem extends Component<TProps> {
	constructor(props: TProps) {
		super(props);
	}

	deleteStory = () => {
		const storyID = this.props.story._key;
		firebase
			.firestore()
			.collection(globalAny.domain)
			.doc("feature")
			.collection("features")
			.doc(storyID)
			.delete();
	};

	confirmDelete = () => {
		Alert.alert("Confirm Delete Story", this.props.story.summary + "?", [{
			text: "Cancel",
			style: "cancel"
		}, { text: "OK", onPress: () => this.deleteStory() }], { cancelable: true });
	};

	adminMode = () => {
		if (this.props.editMode) {
			return <TouchableOpacity style={styles.touchable} onPress={() => this.confirmDelete()}>
				<AntDesign name="delete" size={30} color="black" style={styles.deleteIcon} />
			</TouchableOpacity>;
		}

		return <TouchableOpacity style={styles.touchableChat} onPress={() => {
			this.props.navigation.navigate("chat", {
				chatroom: this.props.story._key,
				title: this.props.story.summaryMyLanguage
			});
		}}>
			<SimpleLineIcons name="bubble" size={30} color="black" style={styles.chatBubble} />
		</TouchableOpacity>;
	};

	render() {
		const preview = {
			uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
		};
		const summary = getLanguageString(this.props.language, this.props.story, "summary");
		const uri = this.props.story.photo1;

		return <View style={styles.newsContentLine}>
			<TouchableOpacity onPress={() => this.props.navigation.navigate("storyMore", this.props.story)}>
				<View style={styles.itemRow}>
					<Image style={styles.itemImage} {...{ preview, uri }} />
					<Text style={styles.itemTitle}>{summary}</Text>
					{this.adminMode()}
					<Ionicons name="ios-more" size={30} color="black" style={styles.moreButton} />
				</View>
			</TouchableOpacity>
		</View>;
	}
}

const styles = StyleSheet.create({
	chatBubble: {
		lineHeight: 60,
		marginRight: 15
	},
	deleteIcon: {
		lineHeight: 60,
		marginRight: 15
	},
	itemImage: {
		borderColor: "lightgray",
		borderRadius: 18,
		borderWidth: StyleSheet.hairlineWidth,
		height: 36,
		margin: 12,
		width: 36
	},
	itemRow: {
		flexDirection: "row",
		flex: 1,
		height: 60,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center"
	},
	itemTitle: {
		alignItems: "center",
		color: "black",
		flex: 1,
		fontSize: 18,
		justifyContent: "center"
	},
	moreButton: {
		lineHeight: 60,
		marginRight: 15
	},
	newsContentLine: {
		borderTopColor: "#ddd",
		borderTopWidth: 1
	},
	touchable: {
		flexDirection: "row"
	},
	touchableChat: {
		flexDirection: "row"
	}
});

export default FeatureListItem;