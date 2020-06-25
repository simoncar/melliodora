
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Text } from "./sComponent"
import { Ionicons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
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
			return <Image style={styles.iconPhoto} {...{ uri: photo1 }} />;
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
		return (
			<TouchableOpacity style={styles.cardOpacity} onPress={() => {
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

		return (<View><View style={{ width: WINDOW_WIDTH - 20, flexDirection: "row", justifyContent: "space-between" }} >

			<View style={{ width: 60 }}>

				{this.icon(source, photo1)}

			</View>


			<View style={{ flex: 1, width: '100%' }}>
				<Text numberOfLines={2} ellipsizeMode="tail" >
					{summaryMyLanguage}
				</Text>
				{this.renderLocation(location)}
				{this.renderDate(date_start)}
				{this.renderTime(time_start_pretty, time_end_pretty, source)}
			</View>

			<View style={{ flexDirection: "row-reverse" }} >
				<Ionicons name="ios-more" size={25} style={styles.moreIcon} />
				{showIconChat &&
					this.renderChat(_key, summaryMyLanguage)}
			</View>
		</View>
			<View style={{ width: WINDOW_WIDTH - 20, flexDirection: "row", justifyContent: "space-between" }} >

				<Text style={{ width: 20 }}>A</Text>
				<Text numberOfLines={1} style={{ flex: 1, width: '100%' }}>Some really long test sentence that is too long to fit on the screen</Text>
				<View style={{ flexDirection: "row-reverse" }} >

					<Ionicons name="ios-more" size={25} style={styles.moreIcon} />
					{showIconChat &&
						this.renderChat(_key, summaryMyLanguage)}
				</View>
			</View>
			<View style={{ width: WINDOW_WIDTH - 20, flexDirection: "row", justifyContent: "space-between" }} >

				<Text style={{ width: 20 }}>A</Text>
				<Text numberOfLines={2} style={{ flex: 1, width: '100%' }}>Some really long test sentence that is too long to fit onSome really long test sentence that is too long to fit on the screenSome really long test sentence that is too long to fit on the screenSome really long test sentence that is too long to fit on the screenSome really long test sentence that is too long to fit on the screenSome really long test sentence that is too long to fit on the screenSome really long test sentence that is too long to fit on the screen the screen</Text>
				<View style={{ flexDirection: "row-reverse" }} >
					<Text style={{}}>A</Text>
					<Text style={{}}>A</Text>
					<Text style={{}}>A</Text>
					<Text style={{}}>A</Text>
					<Text style={{}}>A</Text>
					<Text style={{}}>A</Text>
					<Text style={{}}>A</Text>
				</View>
			</View>

			<View style={card && [styles.card, this.props.cardStyle]}>
				<View style={styles.aa}>
					<TouchableOpacity style={styles.bb} onPress={() => {
						this.props.navigation.navigate("story", this.props.item);
					}}>
						<View style={styles.cc}>
							{this.icon(source, photo1)}

							<View>
								<Text numberOfLines={2} ellipsizeMode="tail" style={styles.dd}>
									{summaryMyLanguage}
								</Text>
								{this.renderLocation(location)}
								{this.renderDate(date_start)}
								{this.renderTime(time_start_pretty, time_end_pretty, source)}
							</View>
						</View>
						<View style={styles.ee}>
							{showIconChat &&
								this.renderChat(_key, summaryMyLanguage)}
							<Ionicons name="ios-more" size={25} style={styles.moreIcon} />
						</View>
					</TouchableOpacity>
				</View>

				<TouchableOpacity onPress={() => {
					this.props.navigation.navigate("story", this.props.item);
				}}>
					<View style={styles.ff}>
						{excerpt ? <Text ellipsizeMode="clip" style={styles.gg}>
							{excerpt}
						</Text> : null}
						{isURL(photo1) && <Image style={styles.storyPhoto} {...{ uri: photo1 }} />}
					</View>
				</TouchableOpacity>

			</View>

		</View>





		)
	}
}

const styles = StyleSheet.create({

	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: "95%",
	},
	cardHeaderRow: {
		flex: 1,
		alignItems: 'stretch',
		color: "#111111",
		fontSize: 16,
		fontWeight: "500",
		flexDirection: "row",
		justifyContent: 'space-between',
	},
	cardLeftView: {
		alignItems: "center",
		flexDirection: "row",
	},
	cardLocation: {
		alignItems: "center",
		color: "#555555",
		fontSize: 12,
	},
	cardRightView: {
		flexDirection: "row-reverse",
	},
	cardTitle: {
		alignItems: "center",
		color: "#111111",
		fontSize: 16,
		fontWeight: "500",
		width: WINDOW_WIDTH - 150
	},
	cardView: {
		alignItems: "center",
		borderBottomColor: "lightgray",
		borderBottomWidth: 0.1,
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
	},
	moreIcon: {
		marginRight: 8
	},

	storyExcerpt: {
		color: "#777777",
		fontSize: 14,
		paddingHorizontal: 8,
		paddingVertical: 12
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