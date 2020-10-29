import { Alert } from "react-native";
import * as Calendar from 'expo-calendar';

export const phoneCalendar = async (event) => {
	const { summaryMyLanguage, descriptionMyLanguage, date_start, location } = event;
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
		const defaultCalendarID = await getDefaultCalendarID();
		await Calendar.createEventAsync(defaultCalendarID.id, newEvent);
		Alert.alert("Saved to Calendar");
	} catch (e) {
		Alert.alert("Event not saved", e.message);
	}
};

async function getDefaultCalendarID() {
	const calendars = await Calendar.getCalendarsAsync();
	const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
	return defaultCalendars[0];
}

