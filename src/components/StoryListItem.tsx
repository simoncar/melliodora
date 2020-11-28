import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { Text } from "./sComponent";
import { Ionicons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { formatTime, formatMonth, isURL } from "../lib/global.js";

const WINDOW_WIDTH = Dimensions.get("window").width;

class ListItem extends Component {
	constructor(props) {
		super(props);
	}

	icon(source, photo1) {
		if (source == "calendar") {
			return <Ionicons name="ios-calendar" size={35} style={styles.iconCalendar} />;
		} else if (source == "balance") {
			return <MaterialCommunityIcons name="cash-multiple" size={35} style={styles.iconCash} />;
		} else {
			return <Image style={styles.iconPhoto} source={{ uri: photo1 }} />;
		}
	}
	renderTime(start, end, source) {
		//if (source == "calendar") {
		if (undefined != start && start.length > 0) {
			return <Text style={styles.eventTime}>{formatTime(start, end)} </Text>;
		}
		//}
	}

	renderLocation(location) {
		if (undefined != location && location.length > 0) {
			return <Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardLocation}>
				{location}
			</Text>;
		}
	}

	renderDate(date_start) {
		if (undefined != date_start && date_start.length > 0) {
			return <Text style={styles.eventDate}>{formatMonth(date_start)}</Text>;
		}
	}

	renderChat(chatroom, title) {
		if (Constants.manifest.extra.instance != "sais_edu_sg") {

			return <TouchableOpacity onPress={() => {
				this.props.navigation.navigate("chatStory", {
					chatroom: chatroom,
					title: title
				});
			}}>
				<SimpleLineIcons name="bubble" size={25} style={styles.chatBubble} />
			</TouchableOpacity>;
		}
	}

	render() {
		const showIconChat = this.props.item.showIconChat === false ? false : true;
		const card = this.props.card === false ? false : true;
		const {
			_key,
			photo1,
			source,
			summaryMyLanguage,
			location,
			date_start,
			time_start_pretty,
			time_end_pretty
		} = this.props.item;

		return <View style={card && [styles.card]}>
			<TouchableOpacity style={styles.bb} onPress={() => {
				this.props.navigation.navigate("story", this.props.item);
			}}>
				<View style={styles.headerRow}>

					<View style={styles.headerIcon}>
						{this.icon(source, photo1)}
					</View>

					<View style={styles.headerTextPanel}>
						<Text numberOfLines={2} ellipsizeMode="tail">
							{summaryMyLanguage}
						</Text>
						{this.renderLocation(location)}
						{this.renderDate(date_start)}
						{this.renderTime(time_start_pretty, time_end_pretty, source)}
					</View>

					<View style={styles.headerRightIcons}>
						{showIconChat && this.renderChat(_key, summaryMyLanguage)}
					</View>

				</View>
				<View style={styles.ff}>
					{isURL(photo1) && <Image style={styles.storyPhoto} source={{ uri: photo1 }} />}
				</View>
			</TouchableOpacity>
		</View>;
	}
}

const styles = StyleSheet.create({
	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: "95%"
	},
	cardLocation: {
		color: "#555555",
		fontSize: 12
	},
	chatBubble: {
		marginLeft: 15,
		marginRight: 8

	},
	eventDate: {
		color: "#777777",
		fontSize: 12,
		marginBottom: 3
	},

	eventTime: {
		color: "#777777",
		fontSize: 12,
		marginBottom: 3
	},

	headerIcon: { width: 60 },

	headerRightIcons: { flexDirection: "row-reverse", marginLeft: 5 },
	headerRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", width: WINDOW_WIDTH - 40 },
	headerTextPanel: { flex: 1, width: '100%' },
	iconCalendar: {
		color: "#999999",
		margin: 12
	},
	iconCash: {
		color: "#999999",
		margin: 12
	},
	iconPhoto: {
		alignItems: "center",
		borderColor: "lightgray",
		borderRadius: 18,
		borderWidth: StyleSheet.hairlineWidth,
		height: 36,
		justifyContent: "center",
		margin: 12,
		width: 36
	},

	storyPhoto: {
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		height: 200,
	}
});

export default ListItem;