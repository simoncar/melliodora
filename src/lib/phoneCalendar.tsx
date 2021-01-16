import { Alert } from "react-native";
import * as Calendar from "expo-calendar";
import I18n from "./i18n";
import * as Permissions from "expo-permissions";
import { StoryEntity } from "../lib/interfaces";

export const phoneCalendar = async (event: StoryEntity) => {
	const { summaryMyLanguage, descriptionMyLanguage, date_start, location } = event;
	var newEvent = {};

	const _askForCalendarPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.CALENDAR);
		return response.status === "granted";
	};

	newEvent = {
		title: summaryMyLanguage,
		location: location || "",
		allDay: true,
		startDate: new Date(date_start),
		endDate: new Date(date_start),
		notes: descriptionMyLanguage,
		timeZone: "Asia/Singapore",
	};

	try {
		const calendarGranted = await _askForCalendarPermissions();

		if (calendarGranted) {
			const defaultCalendarID = await getDefaultCalendarID();
			await Calendar.createEventAsync(defaultCalendarID.id, newEvent);
			Alert.alert(I18n.t("saved"));
			return "Success";
		} else {
			Alert.alert(I18n.t("error"), I18n.t("permissionsNoCalendar"));
			return "Fail";
		}
	} catch (e) {
		Alert.alert(I18n.t("error"), e.message);
		return "Fail";
	}
};

async function getDefaultCalendarID() {
	const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
	const defaultCalendars = calendars.filter((each) => each.source.name === "Default");
	return defaultCalendars[0];
}
