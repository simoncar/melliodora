
import React, { Component } from "react";
import { Linking, View, TouchableOpacity, TouchableHighlight, Share, StyleSheet } from "react-native";
import { Container, Content, Text } from "native-base";
import { Ionicons, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import ParsedText from "react-native-parsed-text";
import { formatTime, formatMonth, getAbbreviations, isAdmin, isValue } from "../global.js";
import _ from "lodash";
import { connect } from "react-redux";
import stylesGlobal from "../../themes/globalTheme";

export class Story extends Component {
	constructor(props) {
		super(props);


		const { _key, summary, location, summaryMyLanguage, source, date_start, time_start_pretty, time_end_pretty, descriptionMyLanguage, description, photo1, visible, visibleMore, showIconChat, order, dateTimeStart, dateTimeEnd } = this.props.route.params;


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
	_shareMessage() {
		Share.share({
			message: "" + this.state.summaryMyLanguage + "\n" + formatMonth(this.state.date_start) + "\n" + formatTime(this.state.time_start_pretty, this.state.time_end_pretty) + " \n" + this.state.descriptionMyLanguage,
			title: this.state.summaryMyLanguage
		}).then(this._showResult).catch(error => this.setState({ result: `error: ${error.message}` }));
	}

	_handleOpenWithLinking = sURL => {

		if (sURL.indexOf("https://mystamford.edu.sg") == -1) {
			Linking.openURL(sURL);
		} else {
			this.props.navigation.navigate("authPortalEmbed", {
				url: sURL
			});
		}
	};

	_handleEmailPress(email) {
		Linking.openURL("mailto:" + email);
	}

	handlePhonePress(phone) {
		Linking.openURL("tel:" + phone);
	}

	renderText(matchingString) {
		const pattern = /\[(@[^:]+):([^\]]+)\]/i;
		const match = matchingString.match(pattern);
		return `^^${match[1]}^^`;
	}

	_drawImage(imageURI) {
		var uri = ""
		if (_.isNil(imageURI)) {
			uri = "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2Fxdesk-calendar-980x470-20181016.jpg.pagespeed.ic.BdAsh-Nj_6.jpg?alt=media&token=697fef73-e77d-46de-83f5-a45540694274";
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

	_drawIconSend() {
		if (isAdmin(this.props.route.params.adminPassword)) {
			return <TouchableOpacity onPress={() => {
				this.state.summaryMyLanguage;
				this.props.navigation.navigate("push", this.state);
			}}>
				<Text style={styles.eventTextSend}>
					<MaterialCommunityIcons name="send-lock" style={styles.eventIconSendLock} />{" "}
				</Text>
			</TouchableOpacity>;
		}
	}

	_drawIconChat(chatroom, title) {
		return <TouchableOpacity onPress={() => {
			this.props.navigation.navigate("chatStory", {
				chatroom: chatroom,
				title: title
			});
		}}>
			<Text testID="story.chatIcon" style={styles.eventText}>{this.state.showIconChat && <SimpleLineIcons  name="bubble" style={styles.eventIcon} />} </Text>
		</TouchableOpacity>;
	}

	_drawIconCalendar(params) {
		if (isValue(params.date_start)) {
			return <TouchableOpacity onPress={() => {
				this.props.navigation.navigate("phoneCalendar", this.state);
			}}>
				<Text style={styles.eventText}>
					<Ionicons name="ios-calendar" style={styles.eventIcon} />
				</Text>
			</TouchableOpacity>;
		}
	}

	_drawIconShare() {
		return <TouchableOpacity onPress={() => this._shareMessage()}>
			<Text style={styles.eventText}>
				<Ionicons name="ios-share-alt" style={styles.eventIcon} />
			</Text>
		</TouchableOpacity>;
	}
	refreshFunction(newState) {
		this.setState({ newState, summaryMyLanguage: newState.summary, descriptionMyLanguage: newState.description });
	}

	render() {
		return <Container style={styles.container}>
			{isAdmin(this.props.route.params.adminPassword) && this.state.source == "feature" && <TouchableHighlight style={styles.addButton} underlayColor="#ff7043" onPress={() => {
				this.props.navigation.navigate("Form", {
					edit: true,
					...this.state,
					refreshFunction: this.refreshFunction
				});
			}}>
				<MaterialIcons name="edit" style={styles.editIcon} />
			</TouchableHighlight>}

			<Content showsVerticalScrollIndicator={false}>
				{this._drawImage(this.state.photo1)}

				<View style={styles.iconRow}>
					{this._drawIconChat(this.state._key, this.state.summaryMyLanguage)}
					{this._drawIconCalendar(this.state)}
					{this._drawIconShare()}
					{this._drawIconSend(this.state)}
				</View>

				<View style={styles.contentView}>
					<View style={styles.newsContent}>
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


						<ParsedText style={styles.eventTextBody} parse={[{
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

						<Text> </Text>
						<Text> </Text>
						<Text selectable style={styles.eventTextAbbreviation}>
							{getAbbreviations(this.state.summary)}
						</Text>

					</View>
				</View>
			</Content>
		</Container>;
	}
}

const styles = StyleSheet.create({
	addButton: {
		alignItems: "center",
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderRadius: 50 / 2,
		borderWidth: 1,
		bottom: 20,
		height: 50,
		justifyContent: "center",
		position: "absolute",
		right: 20,
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
		backgroundColor: "#fff"
	},
	contentView: {
		flex: 1
	},
	editIcon: {
		color: "white",
		fontSize: 25
	},
	email: {
		color: "blue",
		textDecorationLine: "underline",
	},
	englishFallback: {
		color: "grey",
		fontSize: stylesGlobal.bodyFontSize,
		paddingBottom: 10,
		paddingTop: 30,
	},
	eventIcon: {
		color: "#222",
		fontSize: 30,
		marginRight: 200,
		paddingRight: 200,
	},
	eventIconSendLock: {
		color: "#ff5722",
		fontSize: 30,
		marginRight: 200,
		paddingRight: 200,
	},
	eventText: {
		color: "#222",
		fontFamily: stylesGlobal.fontFamily,
		fontSize: stylesGlobal.bodyFontSize,
		marginRight: 20,
	},
	eventTextAbbreviation: {
		color: "grey",
		fontSize: stylesGlobal.bodyFontSize,
		paddingBottom: 100,
	},
	eventTextBody: {
		color: "#222",
		fontFamily: stylesGlobal.fontFamily,
		fontSize: stylesGlobal.bodyFontSize,
		marginRight: 20,
		marginTop: 15,
	},

	eventTextSend: {
		color: "#222",
		fontSize: stylesGlobal.bodyFontSize,
		paddingBottom: 15,
		paddingLeft: 15,
		paddingRight: 10,
	},

	eventTextTime: {
		color: "#222",
		fontSize: stylesGlobal.bodyFontSize,
		marginBottom: 10,
		marginRight: 20,
	},
	eventTitle: {
		color: "#222",
		fontSize: stylesGlobal.headingFontSize,
		fontWeight: "bold",
		paddingBottom: 10,
		paddingTop: 15,
	},
	iconRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		padding: 5,
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 0,
		flex: 1,
		borderTopWidth: 1,
		borderTopColor: "#ddd"
	},

	newsContent: {
		borderTopColor: "#ddd",
		borderTopWidth: 1,
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
	url: {
		color: "blue",
		textDecorationLine: "underline",
	},


});

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Story);
//export default compose(myFunction, connect(mapStateToProps)(Story));