import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import CalendarItem from "../components/CalendarItem";
import { useDomain, useLanguage } from "../lib/globalState";
import { getCalendarItems } from "../lib/APICalendar";
import { Ionicons } from "@expo/vector-icons";

interface TProps {
	navigation: any;
	route: any;
}

export default function Calendar(props: TProps) {
	const [fullItems, setFullItems] = useState({});
	const [searchItems, setSearchItems] = useState({});
	const [loading, setLoading] = useState(true);
	const [, , domain] = useDomain();
	const [, , language] = useLanguage();

	const setCalendarItems = (fullItems, searchItems) => {
		setFullItems(fullItems);
		setSearchItems(searchItems);

		console.log("Search Items:", searchItems);
	};

	useEffect(() => {
		props.navigation.setOptions({
			// eslint-disable-next-line react/display-name
			headerRight: () => {
				return (
					<TouchableOpacity
						onPress={() => {
							props.navigation.push("searchCalendar", {
								data: searchItems,
							});
						}}>
						<View style={styles.rightView}>
							<Ionicons name="md-search" style={styles.rightIcon} />
						</View>
					</TouchableOpacity>
				);
			},
		});

		setLoading(false);
	}, []);

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
			<Agenda
				renderEmptyData={() => {
					return null;
				}}
				refreshing={loading}
				items={fullItems}
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

const styles = StyleSheet.create({
	rightIcon: {
		color: "#48484A",
		fontSize: 25,
		marginRight: 10,
	},
	rightView: {
		marginRight: 10,
	},
});
