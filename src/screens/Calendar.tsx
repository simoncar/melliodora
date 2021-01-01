import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import firebase from "../lib/firebase";
import { Agenda } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import moment from "moment";
import CalendarItem from "../components/CalendarItem";
import { useDomain, useLanguage } from "../lib/globalState";

const todayItem = {};
const todayDate = moment().format("YYYY-MM-DD");

interface TProps {
	navigation: any;
}

export default function Calendar(props: TProps) {
	const [items, setItems] = useState({});
	const [, , domain] = useDomain();
	const [, , language] = useLanguage();

	useEffect(() => {
		const todayDay = new moment().format("MMMM Do");

		todayItem[todayDate] = [];
		todayItem[todayDate].push({
			_key: "todayKey",
			summary: I18n.t("today") + " " + todayDay,
			summaryMyLanguage: I18n.t("today") + " " + todayDay,
			icon: "md-radio-button-off",
			color: "yellow",
			title: todayDay,
			marginBottom: 25,
		});

		setItems(todayItem);

		const unsubscribe = firebase
			.firestore()
			.collection(domain)
			.doc("calendar")
			.collection("calendarItems")
			.onSnapshot(function (snapshot) {
				var items2 = {};
				var newItems = {};
				var trans = {};
				var strtime = 0;

				for (let i = -15; i < 365; i++) {
					const time = Date.now() + i * 24 * 60 * 60 * 1000;
					const strtime2 = timeToString(time);
					newItems[strtime2] = [];
				}

				items2 = newItems;
				const todayDay = new moment().format("MMMM Do");

				items2[todayDate].push({
					_key: "todayKey",
					summary: I18n.t("today") + " " + todayDay,
					summaryMyLanguage: I18n.t("today") + " " + todayDay,
					icon: "md-radio-button-off",
					color: "yellow",
					title: todayDay,
				});

				snapshot.forEach((doc) => {
					strtime = doc.data().date_start;
					strtime = strtime.substring(0, 10);

					if (!items2[strtime]) {
						items2[strtime] = [];
					}

					trans = {
						source: "calendar",
						summaryMyLanguage: doc.data().summary,
						descriptionMyLanguage: doc.data().description,
						color: doc.data().color,
					};

					var event = { ...{ _key: doc.id }, ...doc.data(), ...trans };
					items2[strtime].push(event);
				});
				console.log("setItems Calendar ");
				setItems(items2);
			});

		return () => {
			console.log("calendar UNSUBSCRIBE");
			unsubscribe();
		};
	}, []);

	const renderItem = (item) => {
		return <CalendarItem navigation={props.navigation} story={item} domain={domain} language={language} />;
	};

	const renderEmptyDate = () => {
		return;
	};

	const timeToString = (time) => {
		const date = new Date(time);
		return date.toISOString().split("T")[0];
	};

	const date = new Date();
	date.setDate(date.getDate());

	return (
		<Agenda
			renderEmptyData={() => {
				return null;
			}}
			items={items}
			selected={date}
			renderItem={renderItem}
			renderEmptyDate={renderEmptyDate}
			rowHasChanged={(r1, r2) => {
				return r1.summary !== r2.summary;
			}}
			hideKnob={false}
			theme={{
				selectedDayBackgroundColor: "#111111",
				dayTextColor: "#333333",
				dotColor: "black",
				selectedDotColor: "white",
				agendaDayTextColor: "#999999",
				agendaDayNumColor: "#999999",
				agendaTodayColor: "#111111",
				agendaTodayFontWeight: "bold",
				agendaTodayTextColor: "#333333",
				todayTextColor: "#333333",
				textSectionTitleColor: "#999999",
			}}
			style={styles.calendarTheme}
		/>
	);
}

const styles = StyleSheet.create({
	calendarIcon: {
		color: "#999999",
		fontSize: 30,
	},
	calendarTheme: {},
});
