import React from "react";
import { StyleSheet, Platform, Share, TouchableHighlight } from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { formatTime, formatMonth, getLanguageString } from "../lib/global";
import { phoneCalendar } from "../lib/phoneCalendar";
import { StoryEntity } from "../lib/interfaces";
import { setUserProperty } from "expo-firebase-analytics";

export function actionEdit(
	navigation: any,
	position: number,
	story: StoryEntity,
	domain: string,
	refreshFunction: any
) {
	return (
		<TouchableHighlight
			key="rightSideEdit"
			style={[styles.button, { bottom: 10 + position * 60 }]}
			underlayColor="#ff7043"
			onPress={() => {
				navigation.navigate("Form", {
					edit: true,
					story: story,
					domain: domain,
					refreshFunction: refreshFunction,
				});
			}}>
			<MaterialIcons testID="story.editIcon" name="edit" style={styles.icon} />
		</TouchableHighlight>
	);
}

export function actionPhotos(position: number, navigation: any, storyKey: string, domain: string) {
	return (
		<TouchableHighlight
			key="rightSidePhotos"
			style={[styles.button, { bottom: 10 + position * 60 }]}
			underlayColor="#ff7043"
			onPress={() => {
				navigation.navigate("Albums", {
					storyKey: storyKey,
					domain: domain,
				});
			}}>
			<MaterialIcons testID="story.cameraIcon" name="camera" style={styles.icon} />
		</TouchableHighlight>
	);
}

export function actionChat(
	position: number,
	navigation: any,
	chatroom: string,
	title: string,
	domain: string,
	language: string
) {
	return (
		<TouchableHighlight
			key="rightSideChat"
			testID="story.chatTouchable"
			style={[styles.button, { bottom: 10 + position * 60 }]}
			onPress={() => {
				navigation.navigate("chatStory", {
					chatroom: chatroom,
					title: title,
					domain: domain,
					language: language,
				});
			}}>
			<SimpleLineIcons name="bubble" testID="story.chatIcon" style={styles.icon} />
		</TouchableHighlight>
	);
}

export function actionSend(position: number, navigation: any, story: StoryEntity, domain: string) {
	return (
		<TouchableHighlight
			key="rightSideSend"
			style={[styles.button, { bottom: 10 + position * 60 }]}
			testID="story.sendIcon"
			onPress={() => {
				story.summaryMyLanguage;
				navigation.navigate("push", { story: story, domain: domain });
			}}>
			<MaterialCommunityIcons name="send-lock" style={styles.icon} />
		</TouchableHighlight>
	);
}

export function actionCalendar(position: number, story: StoryEntity) {
	if (Platform.OS === "ios") {
		return (
			<TouchableHighlight
				key="rightSideCalendar"
				style={[styles.button, { bottom: 10 + position * 60 }]}
				testID="story.calendarIcon"
				onPress={() => {
					phoneCalendar(story);
				}}>
				<Ionicons name="ios-calendar" style={styles.icon} />
			</TouchableHighlight>
		);
	} else {
		//TODO : Getting default calendar on android
		return null;
	}
}

export function actionShare(position: number, story: StoryEntity) {
	const _shareMessage = async () => {
		try {
			const result = await Share.share({
				message:
					"" +
					story.summaryMyLanguage +
					"\n" +
					formatMonth(story.date_start) +
					"\n" +
					formatTime(story.time_start_pretty, story.time_end_pretty) +
					" \n" +
					story.descriptionMyLanguage,
				title: story.summaryMyLanguage,
			});

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<TouchableHighlight
			key="rightSideShare"
			style={[styles.button, { bottom: 10 + position * 60 }]}
			onPress={() => _shareMessage()}
			testID="story.shareButton">
			<MaterialCommunityIcons testID="story.shareIcon" name="share" style={styles.icon} />
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		backgroundColor: "rgba(52, 52, 52, 0.1)",
		borderRadius: 50 / 2,
		height: 50,

		justifyContent: "center",
		position: "absolute",
		right: 15,
		shadowColor: "#000000",
		shadowOffset: {
			height: 1,
			width: 0,
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		width: 50,
		zIndex: 990,
	},
	icon: {
		color: "white",
		fontSize: 25,
	},
});
