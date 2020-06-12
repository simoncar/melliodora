
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "native-base";
import { Ionicons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import stylesGlobal from "../../themes/globalTheme";
import { formatTime, formatMonth, isURL } from "../global.js";

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
			return <Image style={styles.iconPhoto} {...{ uri: photo1 }} />;
		}
	}
	renderTime(start, end, source) {
		if (source == "calendar") {
			if (undefined != start && start.length > 0) {
				return <Text style={styles.eventTime}>{formatTime(start, end)} </Text>;
			}
		}
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
		return (
			<TouchableOpacity style={styles.flexRow} onPress={() => {
				this.props.navigation.navigate("chatStory", {
					chatroom: chatroom,
					title: title
				});
			}}>
				<SimpleLineIcons name="bubble" size={25} style={styles.chatBubble} />
			</TouchableOpacity>
		)
	}

	render() {
		const showIconChat = this.props.item.showIconChat === false ? false : true;
		const card = this.props.card === false ? false : true;
		const { _key, photo1, excerpt, source, summaryMyLanguage, location, date_start, time_start_pretty, time_end_pretty } = this.props.item;

		return (<View style={card && [styles.card, this.props.cardStyle]}>
			<View style={styles.cardView}>
				<TouchableOpacity style={styles.flexRow} onPress={() => {
					this.props.navigation.navigate("story", this.props.item);
				}}>
					<View style={styles.storyLeftSideTitle}>
						{this.icon(source, photo1)}

						<View>
							<Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardTitle}>
								{summaryMyLanguage}
							</Text>
							{this.renderLocation(location)}
							{this.renderDate(date_start)}
							{this.renderTime(time_start_pretty, time_end_pretty, source)}
						</View>
					</View>
					<View style={styles.rightSideIcons}>
						{showIconChat &&
							this.renderChat(_key, summaryMyLanguage)}
						<Ionicons name="ios-more" size={25} style={styles.moreIcon} />
					</View>
				</TouchableOpacity>
			</View>

			<TouchableOpacity onPress={() => {
				this.props.navigation.navigate("story", this.props.item);
			}}>
				<View style={styles.storyLowerView}>
					{excerpt ? <Text ellipsizeMode="clip" style={styles.storyExcerpt}>
						{excerpt}
					</Text> : null}
					{isURL(photo1) && <Image style={styles.storyPhoto} {...{ uri: photo1 }} />}
				</View>
			</TouchableOpacity>

		</View>

		)
	}
}

const styles = StyleSheet.create({

	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderColor: "lightgray",
		borderRadius: 15,
		borderWidth: 1,
		elevation: 1,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%"
	},
	cardLocation: {
		alignItems: "center",
		color: "#555555",
		fontSize: 12,
		fontWeight: "500",
		justifyContent: "center",
	},
	cardTitle: {
		alignItems: "center",
		color: "#111111",
		fontSize: stylesGlobal.headingFontSize,
		fontWeight: "500",
		justifyContent: "center",
	},
	cardView: {
		alignItems: "center",
		borderBottomColor: "lightgray",
		borderBottomWidth: 0.1,
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 5,
		paddingRight: 4
	},
	chatBubble: {
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
	flexRow: {
		flexDirection: "row"
	},
	iconCalendar: {
		borderColor: "#999999",
		borderRadius: 5,
		borderWidth: 0,
		color: "#999999",
		height: 36,
		margin: 12,
		textAlign: "center",
		textAlignVertical: "top",
		width: 36
	},
	iconCash: {
		borderColor: "#999999",
		borderRadius: 18,
		borderWidth: 0,
		color: "#999999",
		height: 36,
		margin: 12,
		textAlign: "center",
		width: 36
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
	moreIcon: {
		marginRight: 8
	},
	rightSideIcons: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center"
	},
	storyExcerpt: {
		color: "#777777",
		fontSize: 14,
		paddingHorizontal: 8,
		paddingVertical: 12
	},

	storyLeftSideTitle: {
		alignItems: "center",
		flexDirection: "row"
	},
	storyLowerView: {
		flexDirection: "column"
	},
	storyPhoto: {
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		height: 200
	},

});

export default ListItem;