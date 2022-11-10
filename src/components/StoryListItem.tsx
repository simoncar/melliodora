import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Text } from "./sComponent";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Image from "../components/Imgix";
import Constants from "expo-constants";
import { StoryEntity } from "../lib/interfaces";
import { formatTime, formatMonth, isURL } from "../lib/global";
import ImageList from "../components/ImageList";

const WINDOW_WIDTH = Dimensions.get("window").width;

interface TProps {
	navigation: any;
	story: StoryEntity;
	card: boolean;
	domain: string;
	language: string;
	admin: boolean;
}

class ListItem extends Component<TProps> {
	constructor(props: TProps) {
		super(props);
	}

	icon(source: string, photo1: string) {
		if (source == "calendar") {
			return <Ionicons name="ios-calendar" size={35} style={styles.iconCalendar} />;
		} else {
			return <Image style={styles.iconPhoto} source={{ uri: photo1 }} />;
		}
	}
	renderTime(start: string | any[] | undefined, end: any) {
		if (undefined != start && start.length > 0) {
			return <Text style={styles.eventTime}>{formatTime(start, end)} </Text>;
		}
	}

	renderLocation(location: string | any[] | undefined) {
		if (undefined != location && location.length > 0) {
			return (
				<Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardLocation}>
					{location}
				</Text>
			);
		}
	}

	renderDate(date_start: string | any[] | undefined) {
		if (undefined != date_start && date_start.length > 0) {
			return <Text style={styles.eventDate}>{formatMonth(date_start)}</Text>;
		}
	}

	renderChat(chatroom: string, title: string, domain: string, language: string, admin: boolean) {
		if (Constants.manifest?.extra?.domain != "sais_edu_sg") {
			return (
				<TouchableOpacity
					onPress={() => {
						this.props.navigation.navigate("chatStory", {
							chatroom: chatroom,
							title: title,
							domain: domain,
							language: language,
							admin: admin,
						});
					}}>
					<SimpleLineIcons name="bubble" size={25} style={styles.chatBubble} />
				</TouchableOpacity>
			);
		}
	}

	render() {
		const showIconChat = this.props.story.showIconChat;
		const card = this.props.card;
		const domain = this.props.domain;
		const language = this.props.language;
		const admin = this.props.admin;
		const {
			key,
			source,
			summaryMyLanguage,
			location,
			date_start,
			time_start_pretty,
			time_end_pretty,
			photo1,
		} = this.props.story;

		return (
			<View style={card && [styles.card]}>
				<View style={styles.content}>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.navigate("story", {
								story: this.props.story,
								domain: this.props.domain,
								language: this.props.language,
								admin: this.props.admin,
							});
						}}>
						<View style={styles.headerRow}>
							<View style={styles.headerIcon}>{this.icon(source, photo1)}</View>
							<View style={styles.headerTextPanel}>
								<Text numberOfLines={2} ellipsizeMode="tail">
									{summaryMyLanguage}
								</Text>
								{this.renderLocation(location)}
								{this.renderDate(date_start)}
								{this.renderTime(time_start_pretty, time_end_pretty)}
							</View>

							<View style={styles.headerRightIcons}>
								{showIconChat && this.renderChat(key, summaryMyLanguage, domain, language, admin)}
							</View>
						</View>

						{isURL(photo1) && (
							<View>
								<Image style={styles.storyPhoto} source={{ uri: photo1 }} auto={true} />
							</View>
						)}
					</TouchableOpacity>
					<View style={styles.cardMiniList}>
						<ImageList feature={key} edit={false} miniRoll={true} domain={this.props.domain} />
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		width: WINDOW_WIDTH - 15,
	},
	cardLocation: {
		color: "#555555",
		fontSize: 12,
	},
	cardMiniList: {
		alignSelf: "center",
		width: WINDOW_WIDTH - 15,
	},
	chatBubble: {
		marginLeft: 15,
		marginRight: 8,
	},
	content: {
		padding: 10,
	},
	eventDate: {
		color: "#777777",
		fontSize: 12,
		marginBottom: 3,
	},

	eventTime: {
		color: "#777777",
		fontSize: 12,
		marginBottom: 3,
	},

	headerIcon: { width: 60 },

	headerRightIcons: {
		flexDirection: "row-reverse",
		marginLeft: 5,
	},
	headerRow: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		width: WINDOW_WIDTH - 40,
	},
	headerTextPanel: { flex: 1, width: "100%" },
	iconCalendar: {
		alignItems: "center",
		color: "#999999",
		height: 36,
		justifyContent: "center",
		margin: 12,
		width: 36,
	},
	iconPhoto: {
		alignItems: "center",
		borderColor: "lightgray",
		borderRadius: 18,
		borderWidth: StyleSheet.hairlineWidth,
		height: 36,
		justifyContent: "center",
		margin: 12,
		width: 36,
	},

	storyPhoto: {
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		height: WINDOW_WIDTH / 2,
	},
});

export default ListItem;
