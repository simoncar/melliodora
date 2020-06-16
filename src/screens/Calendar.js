
import React, { Component } from "react";
import { Image, View, TouchableOpacity, AsyncStorage, StyleSheet } from "react-native";
import * as firebase from "firebase";

import { Agenda } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

import I18n from "../lib/i18n";
import moment from "moment";
import CalendarItem from "../components/CalendarItem";
import Analytics from "../lib/analytics";
import { Text } from "../components/sComponent";

const tabBarIcon = name => ({ tintColor }) => <Ionicons style={styles.a36552790af7b11ea88c25dbffc760ad0} name={name} color={tintColor} size={24} />;

var todayItem = {};
const todayDate = moment().format("YYYY-MM-DD");

class calendar1 extends Component {
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

	static navigationOptions = ({ navigation }) => ({
		title: I18n.t("calendar"),
		headerRight: <TouchableOpacity onPress={() => {
			navigation.push("searchCalendar");
		}}>
			<View style={styles.a36554ea0af7b11ea88c25dbffc760ad0}>
				<Ionicons name="md-search" style={styles.a365575b0af7b11ea88c25dbffc760ad0} />
			</View>
		</TouchableOpacity>
	});

	componentDidMount() {
		moment.updateLocale;
		this.calendarEvents = firebase.firestore().collection(global.domain).doc("calendar").collection("calendarItems");

		this.loadFromAsyncStorage();

		this.listenLoadFromFirebase(this.calendarEvents);
		Analytics.track("Calendar");
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	listenLoadFromFirebase(dataSnapshot2) {
		dataSnapshot2.get().then(snapshot => {
			var items2 = {};
			var newItems = {};
			var trans = {};
			// this.loadItems();
			var itemCount = 0;
			var strtime = 0;

			for (let i = -15; i < 365; i++) {
				const time = Date.now() + i * 24 * 60 * 60 * 1000;
				const strtime2 = this.timeToString(time);
				newItems[strtime2] = [];
			}

			items2 = newItems;
			//items2 = this.state.items;
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
				// items2.push(doc.data());

				//   console.log (snapshot)
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
		}).catch(err => {
			console.log("Error getting documents", err);
		});
	}

	loadFromAsyncStorage() {
		AsyncStorage.getItem("calendarItems").then(fi => {
			var items = JSON.parse(fi);
			console.log("items2222", items);
			if (null != items) {
				this.setState({
					items,
					loading: false
				});
			}
		});
	}

	_storeData = async calendarItems => {
		try {
			AsyncStorage.setItem("calendarItems", calendarItems);
		} catch (error) {
			console.log(error);
			// Error saving data
		}
	};

	loadItems(day) {
		setTimeout(() => {
			const newItems = {};

			for (let i = -15; i < 365; i++) {
				const time = Date.now() + i * 24 * 60 * 60 * 1000;
				const strtime = this.timeToString(time);
				newItems[strtime] = [];
			}

			// Object.keys(this.state.items).forEach(key => {
			//   newItems[key] = this.state.items[key];
			// });
			// this.setState({
			//   items: newItems,
			// });
		}, 1000);
	}

	render() {
		const date = new Date();
		date.setDate(date.getDate());

		return <Agenda items={this.state.items}
			// loadItemsForMonth={this.loadFromAsyncStorage.bind(this)}
			selected={date} renderItem={this.renderItem.bind(this)} renderEmptyDate={this.renderEmptyDate.bind(this)}
			//rowHasChanged={this.rowHasChanged.bind(this)}
			rowHasChanged={(r1, r2) => {
				return r1.summary !== r2.summary;
			}} hideKnob={false} renderKnob={() => {
				return <Ionicons style={styles.a36563900af7b11ea88c25dbffc760ad0} name="ios-arrow-down" />;
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
			}} style={styles.a36563901af7b11ea88c25dbffc760ad0} />;
	}

	renderItem(item) {
		return <CalendarItem navigation={this.props.navigation} item={item} />;
	}

	getIcon(eventDetails) {
		let ret = "";

		if (ret.contains("sport")) {
			ret = "ios-american-football";
		} else if (ret.contains("art")) {
			ret = "ios-brush";
		} else {
			ret = "";
		}

		return ret;
	}

	renderEmptyDate(item) {
		return <View style={styles.a36563902af7b11ea88c25dbffc760ad0}>
			<Text style={styles.a36563903af7b11ea88c25dbffc760ad0} />
		</View>;
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
	a36552790af7b11ea88c25dbffc760ad0: {
		backgroundColor: "transparent"
	},
	a36554ea0af7b11ea88c25dbffc760ad0: {
		color: "#48484A",
		fontSize: 25,
		marginRight: 10
	},
	a365575b0af7b11ea88c25dbffc760ad0: {
		color: "#48484A",
		fontSize: 25,
		marginRight: 10
	},
	a36563900af7b11ea88c25dbffc760ad0: {
		color: "#999999",
		fontSize: 30
	},
	a36563901af7b11ea88c25dbffc760ad0: {},
	a36563902af7b11ea88c25dbffc760ad0: {
		height: 15,
		flex: 1,
		paddingTop: 30
	},
	a36563903af7b11ea88c25dbffc760ad0: {
		color: "black"
	},

});

export default calendar1;