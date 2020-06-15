
import React, { Component } from "react";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import { Container, Content, Button } from "native-base";
import * as Calendar from "expo-calendar";
import { Ionicons } from "@expo/vector-icons";
import I18n from "../../lib/i18n";
import Analytics from "../../lib/analytics";
import moment from "moment";

import { SettingsListItem, Separator } from "../../components/settings/SettingsListItem";
import { Text } from "../../components/common/sComponent";

class Calendars extends Component {

	constructor(props) {
		super(props);

		this.state = {
			haveCalendarPermissions: false,
			haveReminderPermissions: false,
			calendars: [],
			activeCalendarId: null,
			activeCalendarEvents: [],
			showAddNewEventForm: false,
			editingEvent: null
		};
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
			Analytics.track("Calendar Add", { story: this.props.summaryMyLanguage });

			await Calendar.createEventAsync(phoneCalendarID, newEvent);
			this.props.navigation.goBack();
		} catch (e) {
			Alert.alert("Event not saved", e.message);
		}
	};

	render() {
		console.log(this.state.calendars);
		if (this.state.calendars.length) {

			return <Container style={styles.container}>
				<Content showsVerticalScrollIndicator={false}>
					<View>
						<View style={styles.newsContent}>
							<Text selectable={true} style={styles.eventTitle}>
								Select Calendar
              					</Text>
						</View>

						<ScrollView>
							{this.state.calendars.map(calendar => <SettingsListItem icon={<Ionicons name="ios-calendar" style={styles.calendarIcon} />} title={calendar.title} titleInfo={calendar.type} key={calendar.id} onPress={() => this._addEvent(calendar.id)} />)}
						</ScrollView>
					</View>
				</Content>
			</Container>;
		}

		return <View />;
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