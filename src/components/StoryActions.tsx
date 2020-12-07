import React from 'react';
import { StyleSheet, Text, View, Share, TouchableHighlight } from 'react-native';
import { Ionicons, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { formatTime, formatMonth } from "../lib/global";
import { phoneCalendar } from "../lib/phoneCalendar"
import { StoryEntity } from '../lib/interfaces';

export function actionEdit(navigation: any, position: number, story: StoryEntity, refreshFunction) {
	return (
		<TouchableHighlight
			key="rightSideEdit"
			style={[styles.button, { bottom: (10 + position * 60) }]}
			underlayColor="#ff7043"
			onPress={() => {
				navigation.navigate("Form", {
					edit: true,
					story,
					refreshFunction: refreshFunction
				});
			}}>
			<MaterialIcons testID="story.editIcon" name="edit" style={styles.icon} />
		</TouchableHighlight>
	)
}

export function actionPhotos(position: number, navigation: any, storyKey: string) {
	return (
		<TouchableHighlight
			key="rightSidePhotos"
			style={[styles.button, { bottom: (10 + position * 60) }]}
			underlayColor="#ff7043"
			onPress={() => {
				navigation.navigate("Albums", {
					storyKey: storyKey
				});
			}}>
			<MaterialIcons testID="story.cameraIcon" name="camera" style={styles.icon} />
		</TouchableHighlight>
	)
}

export function actionChat(position: number, navigation: any, chatroom: string, title: string) {
	return (
		<TouchableHighlight
			key="rightSideChat"
			style={[styles.button, { bottom: (10 + position * 60) }]}
			testID="story.chatIcon"
			onPress={() => {
				navigation.navigate("chatStory", {
					chatroom: chatroom,
					title: title
				});
			}}>
			<View>
				<SimpleLineIcons name="bubble" style={styles.icon} />
			</View>
		</TouchableHighlight>
	)
}

export function actionSend(position: number, navigation: any, story: StoryEntity) {
	return <TouchableHighlight
		key="rightSideSend"
		style={[styles.button, { bottom: (10 + position * 60) }]}
		testID="story.sendIcon"
		onPress={() => {
			story.summaryMyLanguage;
			navigation.navigate("push", this.state);
		}}>
		<MaterialCommunityIcons name="send-lock" style={styles.icon} />
	</TouchableHighlight>;
}


export function actionCalendar(position: number, story: StoryEntity) {

	return <TouchableHighlight
		key="rightSideCalendar"
		style={[styles.button, { bottom: (10 + position * 60) }]}
		testID="story.calendarIcon"
		onPress={() => {
			phoneCalendar(story)
		}}
	>
		<Ionicons name="ios-calendar" style={styles.icon} />
	</TouchableHighlight>;
}

export function actionShare(position: number, story: StoryEntity) {

	const _shareMessage = async () => {
		try {
			const result = await Share.share({
				message: "" + this.state.summaryMyLanguage + "\n" + formatMonth(this.state.date_start) + "\n" + formatTime(this.state.time_start_pretty, this.state.time_end_pretty) + " \n" + this.state.descriptionMyLanguage,
				title: this.state.summaryMyLanguage
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

	return <TouchableHighlight
		key="rightSideShare"
		style={[styles.button, { bottom: (10 + position * 60) }]}
		onPress={() => _shareMessage()}
		testID="story.shareButton"
	>
		<Ionicons testID="story.shareIcon" name="ios-share-alt" style={styles.icon} />
	</TouchableHighlight>;
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		backgroundColor: 'rgba(52, 52, 52, 0.1)',
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
	buttonA: {
		alignItems: "center",
		backgroundColor: 'rgba(52, 52, 52, 0.3)',
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
		width: 150,
		zIndex: 990,
	},
	icon: {
		color: "white",
		fontSize: 25
	},
});