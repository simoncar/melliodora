import React, { Component } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import I18n from "../lib/i18n";
import moment from "moment";
import _ from "lodash";

export interface OrderProps {
	handler(order: number): any;
	order: number;
}

class OrderOnPage extends Component<OrderProps> {
	constructor(props: OrderProps) {
		super(props);
	}

	render() {
		return <View style={styles.settingsItem}>
			<View style={styles.settingsLeft}>
				<View>
					<Text>{I18n.t("order")}</Text>
				</View>
				<View>
					<Input onChangeText={order => this.props.handler(order)} placeholder="0" value={this.props.order.toString()} keyboardType="number-pad" containerStyle={styles.inputOrderOnPage} />
				</View>
			</View>
		</View>;
	}
}

export interface IconChatPops {
	handler(show: boolean): any;
	showIconChat: boolean;
}

const IconChat = class IconChat extends Component<IconChatPops> {

	constructor(props: IconChatPops) {
		super(props);
	}

	render() {
		return <View style={styles.settingsItem}>
			<View style={styles.settingsLeft}>
				<View>
					<Text>{I18n.t("chat")}</Text>
				</View>

				<View>
					<Switch onValueChange={() =>
						this.props.handler(!this.props.showIconChat)}

						style={styles.switch}
						value={this.props.showIconChat} />
				</View>
			</View>
		</View>;
	}
};

class ShowOnHomeScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={styles.settingsItem}>
			<View style={styles.settingsLeft}>
				<View>
					<Text>{I18n.t("visible")}</Text>
				</View>

				<View>
					<Switch onValueChange={value => this.props.handler(value)} style={styles.switch} value={this.props.visible} />
				</View>
			</View>
		</View>;
	}
}



class EventDateTime extends Component {
	constructor(props) {
		super(props);

		var timestamp = null;
		if (_.isObject(props.dateTimeStart)) {
			if (_.isFunction(props.dateTimeStart.toDate)) {
				timestamp = props.dateTimeStart.toDate();
			}
		}

		this.state = {
			dateEvent: timestamp,
			dateTimeStart: timestamp,
			mode: "date",
			show: false
		};
	}

	onChange = (event, selectedDate) => {

		// if (this.state.dateTimeEnd != undefined) {
		// 	//always force the 'date' of the endTime to the 'date' of the start time, regardless of the 'time'
		// 	var dateEnd = moment(selectedDate).format("YYYY-MM-DD")
		// 	var timeEnd = moment(this.state.dateTimeEnd).format("hh:mm")

		// 	var timeAndDate = moment(dateEnd + ' ' + timeEnd);
		// 	console.log("FORCE END DATE CHANGE", dateEnd, timeEnd, timeAndDate)
		// 	this.setState({
		// 		dateTimeEnd: timeAndDate,
		// 	})
		// }

		if (this.state.startEnd == "start") {

			// var dateStart = moment(selectedDate).format("YYYY-MM-DD")
			// var timeEnd = "00:00"

			// var timeAndDate = moment(dateStart + ' ' + timeEnd);

			this.setState({
				dateTimeStart: selectedDate,
				controlDate: selectedDate
			});

			var date_start = "";

			if (moment(selectedDate).isValid()) {
				date_start = moment(selectedDate).format("YYYY-MM-DD");
			} else {
				date_start = "";
			}

			this.props.handler(selectedDate, selectedDate, date_start);
		} else {
			// //always force the 'date' of the endTime to the 'date' of the start time, regardless of the 'time'
			// var dateEnd = moment(selectedDate).format("YYYY-MM-DD")
			// var timeEnd = moment(selectedDate).format("hh:mm")

			// var timeAndDate = moment(dateEnd + ' ' + timeEnd);
			// console.log("END TIME AND DATE", dateEnd, timeEnd, timeAndDate)

			// this.setState({
			// 	dateTimeEnd: selectedDate,
			// 	controlDate: selectedDate
			// });
			// this.props.handler(this.state.dateTimeStart, selectedDate);
		}
	};

