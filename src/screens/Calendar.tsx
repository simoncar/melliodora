import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import CalendarItem from "../components/CalendarItem";
import { useDomain, useLanguage } from "../lib/globalState";
import { getCalendarItems } from "../lib/APICalendar";

interface TProps {
	navigation: any;
	route: any;
}

export default function Calendar(props: TProps) {
	const [items, setItems] = useState({});
	const [loading, setLoading] = useState(true);
	const [, , domain] = useDomain();
	const [, , language] = useLanguage();

	const setCalendarItems = (items) => {
		setItems(items);
		setLoading(false);
	};

	useEffect(() => {
		const unsubscribe = getCalendarItems(domain, language, setCalendarItems);

		return () => {
			unsubscribe;
		};
	}, []);

	const renderItem = (item) => {
		return <CalendarItem navigation={props.navigation} story={item} domain={domain} language={language} />;
	};

	const renderEmptyDate = () => {
		return;
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
	calendarTheme: {},
});
