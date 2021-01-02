import { Alert, Platform } from "react-native";
import * as Calendar from 'expo-calendar';
import I18n from "./i18n";
import * as Permissions from 'expo-permissions';

export const phoneCalendar = async (event) => {
	const { summaryMyLanguage, descriptionMyLanguage, date_start, location } = event;
	var newEvent = {};


	const _askForCalendarPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.CALENDAR)
		return response.status === 'granted'
	}

	const _askForReminderPermissions = async () => {
		if (Platform.OS === 'android') {
			return true
		}
		const response = await Permissions.askAsync(Permissions.REMINDERS)
		return response.status === 'granted'
	}

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

		const calendarGranted = await _askForCalendarPermissions()
		const reminderGranted = await _askForReminderPermissions()

		if (calendarGranted && reminderGranted) {
			const defaultCalendarID = await getDefaultCalendarID();
			await Calendar.createEventAsync(defaultCalendarID.id, newEvent);
			Alert.alert(I18n.t("saved"));
			return "Success"
		} else {
			Alert.alert(I18n.t("error"), I18n.t("permissionsNoCalendar"));
			return "Fail"
		}

	} catch (e) {
		Alert.alert(I18n.t("error"), e.message);
		return "Fail"
	}
};

async function getDefaultCalendarID() {
	const calendars = await Calendar.getCalendarsAsync();
	const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
	return defaultCalendars[0];
}

