import firebase from "../lib/firebase";
import moment from "moment";
import I18n from "../lib/i18n";
import { getLanguageString } from "../lib/global";
import { StoryEntity } from "./interfaces";

export function getCalendarItems(domain: string, language: string, callback: any) {
	const todayDay = moment().format("MMMM Do");
	const todayItem: any = {};
	const todayDate: string = moment().format("YYYY-MM-DD");

	todayItem[todayDate] = [];
	todayItem[todayDate].push({
		key: "todayKey",
		summary: I18n.t("today") + " " + todayDay,
		summaryMyLanguage: I18n.t("today") + " " + todayDay,
		icon: "md-radio-button-off",
		color: "yellow",
		title: todayDay,
		marginBottom: 25,
	});
	callback(todayItem);

	const dateValToString = (dateVal: number) => {
		const date = new Date(dateVal);
		return date.toISOString().split("T")[0];
	};

	const today = new Date();
	const rangeStart = today.setDate(-30);

	const unsubscribe = firebase
		.firestore()
		.collection(domain)
		.doc("calendar")
		.collection("calendarItems")
		.where("timestamp", ">=", new Date(rangeStart))
		.onSnapshot(function (snapshot) {
			let fullItems: any = {};
			const newItems: any = {};
			const searchItems: StoryEntity[] = [];

			let dayCode = 0;

			for (let i = -15; i < 365; i++) {
				const dateVal = Date.now() + i * 24 * 60 * 60 * 1000;
				const dayCode2 = dateValToString(dateVal);
				newItems[dayCode2] = [];
			}

			fullItems = newItems;
			const todayDay = moment().format("MMMM Do");

			fullItems[todayDate].push({
				key: "todayKey",
				summary: I18n.t("today") + " " + todayDay,
				summaryMyLanguage: I18n.t("today") + " " + todayDay,
				icon: "md-radio-button-off",
				color: "yellow",
				title: todayDay,
			});

			snapshot.forEach((doc) => {
				dayCode = doc.data().date_start.substring(0, 10);

				if (!fullItems[dayCode]) {
					fullItems[dayCode] = [];
				}

				const event = {
					source: "calendar",
					summaryMyLanguage: doc.data().summary,
					descriptionMyLanguage: doc.data().description,
					description: doc.data().description,
					color: doc.data().color,
					visible: true,
					summary: doc.data().summary,
					summaryEN: doc.data().summary,
					location: doc.data().location,
					date_start: doc.data().date_start,
					time_start_pretty: doc.data().time_start_pretty,
					time_end_pretty: doc.data().time_end_pretty,
					showIconChat: false,
					number: doc.data().number,
					key: doc.id,
					order: 0,
				};

				fullItems[dayCode].push(event);
				searchItems.push(event);
			});
			callback(fullItems, searchItems);
		});

	return () => unsubscribe();
}

export function getCalendarToday(domain: string, language: string, callback: any) {
	const todayDate = moment().format("YYYY-MM-DD");

	const calendarItems = [];

	const unsubscribe = firebase
		.firestore()
		.collection(domain)
		.doc("calendar")
		.collection("calendarItems")
		.where("date_start", "==", todayDate)
		.onSnapshot(function (snapshot) {
			snapshot.forEach((doc) => {
				const trans = {
					visible: true,
					source: "calendar",
					summaryMyLanguage: getLanguageString(language, doc.data(), "summary"),
					summary: doc.data().summary,
					summaryEN: doc.data().summary,
					date_start: doc.data().date_start,
					color: "red",
					showIconChat: false,
					descriptionMyLanguage: getLanguageString(language, doc.data(), "description"),
					number: doc.data().number,
				};
				calendarItems.push({
					...{ key: doc.id },
					...doc.data(),
					...trans,
				});
			});
			callback(calendarItems);
		});

	return () => unsubscribe();
}
