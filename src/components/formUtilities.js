

import React, { Component } from "react";
import { View, Button, Text, TouchableOpacity, Switch, StyleSheet, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert, ImagePropTypes } from "react-native";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import _ from "lodash";

class OrderOnPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={styles.settingsItem}>
			<View style={styles.settingsLeft}>
				<View>
					<Text>Order on Page</Text>
				</View>
				<View>
					<Input onChangeText={order => this.props.handler(order)} placeholder="0" value={this.props.order.toString()} keyboardType="number-pad" containerStyle={styles.inputOrderOnPage} />
				</View>
			</View>
		</View>;
	}
}

const IconChat = class IconChat extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={styles.settingsItem}>
			<View style={styles.settingsLeft}>
				<View>
					<Text>Allow Chat</Text>
				</View>

				<View>
					<Switch onValueChange={value => this.props.handler(!this.props.showIconChat)} style={styles.switch} value={this.props.showIconChat} />
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
					<Text>Home Screen</Text>
				</View>

				<View>
					<Switch onValueChange={value => this.props.handler(value)} style={styles.switch} value={this.props.visible} />
				</View>
			</View>
		</View>;
	}
}

class ShowOnMoreScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={styles.settingsItem}>
			<View style={styles.settingsLeft}>
				<View>
					<Text>More Screen</Text>
				</View>

				<View>
					<Switch onValueChange={value => this.props.handler(value)} style={styles.switch} value={this.props.visibleMore} />
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
			console.log("date_start:", date_start);

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
						<Text>Date</Text>
					</View>
					<View>
						<TouchableOpacity onPress={() => {
							this.showDatepicker();
						}}>
							<Text>
								{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("MMMM Do YYYY") : "No Date"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>


			{false && <View style={styles.settingsItem}>
				<View style={styles.settingsLeft}>
					<View>
						<Text>Time</Text>
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
								<Text style={styles.blueButton}>Clear</Text>
							</TouchableOpacity>

							<View style={styles.settings}>
								<TouchableOpacity onPress={() => {
									this.setState({ show: false });
								}}>
									<Text style={styles.blueButton}>Done</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<DateTimePicker testID="dateTimePicker" value={_.isDate(this.state.controlDate) ? this.state.controlDate : new Date()} mode={this.state.mode} is24Hour={false} display="default" onChange={this.onChange} />
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
		fontSize: 16
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
	header: {
		paddingLeft: 15,
		paddingRight: 15,

	},
	dateRow: { flex: 1, flexDirection: "row" },
	viewHeader: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",

	},
	SubmitButtonStyle: {
		backgroundColor: "#fff",
		height: 50,
		width: 250,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		elevation: 4,
		marginBottom: 30,
	},
	switchText: {
		flexDirection: "row",
		color: "#222",
		fontWeight: "bold",
		alignItems: "center",
		textAlignVertical: "top",
	},
	switch: {
		flexDirection: "row",
		alignItems: "center",
		textAlignVertical: "top",
	},
	switchContainer: {
		alignSelf: "flex-end",
	},
	containerStyle: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "#d2d2d2",
		backgroundColor: "#ffffff",
		marginVertical: 8,
	},
	containerStyleOrder: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "#d2d2d2",
		backgroundColor: "#ffffff",
		marginVertical: 8,
		width: 50,
	},
	containerStyleDate: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "#d2d2d2",
		backgroundColor: "#ffffff",
		marginVertical: 8,
		width: 200,
	},

	container: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		padding: 10,
	},

	chatHeadingLeft: {
		color: "#037AFF",
		alignSelf: "center",
		fontSize: 30,
		paddingBottom: 5,
		paddingRight: 10,
	},
	chatHeading: {
		color: "#037AFF",
		alignSelf: "center",
		fontSize: 17,
		paddingBottom: 5,
		paddingRight: 20,
		fontWeight: "600",
	},
	btnHeader: {
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		color: "black",
		fontSize: 34,
	},
	saveBtn: {
		height: 44,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#6B9EFA",
	},
	buttonText: {
		fontWeight: "500",
	},

	textHeader: {
		fontSize: 34,
		lineHeight: 41,
		color: "black",
	},
	title: {
		fontWeight: "400",
		lineHeight: 22,
		fontSize: 16,
		height: 25 + 32,
		padding: 16,
		paddingLeft: 0,
	},
	quote: {
		fontSize: 17,
		lineHeight: 38,
		color: "#333333",
		padding: 16,
		paddingLeft: 0,
		flex: 1,
		height: 200,
		marginBottom: 50,
		borderTopWidth: 1,
		borderColor: "rgba(212,211,211, 0.3)",
	},

	addButton: {
		zIndex: 990,
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderWidth: 1,
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		bottom: 20,
		right: 20,
		shadowColor: "#000000",
		shadowOpacity: 0.8,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 0,
		},
	},

	container: {
		flex: 1,
		width: null,
		height: null,
	},

	storyPhoto: {
		width: "98%",
		height: 200,
		flex: 1,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		backgroundColor: "#fff",
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		elevation: 1,
		marginBottom: 12,
		alignSelf: "center",
		borderWidth: 1,
		borderColor: "lightgray",
	},

	photoButton: {
		zIndex: 990,
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderWidth: 1,
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		bottom: 20,
		right: 20,
		shadowColor: "#000000",
		shadowOpacity: 0.8,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 0,
		},
	},

	newsContent: {
		flexDirection: "column",
		paddingTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		flex: 1,
		borderTopWidth: 1,
		borderTopColor: "#ddd",
	},
	eventTitle: {
		color: "#222",
		fontSize: 16,
		paddingTop: 15,
		paddingBottom: 10,
		fontWeight: "bold",
	},

	settingsItem: {
		flexDirection: "row",
		paddingVertical: 8,
		alignItems: "center",
		borderBottomColor: "#CED0CE",
		borderBottomWidth: 1,
	},
	settingsItemNoLine: {
		flexDirection: "row",
		backgroundColor: "white",
		alignItems: "center",
		borderBottomColor: "#CED0CE",
		borderBottomWidth: 0,
	},
	settingsLeft: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8,
		fontSize: 16,
	},
	eventText: {
		color: "#222",
		fontSize: 14,
		marginRight: 20,
	},
	eventTextBody: {
		color: "#222",
		fontSize: 14,
		marginRight: 20,
		marginTop: 15,
	},
	eventTextTime: {
		color: "#222",
		fontSize: 14,
		marginRight: 20,
		marginBottom: 10,
	},

	eventTextSend: {
		color: "#222",
		fontSize: 14,
		paddingRight: 10,
		paddingLeft: 15,
		paddingBottom: 15,
	},
	imageStyleCheckOn: {
		marginLeft: 15,
		alignSelf: "center",
		height: 30,
		width: 30,
		fontSize: 30,
		color: "#007AFF",
	},
	imageStyleCheckOff: {
		marginLeft: 15,
		alignSelf: "center",
		height: 30,
		width: 30,
		fontSize: 30,
		color: "#FFF",
	},

	photoURL: {
		color: "#222",
		fontSize: 14,
		paddingRight: 25,
		paddingBottom: 25,
	},
	englishFallback: {
		color: "grey",
		fontSize: 14,
		paddingBottom: 10,
		paddingTop: 30,
	},
	eventTextAbbreviation: {
		color: "grey",
		fontSize: 14,
		paddingBottom: 10,
	},
	url: {
		color: "blue",
		textDecorationLine: "underline",
	},

	email: {
		color: "blue",
		textDecorationLine: "underline",
	},
	calendarText: {},
	calendarButton: {
		marginTop: 0,
		marginBottom: 100,
	},
	eventIcon: {
		color: "#222",
		fontSize: 30,
		marginRight: 200,
		paddingRight: 200,
	},
	eventIconSendLock: {
		color: "#ff5722",
		fontSize: 30,
		marginRight: 200,
		paddingRight: 200,
	},

	abbreviations: {
		color: "grey",
		fontSize: 12,
		paddingTop: 20,
	},
	eventPhone: {
		color: "#222",
		fontSize: 14,
		marginLeft: 200,
		paddingLeft: 200,
	},
	newsCommentContainer: {
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 10,
		borderLeftWidth: 2,
	},
	newsComment: {
		fontWeight: "500",
		fontSize: 14,
	},
	newsLink: {
		color: "#666",
		fontSize: 12,
		alignSelf: "flex-start",
		fontWeight: "bold",
	},
	newsTypeView: {
		borderBottomWidth: 1,
		borderBottomColor: "#666",
	},
	newsTypeText: {
		color: "#666",
		fontSize: 12,
		fontWeight: "bold",
		paddingBottom: 5,
	},
	newsPoster: {
		height: 215,
		width: null,
		resizeMode: "contain",
	},
	newsPosterHeader: {
		fontWeight: "900",
	},
	newsPosterContent: {
		flexDirection: "column",
		paddingTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		flex: 1,
	},
	timeIcon: {
		fontSize: 20,
		marginLeft: Platform.OS === "android" ? 15 : 0,
		paddingLeft: Platform.OS === "android" ? 0 : 20,
		paddingRight: 10,
		marginTop: Platform.OS === "android" ? -1 : -3,
		color: "#666",
	},
	nightButton: {
		backgroundColor: "rgba(0,0,0,0.2)",
		borderRadius: 30,
		width: 60,
		height: 60,
	},
	dayButton: {
		backgroundColor: "#fff",
		borderRadius: 30,
		width: 60,
		height: 60,
	},
	modal: {
		position: "absolute",
		height: null,
	},
	slide: {
		flex: 1,
		backgroundColor: "transparent",
	},
	wrapper: {
		flex: 1,
	},

	imageHeader: {
		height: 135,
		width: 225,
		resizeMode: "contain",

		justifyContent: "center",
		alignItems: "center",
	},
	headerIcons: {
		fontSize: 30,
		backgroundColor: "transparent",
		color: "black",
	},
	headerContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: -5,
		marginLeft: Platform.OS === "android" ? -5 : undefined,
	},
	headerBtns: {
		padding: 10,
	},
	headerTextIcon: {
		fontSize: 28,
		paddingTop: 10,
		marginTop: Platform.OS === "android" ? -10 : 0,
	},
	swiperDot: {
		backgroundColor: "rgba(0,0,0,.8)",
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 3,
	},
	swiperActiveDot: {
		backgroundColor: "#fff",
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 3,
	},
	modalContentBox: {
		borderBottomWidth: 1,
		borderBottomColor: Platform.OS === "android" ? "#fff" : "rgba(255,255,255,0.5)",
	},
	modalSmallText: {
		alignSelf: "flex-start",
		fontWeight: "700",
	},
	modalLargeText: {
		alignSelf: "flex-end",
		fontSize: 24,
		fontWeight: "700",
		lineHeight: 28,
		// paddingBottom: Platform.OS === 'android' ? 10 : 0,
		// marginTop: Platform.OS === 'android' ? -10 : 0
	},
	nextStoryBtn: {
		fontWeight: "900",
	},
	forwardBtn: {
		fontSize: 26,
	},

});

export { IconChat, OrderOnPage, ShowOnHomeScreen, ShowOnMoreScreen, EventDateTime };