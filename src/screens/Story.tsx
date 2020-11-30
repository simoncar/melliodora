import React, { Component } from "react";
import { Linking, View, TouchableHighlight, Share, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import ParsedText from "react-native-parsed-text";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../lib/global.js";
import _ from "lodash";
import { connect } from "react-redux";
import { Text } from "../components/sComponent"
import { phoneCalendar } from "../lib/phoneCalendar"
import ImageList from "../components/ImageList"

interface TProps {
	navigation: any,
	route: any
}
interface TState {
	photo1: string,
	summary: string,
	summaryMyLanguage: string,
	descriptionMyLanguage: string,
	description: string,
	visible: string,
	visibleMore: string,
	showIconChat: string,
	order: string,
	_key: string,
	date_start: any,
	time_start_pretty: any,
	time_end_pretty: any,
	source: any,
	dateTimeStart: any,
	dateTimeEnd: any,
	location: any,
	newState: any
}


export class Story extends Component<TProps, TState>{

	constructor(props) {
		super(props);

		const {
			_key,
			summary,
			location,
			summaryMyLanguage,
			source,
			date_start, time_start_pretty,
			time_end_pretty, descriptionMyLanguage,
			description, photo1, visible, visibleMore,
			showIconChat, order,
			dateTimeStart, dateTimeEnd
		}
			= this.props.route.params;

		this.state = {
			photo1: photo1 !== undefined ? photo1 : null,
			summary: summary,
			summaryMyLanguage: summaryMyLanguage,
			descriptionMyLanguage: descriptionMyLanguage,
			description: description,
			visible: visible,
			visibleMore: visibleMore,
			showIconChat: showIconChat,
			order: order,
			_key: _key,
			date_start,
			time_start_pretty,
			time_end_pretty,
			source,
			dateTimeStart,
			dateTimeEnd,
			location
		};


		this.refreshFunction = this.refreshFunction.bind(this);
	}

	componentDidMount() {
		const navigation = this.props.navigation;

		navigation.setOptions({
			headerBackTitleVisible: false
		});
	}

	_shareMessage = async () => {
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

	_handleOpenWithLinking = sURL => {
		Linking.openURL(sURL);
	};

	_handleEmailPress(email) {
		Linking.openURL("mailto:" + email);
	}

	_handlePhonePress(phone) {
		Linking.openURL("tel:" + phone);
	}

	_drawImage(imageURI) {
		var uri = ""
		if (_.isNil(imageURI) || (imageURI == "")) {
			uri = "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2FdefaultCalendar.jpg?alt=media&token=e7ba4a0a-e785-4601-bcae-5e43ce71e680";
		} else {
			uri = imageURI;
		}
		const preview = {
			uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
		};

		if (undefined !== uri && null !== uri && uri.length > 0) {
			return <View>
				<Image style={styles.storyPhoto} {...{ preview, uri }} />
			</View>;
		}
	}


	refreshFunction(newState) {
		console.log("refresh function")
		this.setState(
			{
				newState,
				summaryMyLanguage: newState.summary,
				descriptionMyLanguage: newState.description
			});
	}

	rightSideButtons() {
		let buffer = []

		const admin = isAdmin(this.props.route.params.adminPassword)
		let position = 0

		if (admin && this.state.source == "feature") {
			buffer.push(this.rightSideEdit(position))
			position++
		}

		if (admin && this.state.showIconChat === true) {
			buffer.push(this.rightSideChat(position, this.state._key, this.state.summaryMyLanguage))
			position++
		}
		if (admin) {
			buffer.push(this.rightSideSend(position, this.state))
			position++
		}
		buffer.push(this.rightSidePhotos(position))
		position++
		buffer.push(this.rightSideShare(position))
		position++

		if (isValue(this.state.date_start)) {
			buffer.push(this.rightSideCalendar(position, this.state))
			position++
		}
		return (buffer)
	}

	rightSideEdit(position) {
		return (
			<TouchableHighlight
				key="rightSideEdit"
				style={[styles.button, { bottom: (10 + position * 60) }]} underlayColor="#ff7043"
				onPress={() => {
					this.props.navigation.navigate("Form", {
						edit: true,
						...this.state,
						refreshFunction: this.refreshFunction
					});
				}}>
				<MaterialIcons testID="story.editIcon" name="edit" style={[styles.icon]} />
			</TouchableHighlight>
		)
	}

	rightSidePhotos(position) {
		return (
			<TouchableHighlight
				key="rightSidePhotos"
				style={[styles.button, { bottom: (10 + position * 60) }]}
				underlayColor="#ff7043"
				onPress={() => {
					this.props.navigation.navigate("Albums", {
						edit: true,
						...this.state,
					});
				}}>
				<MaterialIcons testID="story.cameraIcon" name="camera" style={styles.icon} />
			</TouchableHighlight>
		)
	}

	rightSideChat(position, chatroom, title) {
		return (
			<TouchableHighlight
				key="rightSideChat"
				style={[styles.button, { bottom: (10 + position * 60) }]}
				testID="story.chatIcon"
				onPress={() => {
					this.props.navigation.navigate("chatStory", {
						chatroom: chatroom,
						title: title
					});
				}}>
				<SimpleLineIcons name="bubble" style={styles.icon} />
			</TouchableHighlight>
		)
	}

	rightSideSend(position) {
		return <TouchableHighlight
			key="rightSideSend"
			style={[styles.button, { bottom: (10 + position * 60) }]}
			testID="story.sendIcon"
			onPress={() => {
				this.state.summaryMyLanguage;
				this.props.navigation.navigate("push", this.state);
			}}>
			<MaterialCommunityIcons name="send-lock" style={styles.icon} />
		</TouchableHighlight>;
	}


	rightSideCalendar(position) {

		return <TouchableHighlight
			key="rightSideCalendar"
			style={[styles.button, { bottom: (10 + position * 60) }]}
			testID="story.calendarIcon"
			onPress={() => {

				phoneCalendar(this.state)
				//this.props.navigation.navigate("Calendars", this.state);
			}}
			testID="story.calendarIcon"
		>
			<Ionicons name="ios-calendar" style={styles.icon} />
		</TouchableHighlight>;

	}

	rightSideShare(position) {
		return <TouchableHighlight
			key="rightSideShare"
			style={[styles.button, { bottom: (10 + position * 60) }]}
			onPress={() => this._shareMessage()}
			testID="story.shareButton"
		>
			<Ionicons testID="story.shareIcon" name="ios-share-alt" style={styles.icon} />
		</TouchableHighlight>;
	}


	_drawText() {
		return (
			<View style={styles.textBox}>
				<Text selectable style={styles.eventTitle}>
					{this.state.summaryMyLanguage}
				</Text>

				{isValue(this.state.location) && <Text selectable style={styles.eventText}>
					{this.state.location}
				</Text>}

				{isValue(this.state.date_start) && <Text selectable style={styles.eventText}>
					{formatMonth(this.state.date_start)}
				</Text>}


				{isValue(this.state.time_start_pretty) && <Text selectable style={styles.eventTextTime}>
					{formatTime(this.state.time_start_pretty, this.state.time_end_pretty)}
				</Text>}


				<ParsedText style={styles.eventTextBody} testID="story.parsedText"
					parse={[{
						pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,12}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*/i,
						style: styles.url,
						onPress: this._handleOpenWithLinking
					}, {
						type: "phone",
						style: styles.phone,
						onPress: this._handlePhonePress
					}, {
						type: "email",
						style: styles.email,
						onPress: this._handleEmailPress
					}, { pattern: /433333332/, style: styles.magicNumber }, { pattern: /#(\w+)/, style: styles.hashTag }]} childrenProps={{ allowFontScaling: false }}>
					{this.state.descriptionMyLanguage}
				</ParsedText>

				{this.props.auth.language != "en" && <Text selectable style={styles.englishFallback}>
					{"\n\n"}
					{this.state.description}
					{"\n\n"}
				</Text>}

				<Text selectable style={styles.eventTextAbbreviation}>
					{getAbbreviations(this.state.summary, global.domain)}
				</Text>
			</View>
		)
	}

	render() {
		return <View style={styles.container}>
			{this.rightSideButtons()}
			<ScrollView showsVerticalScrollIndicator={false}>
				{this._drawImage(this.state.photo1)}
				{this._drawText()}

				<ImageList
					feature={this.state._key}
					refreshFunction={this.refreshFunction}
					edit={false}
				/>

			</ScrollView>
		</View>;
	}
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

	container: {
		backgroundColor: "#fff",
		height: "100%"
	},
	contentView: {
		flex: 1
	},
	icon: {
		color: "white",
		fontSize: 25
	},
	email: {
		color: "blue",
		textDecorationLine: "underline",
	},
	englishFallback: {
		color: "grey",
		fontSize: 16,
		paddingBottom: 10,
		paddingTop: 30,
	},
	eventIcon: {
		color: "#222",
		fontSize: 30,
		marginRight: 200,
		paddingRight: 200,
	},
	sendIcon: {
		color: "white",
		fontSize: 25,
	},
	eventText: {
		color: "#222",
		fontSize: 16,
		marginRight: 20,
	},
	eventTextAbbreviation: {
		color: "grey",
		fontSize: 16,
	},
	eventTextBody: {
		color: "#222",
		fontSize: 16,
		marginRight: 20,
		marginTop: 15,
	},

	eventTextSend: {
		color: "#222",
		fontSize: 16,
		paddingBottom: 15,
		paddingLeft: 15,
		paddingRight: 10,
	},

	eventTextTime: {
		color: "#222",
		fontSize: 16,
		marginBottom: 10,
		marginRight: 20,
	},
	eventTitle: {
		color: "#222",
		fontSize: 16,
		fontWeight: "bold",
		paddingBottom: 10,
		paddingTop: 15,
	},


	newsContent: {
		flexDirection: "column",
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,
	},
	storyPhoto: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		borderColor: "lightgray",
		borderWidth: 1,
		elevation: 1,
		flex: 1,
		height: 200,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%",
	},

	textBox: {
		padding: 10,
		backgroundColor: 'rgba(52, 52, 52, 0.03)',
		alignSelf: "center",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		borderColor: "lightgray",
		borderWidth: 1,
		elevation: 1,
		flex: 1,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%",
	},
	url: {
		color: "blue",
		textDecorationLine: "underline",
	},
});

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Story);