	showMode = (currentMode, startEnd) => {
		this.setState({
			show: true,
			mode: currentMode,
			startEnd: startEnd
		});

		if (startEnd == "start") {
			this.setState({ controlDate: this.state.dateTimeStart });
		} else {
			this.setState({ controlDate: this.state.dateTimeEnd });
		}
	};

	showDatepicker = () => {
		if (!_.isDate(this.state.dateTimeStart)) {
			var selectedDate = new Date();
			this.setState({ dateTimeStart: selectedDate });
			this.props.handler(selectedDate, selectedDate, moment(selectedDate).format("YYYY-MM-DD"));
		}
		//if (!_.isDate(this.state.dateTimeEnd)) this.setState({ dateTimeEnd: new Date() });

		this.showMode("date", "start");
	};

	showStartTimepicker = () => {
		if (!_.isDate(this.state.dateTimeStart)) this.setState({ dateTimeStart: new Date() });
		this.showMode("time", "start");
	};

	showEndTimepicker = () => {
		if (!_.isDate(this.state.dateTimeEnd)) this.setState({ dateTimeEnd: new Date() });
		this.showMode("time", "end");
	};

	render() {
		return <View>

			<View style={styles.settingsItem}>
				<View style={styles.settingsLeft}>
					<View>
						<Text>{I18n.t("date")}</Text>
					</View>
					<View>
						<TouchableOpacity onPress={() => {
							this.showDatepicker();
						}}>
							<Text>
								{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("MMMM Do YYYY") : I18n.t("noDate")}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>


			{false && <View style={styles.settingsItem}>
				<View style={styles.settingsLeft}>
					<View>
						<Text>{I18n.t("time")}</Text>
					</View>
					<View style={styles.settingsRightTime}>
						<TouchableOpacity onPress={() => {
							this.showStartTimepicker();
						}}>
							<Text>
								{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("h:mm a") : "Time"}
							</Text>
						</TouchableOpacity>
						<Text> - </Text>
						<TouchableOpacity onPress={() => {
							this.showEndTimepicker();
						}}>
							<Text>
								{_.isDate(this.state.dateTimeEnd) ? moment(this.state.dateTimeEnd).format("h:mm a") : "End"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>}
			<View>
				{this.state.show && <View>
					<View style={styles.settingsItem}>
						<View style={styles.settingsLeft}>
							<TouchableOpacity onPress={() => {
								this.setState({ show: false, dateTimeStart: "", dateTimeEnd: "", date_start: "" });
								this.props.handler(null, null, "");
							}}>
								<Text style={styles.blueButton}>{I18n.t("clear")}</Text>
							</TouchableOpacity>

							<View style={styles.settings}>
								<TouchableOpacity onPress={() => {
									this.setState({ show: false });
								}}>
									<Text style={styles.blueButton}>{I18n.t("done")}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<DateTimePicker
						testID="dateTimePicker"
						value={_.isDate(this.state.controlDate) ? this.state.controlDate : new Date()}
						mode={this.state.mode}
						is24Hour={false}
						display="default"
						onChange={this.onChange} />
				</View>}
			</View>
		</View>;
	}
}

const styles = StyleSheet.create({

	blueButton: {
		color: "blue",
		fontSize: 20
	},
	inputOrderOnPage: {
		width: 50
	},
	settingsItem: {
		alignItems: "center",
		borderBottomColor: "#CED0CE",
		borderBottomWidth: 1,
		flexDirection: "row",
		paddingVertical: 8
	},
	settingsLeft: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8,
		fontSize: 16,
	},
	settingsRightTime: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	switch: {
		alignItems: "center",
		flexDirection: "row",
		textAlignVertical: "top"
	},

});

export { IconChat, OrderOnPage, ShowOnHomeScreen, EventDateTime };