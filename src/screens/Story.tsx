import React, { Component } from "react";
import { Linking, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import ParsedText from "react-native-parsed-text";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../lib/global";
import { Text } from "../components/sComponent";
import ImageList from "../components/ImageList";
import {
	actionEdit,
	actionPhotos,
	actionChat,
	actionSend,
	actionCalendar,
	actionShare,
} from "../components/StoryActions";
import { StoryEntity, StoryState } from "../lib/interfaces";
import Image from "../components/Imgix";

const WINDOW_WIDTH = Dimensions.get("window").width;
interface TProps {
	navigation: any;
	route: any;
	domain: string;
	language: string;
}

export default class Story extends Component<TProps, StoryState> {
	constructor(props: TProps) {
		super(props);
		this.refreshFunction = this.refreshFunction.bind(this);
		this.rightSideButtons = this.rightSideButtons.bind(this);

		const {
			_key,
			source,
			summary,
			summaryMyLanguage,
			description,
			descriptionMyLanguage,
			location,
			photo1,
			visible,
			showIconChat,
			order,
			dateTimeStart,
			dateTimeEnd,
			date_start,
			time_start_pretty,
			time_end_pretty,
		} = this.props.route.params.story;

		this.state = {
			photo1: photo1 !== undefined ? photo1 : null,
			summary: summary,
			summaryMyLanguage: summaryMyLanguage,
			description: description,
			descriptionMyLanguage: descriptionMyLanguage,
			visible: visible,
			showIconChat: showIconChat,
			order: order,
			_key: _key,
			date_start: date_start,
			time_start_pretty: time_start_pretty,
			time_end_pretty: time_end_pretty,
			dateTimeStart: dateTimeStart,
			dateTimeEnd: dateTimeEnd,
			cameraIcon: "camera",
			source: source,
			location: location,
		};
	}

	componentDidMount() {
		const navigation = this.props.navigation;

		navigation.setOptions({
			headerBackTitleVisible: false,
		});
	}

	_handleOpenWithLinking = (sURL: string) => {
		Linking.openURL(sURL);
	};
	_handleEmailPress(email: string) {
		Linking.openURL("mailto:" + email);
	}
	_handlePhonePress(phone: string) {
		Linking.openURL("tel:" + phone);
	}

	refreshFunction(newState: StoryState) {
		this.setState({
			summaryMyLanguage: newState.summary,
			descriptionMyLanguage: newState.description,
		});
		this.setState(newState);
	}

	rightSideButtons(story: StoryEntity) {
		let buffer = [];
		let position = 0;

		const navigation = this.props.navigation;
		const admin = isAdmin(this.props.route.params.adminPassword);
		const domain = this.props.route.params.domain;
		const language = this.props.route.params.language;

		console.log("story:", domain, language);

		if (admin && story.source == "feature") {
			buffer.push(actionEdit(navigation, position, this.state, domain, this.refreshFunction));
			position++;
		}

		if (admin && story.showIconChat === true) {
			buffer.push(actionChat(position, navigation, story._key, story.summaryMyLanguage, domain, language));
			position++;
		}
		if (admin) {
			buffer.push(actionSend(position, navigation, story, domain));
			position++;
		}
		buffer.push(actionPhotos(position, navigation, story._key, domain));
		position++;
		buffer.push(actionShare(position, story));
		position++;

		if (isValue(story.date_start)) {
			buffer.push(actionCalendar(position, story));
			position++;
		}
		return buffer;
	}

	_drawText(story: StoryEntity) {
		return (
			<View style={styles.textBox}>
				<Text selectable style={styles.eventTitle}>
					{this.state.summaryMyLanguage}
				</Text>

				{isValue(this.state.location) && (
					<Text selectable style={styles.eventText}>
						{this.state.location}
					</Text>
				)}

				{isValue(this.state.date_start) && (
					<Text selectable style={styles.eventText}>
						{formatMonth(this.state.date_start)}
					</Text>
				)}

				{isValue(this.state.time_start_pretty) && (
					<Text selectable style={styles.eventTextTime}>
						{formatTime(this.state.time_start_pretty, this.state.time_end_pretty)}
					</Text>
				)}

				<ParsedText
					style={styles.eventTextBody}
					testID="story.parsedText"
					parse={[
						{
							pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,12}\b([-a-zA-Z0-9@:%_+.~#?&/=]*[-a-zA-Z0-9@:%_+~#?&/=])*/i,
							style: styles.url,
							onPress: this._handleOpenWithLinking,
						},
						{
							type: "phone",
							style: styles.url,
							onPress: this._handlePhonePress,
						},
						{
							type: "email",
							style: styles.email,
							onPress: this._handleEmailPress,
						},
						{ pattern: /433333332/, style: styles.url },
						{ pattern: /#(\w+)/, style: styles.url },
					]}
					childrenProps={{ allowFontScaling: false }}>
					{this.state.descriptionMyLanguage}
				</ParsedText>
				{this.props.route.params.language != "en" && (
					<Text selectable style={styles.englishFallback}>
						{"\n\n"}
						{this.state.description}
						{"\n\n"}
					</Text>
				)}

				<Text selectable style={styles.eventTextAbbreviation}>
					{getAbbreviations(this.state.summary, this.props.route.params.domain)}
				</Text>
			</View>
		);
	}

	render() {
		console.log("story language:", this.props.route.params.language);
		return (
			<View style={styles.container}>
				{this.rightSideButtons(this.state)}
				<ScrollView showsVerticalScrollIndicator={false}>
					<Image style={styles.storyPhoto} source={{ uri: this.state.photo1 }} />

					{this._drawText(this.state)}

					<ImageList
						feature={this.state._key}
						refreshFunction={this.refreshFunction}
						edit={false}
						domain={this.props.route.params.domain}
					/>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		height: "100%",
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
		flex: 1,
		height: WINDOW_WIDTH / 2,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%",
	},
	textBox: {
		alignSelf: "center",
		backgroundColor: "rgba(52, 52, 52, 0.03)",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		borderColor: "lightgray",
		borderWidth: 1,
		flex: 1,
		marginBottom: 12,
		padding: 10,
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
