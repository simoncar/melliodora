import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Agenda } from "react-native-calendars";
import CalendarItem from "../components/CalendarItem";
import { useDomain, useLanguage } from "../lib/globalState";
import { getCalendarItems } from "../lib/APICalendar";
import * as Progress from "expo-progress";

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
		console.log("set items done");
	};

	useEffect(() => {
		setLoading(false);
	}, [items]);

	useEffect(() => {
		const unsubscribe = getCalendarItems(domain, language, setCalendarItems);

		return () => {
			unsubscribe;
		};
	}, []);

	const renderItem = (item) => {
		return <CalendarItem navigation={props.navigation} story={item} domain={domain} language={language} />;
	};

	const date = new Date();
	date.setDate(date.getDate());

	return (
		<View style={{ height: "100%" }}>
			{loading && <Progress.Bar isIndeterminate color="blue" />}
			<Agenda
				renderEmptyData={() => {
					return null;
				}}
				refreshing={loading}
				items={items}
				selected={date}
				renderItem={renderItem}
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
					todayTextColor: "#333333",
					textSectionTitleColor: "#999999",
				}}
			/>
		</View>
	);
}
