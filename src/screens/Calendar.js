
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import * as firebase from "firebase";
import { Agenda } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-community/async-storage';
import I18n from "../lib/i18n";
import moment from "moment";
import CalendarItem from "../components/CalendarItem";


var todayItem = {};
const todayDate = moment().format("YYYY-MM-DD");

class Calendar extends Component {
	constructor(props) {
		super(props);

		const todayDay = new moment().format("MMMM Do");

		todayItem[todayDate] = [];

		todayItem[todayDate].push({
			summary: I18n.t("today") + " " + todayDay,
			summaryMyLanguage: I18n.t("today") + " " + todayDay,
			icon: "md-radio-button-off",
			color: "yellow",
			title: todayDay,
			marginBottom: 25
		});

		this.state = {
			items: todayItem
		};
	}

	componentDidMount() {
		moment.updateLocale;
		this.calendarEvents = firebase
			.firestore()
			.collection(global.domain)
			.doc("calendar")
			.collection("calendarItems");

		this.loadFromAsyncStorage();
		this.listenLoadFromFirebase(this.calendarEvents);
	
	}

	listenLoadFromFirebase(dataSnapshot2) {
		dataSnapshot2.get().then(snapshot => {
			var items2 = {};
			var newItems = {};
			var trans = {};
			var itemCount = 0;
			var strtime = 0;

			for (let i = -15; i < 365; i++) {
				const time = Date.now() + i * 24 * 60 * 60 * 1000;
				const strtime2 = this.timeToString(time);
				newItems[strtime2] = [];
			}

			items2 = newItems;
			const todayDay = new moment().format("MMMM Do");

			items2[todayDate].push({
				summary: I18n.t("today") + " " + todayDay,
				summaryMyLanguage: I18n.t("today") + " " + todayDay,
				icon: "md-radio-button-off",
				color: "yellow",
				title: todayDay
			});

			snapshot.forEach(doc => {
				itemCount++;
				strtime = doc.data().date_start;
				strtime = strtime.substring(0, 10);

				if (!items2[strtime]) {
					items2[strtime] = [];
				}

				trans = {
					source: "calendar",
					summaryMyLanguage: doc.data().summary,
					descriptionMyLanguage: doc.data().description,
					color: doc.data().color
				};

				var event = { ...{ _key: doc.id }, ...doc.data(), ...trans };
				items2[strtime].push(event);
			});

			if (itemCount > 10) {
				this._storeData(JSON.stringify(items2));
			}

			this.setState({
				items: items2
			});
		})
	}

	loadFromAsyncStorage() {
		AsyncStorage.getItem("calendarItems").then(fi => {
			var items = JSON.parse(fi);
			if (null != items) {
				this.setState({
					items,
					loading: false
				});
			}
		});
	}

	_storeData = async calendarItems => {
		AsyncStorage.setItem("calendarItems", calendarItems);
	};



	render() {
		const date = new Date();
		date.setDate(date.getDate());

		return <Agenda
			renderEmptyData={() => { return null }}
			items={this.state.items}
			selected={date}
			renderItem={this.renderItem.bind(this)}
			renderEmptyDate={this.renderEmptyDate.bind(this)}
			rowHasChanged={(r1, r2) => {
				return r1.summary !== r2.summary;
			}} hideKnob={false} renderKnob={() => {
				return <Ionicons style={styles.calendarIcon} name="ios-arrow-down" />;
			}} theme={{
				selectedDayBackgroundColor: "#111111",
				dayTextColor: '#333333',
				dotColor: 'black',
				selectedDotColor: 'white',
				agendaDayTextColor: '#999999',
				agendaDayNumColor: '#999999',
				agendaTodayColor: '#111111',
				agendaTodayFontWeight: 'bold',
				agendaTodayTextColor: "#333333",
				todayTextColor: '#333333',
				textSectionTitleColor: '#999999'
			}} style={styles.calendarTheme} />;
	}

	renderItem(item) {
		return <CalendarItem navigation={this.props.navigation} item={item} />;
	}

	renderEmptyDate() {
		return;
	}

	rowHasChanged(r1, r2) {
		return r1.name !== r2.name;
	}

	timeToString(time) {
		const date = new Date(time);
		return date.toISOString().split("T")[0];
	}

	pad(n, width, z) {
		z = z || "0";
		n += "";
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
}

const styles = StyleSheet.create({

	calendarIcon: {
		color: "#999999",
		fontSize: 30
	},
	calendarTheme: {},

});

export default Calendar;