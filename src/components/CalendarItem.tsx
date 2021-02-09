import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "./sComponent";
import Image from "../components/Imgix";
import { formatTime, formatMonth } from "../lib/global";
import { StoryEntity } from "../lib/interfaces";

interface TProps {
	navigation: any;
	story: StoryEntity;
	domain: string;
	language: string;
	showDate?: boolean;
}

export default function CalendarItem(props: TProps) {
	const renderDate = (date) => {
		if (undefined != date && date.length > 0) {
			return <Text style={styles.agendaDate}>{formatMonth(date)} </Text>;
		}
	};

	const renderTime = (start, end) => {
		if (undefined != start && start.length > 0) {
			return <Text style={styles.agendaDate}>{formatTime(start, end)} </Text>;
		}
	};

	const story = props.story;
	const language = props.language;
	const domain = props.domain;
	return (
		<TouchableOpacity
			style={styles.opacity}
			onPress={() =>
				props.navigation.navigate("storyCalendar", {
					story: story,
					domain: domain,
					language: language,
				})
			}>
			<View style={styles.agendaItem}>
				<View style={styles.textView}>
					<Text style={styles.text}>{story.summary}</Text>
					{story.location != "" && <Text style={styles.agendaLocation}>{story.location} </Text>}
					{renderDate(story.date_start)}
					{renderTime(story.time_start_pretty, story.time_end_pretty)}
				</View>
				{story.photo1 != undefined && (
					<View style={styles.imageView}>
						<Image source={{ uri: story.photo1 }} style={styles.image} />
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	agendaDate: {
		color: "gray",
		fontSize: 12,
		marginBottom: 3,
	},
	agendaItem: {
		alignSelf: "stretch",
		backgroundColor: "white",
		borderRadius: 5,
		borderRightColor: "#8F63B8",
		borderRightWidth: 10,
		flex: 1,
		marginRight: 10,
		marginTop: 5,
		padding: 10,
	},
	agendaLocation: {
		color: "gray",
		fontSize: 12,
		marginTop: 5,
	},

	image: {
		borderRadius: 5,
		height: 150,
		width: 300,
	},
	imageView: {
		alignItems: "flex-end",
		flex: 1,
	},

	opacity: {
		flexDirection: "row",
		marginBottom: 12,
	},

	text: {
		color: "#000",
		fontSize: 15,
		fontWeight: "bold",
		marginBottom: 10,
		paddingTop: 5,
		textAlign: "right",
	},
	textView: {
		alignItems: "flex-end",
		flex: 1,
	},
});
