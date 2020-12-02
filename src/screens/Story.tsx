import React, { Component } from "react";
import { Linking, View, StyleSheet, ScrollView } from "react-native";
import { Image } from "react-native-expo-image-cache";
import ParsedText from "react-native-parsed-text";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../lib/global.js";
import _ from "lodash";
import { connect } from "react-redux";
import { Text } from "../components/sComponent"
import ImageList from "../components/ImageList"
import { actionEdit, actionPhotos, actionChat, actionSend, actionCalendar, actionShare } from "../components/StoryActions"
import { StoryEntity } from '../lib/interfaces';

interface TProps {
	navigation: any,
	route: any
}

export class Story extends Component<TProps, StoryEntity>{

	constructor(props) {
		super(props);

		const {
			_key,
			summary,
			location,
			summaryMyLanguage,
			source,
			date_start,
			time_start_pretty,
			time_end_pretty,
			descriptionMyLanguage,
			description,
			photo1,
			visible,
			visibleMore,
			showIconChat,
			order,
			dateTimeStart,
			dateTimeEnd
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
			location,
			scroll: false
		};

		this.refreshFunction = this.refreshFunction.bind(this);
	}

	componentDidMount() {

		const navigation = this.props.navigation;

		navigation.setOptions({
			headerBackTitleVisible: false
		});
	}

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
		let position = 0

		const navigation = this.props.navigation
		const admin = isAdmin(this.props.route.params.adminPassword)

		if (admin && this.state.source == "feature") {
			buffer.push(actionEdit(position))
			position++
		}

		if (admin && this.state.showIconChat === true) {
			buffer.push(actionChat(position, navigation, this.state._key, this.state.summaryMyLanguage))
			position++
		}
		if (admin) {
			buffer.push(actionSend(position, navigation, this.state))
			position++
		}
		buffer.push(actionPhotos(position, navigation))
		position++
		buffer.push(actionShare(position, this.state))
		position++

		if (isValue(this.state.date_start)) {
			buffer.push(actionCalendar(position, this.state))
			position++
		}
		return (buffer)
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
						style: styles.url,
						onPress: this._handlePhonePress
					}, {
						type: "email",
						style: styles.email,
						onPress: this._handleEmailPress
					}, { pattern: /433333332/, style: styles.url }, { pattern: /#(\w+)/, style: styles.url }]} childrenProps={{ allowFontScaling: false }}>
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

	handleScroll() {
		console.log("scroll")
	}

	render() {
		return <View style={styles.container}>
			{this.rightSideButtons()}
			<ScrollView
				showsVerticalScrollIndicator={false}
				onScroll={this.handleScroll}
			>
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

	container: {
		backgroundColor: "#fff",
		height: "100%"
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