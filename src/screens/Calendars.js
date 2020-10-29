
import React, { Component } from "react";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import * as Calendar from 'expo-calendar';
import { Ionicons } from "@expo/vector-icons";
import * as Analytics from 'expo-firebase-analytics';

import { SettingsListItem } from "../components/SettingsListItem";
import { Text } from "../components/sComponent";

//
//
// THIS SCREEN IS NO-LONGER IN USE
//
// 

class Calendars extends Component {

	constructor(props) {
		super(props);

		this.state = {
			haveCalendarPermissions: false,
			haveReminderPermissions: false,
			calendars: this.props.calendars || [],
			activeCalendarId: null,
			activeCalendarEvents: [],
			showAddNewEventForm: false,
			editingEvent: null
		};

		if (this.props.calendars) {
			this.state.calendars = this.props.calendars
		}
	}
	componentDidMount() {
		this._findCalendars();
	}

	_findCalendars = async () => {
		const { status } = await Calendar.requestCalendarPermissionsAsync();

		if (status === "granted") {
			const calendars = await Calendar.getCalendarsAsync();
			this.setState({ calendars: [...calendars] });
		}
	};

	getDefaultCalendarSource = async () => {
		const calendars = await Calendar.getCalendarsAsync();
		const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
		return defaultCalendars[0].source;
	};

	_addEvent = async phoneCalendarID => {

		const { summaryMyLanguage, descriptionMyLanguage, date_start, location } = this.props.route.params;
		var newEvent = {};

		newEvent = {
			title: summaryMyLanguage,
			location: location || "",
			allDay: true,
			startDate: new Date(date_start),
			endDate: new Date(date_start),
			notes: descriptionMyLanguage,
			timeZone: "Asia/Singapore"
		};

		try {
			Analytics.logEvent("Calendar Add", { story: this.props.summaryMyLanguage });

			await Calendar.createEventAsync(phoneCalendarID, newEvent);
			this.props.navigation.goBack()
		} catch (e) {
			Alert.alert("Event not saved", e.message);
		}
	};

	render() {
		if (this.state.calendars.length) {

			return <View>
				<View>
					<View style={styles.newsContent}>
						<Text selectable={true} style={styles.eventTitle}>
							Select Calendar
 							</Text>
					</View>

					<ScrollView>
						{this.state.calendars.map(calendar => <SettingsListItem
							icon={<Ionicons name="ios-calendar"
								style={styles.calendarIcon} />}
							title={calendar.title}
							titleInfo={calendar.source.name}
							key={calendar.id}
							onPress={() => this._addEvent(calendar.id)} />)}
					</ScrollView>
				</View>
			</View>
		} else {
			return <View>
				<View>
					<View style={styles.newsContent}>
						<Text selectable={true} style={styles.eventTitle}>
							No Calendars Available
							  </Text>
					</View>
				</View>
			</View>
		}
	}
}

const styles = StyleSheet.create({
	calendarIcon: {
		color: "#000",
		fontSize: 22,
		paddingLeft: 10,
		paddingRight: 5
	},
	container: { backgroundColor: "#fff" },

	eventTitle: {
		fontSize: 22,
		fontWeight: "bold",
		paddingBottom: 20
	},
	newsContent: {
		borderTopColor: "#ddd",
		borderTopWidth: 1,
		paddingLeft: 20,

		paddingRight: 20,
		paddingTop: 20
	},

});


export default Calendars;
