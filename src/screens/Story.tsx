import React, { Component } from "react";
import { Image, Linking, View, StyleSheet, ScrollView } from "react-native";
import ParsedText from "react-native-parsed-text";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../lib/global";
import { connect } from "react-redux";
import { Text } from "../components/sComponent"
import ImageList from "../components/ImageList"
import { actionEdit, actionPhotos, actionChat, actionSend, actionCalendar, actionShare } from "../components/StoryActions"
import { StoryEntity } from '../lib/interfaces';

interface TProps {
	navigation: any,
	route: any,
}

export class Story extends Component<TProps>{

	constructor(props: TProps) {
		super(props);
		this.refreshFunction = this.refreshFunction.bind(this);
	}

	componentDidMount() {

		const navigation = this.props.navigation;

		navigation.setOptions({
			headerBackTitleVisible: false
		});
	}

	_handleOpenWithLinking = (sURL: string) => { Linking.openURL(sURL); };
	_handleEmailPress(email: string) { Linking.openURL("mailto:" + email); }
	_handlePhonePress(phone: string) { Linking.openURL("tel:" + phone); }

	_drawImage(imageURI: string) {
		if (undefined !== imageURI && null !== imageURI && imageURI.length > 0) {
			return <View>
				<Image style={styles.storyPhoto} source={{ uri: imageURI }} />
			</View>;
		}
	}

	refreshFunction(newState: { summary: any; description: any; }) {
		console.log("refresh function")
		this.setState(
			{
				newState,
				summaryMyLanguage: newState.summary,
				descriptionMyLanguage: newState.description
			});
	}

	rightSideButtons(story: StoryEntity) {
		let buffer = []
		let position = 0

		const navigation = this.props.navigation
		const admin = isAdmin(this.props.route.params.adminPassword)

		if (admin && story.source == "feature") {
			buffer.push(actionEdit(navigation, position, story, this.refreshFunction))
			position++
		}

		if (admin && story.showIconChat === true) {
			buffer.push(actionChat(position, navigation, story._key, story.summaryMyLanguage))
			position++
		}
		if (admin) {
			buffer.push(actionSend(position, navigation, story))
			position++
		}
		buffer.push(actionPhotos(position, navigation, story._key))
		position++
		buffer.push(actionShare(position, story))
		position++

		if (isValue(story.date_start)) {
			buffer.push(actionCalendar(position, story))
			position++
		}
		return (buffer)
	}

	_drawText(story: StoryEntity) {
		return (
			<View style={styles.textBox}>
				<Text selectable style={styles.eventTitle}>
					{story.summaryMyLanguage}
				</Text>

				{isValue(story.location) && <Text selectable style={styles.eventText}>
					{story.location}
				</Text>}

				{isValue(story.date_start) && <Text selectable style={styles.eventText}>
					{formatMonth(story.date_start)}
				</Text>}


				{isValue(story.time_start_pretty) && <Text selectable style={styles.eventTextTime}>
					{formatTime(story.time_start_pretty, story.time_end_pretty)}
				</Text>}


				<ParsedText style={styles.eventTextBody} testID="story.parsedText"
					parse={[{
						pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,12}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*/i,
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
					}, { pattern: /433333332/, style: styles.url },
					{ pattern: /#(\w+)/, style: styles.url }]}
					childrenProps={{ allowFontScaling: false }}
				>
					{story.descriptionMyLanguage}
				</ParsedText>
				{this.props.auth.language != "en" && <Text selectable style={styles.englishFallback}>
					{"\n\n"}
					{story.description}
					{"\n\n"}
				</Text>}

				<Text selectable style={styles.eventTextAbbreviation}>
					{getAbbreviations(story.summary, global.domain)}
				</Text>
			</View>
		)
	}

	handleScroll() {
		console.log("scroll")
	}

	render() {

		const story: StoryEntity = this.props.route.params.story

		return <View style={styles.container}>
			{this.rightSideButtons(story)}
			<ScrollView
				showsVerticalScrollIndicator={false}
				onScroll={this.handleScroll}
			>
				{this._drawImage(story.photo1)}
				{this._drawText(story)}

				<ImageList
					feature={story._key}
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
		alignSelf: "center",
		backgroundColor: 'rgba(52, 52, 52, 0.03)',
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

const mapStateToProps = (state: { auth: any; }) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Story);