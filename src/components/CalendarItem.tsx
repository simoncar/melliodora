
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "./sComponent";
import Image from "../components/Imgix"
import { Grid, Col, Row } from "react-native-easy-grid";
import { formatTime } from "../lib/global";
import _ from "lodash";

class CalendarItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const item = this.props.item;
		return <TouchableOpacity style={styles.opacity} onPress={() => this.props.navigation.navigate("storyCalendar", { story: item })}>
			<View style={[styles.agendaItem, {
				height: item.height,
				borderRightColor: this.formatBackground(item.color)
			}]}>
				<Grid>
					<Row>
						<Col>
							<View style={styles.textView}>
								<Text style={styles.text}>{item.summary}</Text>
								<Text style={styles.agendaLocation}>{item.location} </Text>
								{this.renderTime(item.time_start_pretty, item.time_end_pretty)}
								{undefined !== item.group && item.group !== null && item.group.length > 0 && <View style={styles.groupView}>
									<Text style={styles.groupText}>{item.group}</Text>
								</View>}
							</View>
						</Col>
					</Row>
					<Row>
						<View style={styles.imageView}>
							<Image
								source={{ uri: item.photo1 }}
								style={styles.image}
							/>
						</View>
					</Row>
				</Grid>
			</View>
		</TouchableOpacity>;
	}


	renderTime(start, end) {
		if (undefined != start && start.length > 0) {
			return <Text style={styles.agendaDate}>{formatTime(start, end)} </Text>;
		}
	}

	formatBackground(color) {
		let ret = "#1DAEF2";
		switch (color) {
			case "grey":
				ret = "#64D4D2";
				break;
			case "yellow":
				ret = "#8F63B8";
				break;
			case "purple":
				ret = "#8F63B8";
				break;
			case "red":
				ret = "#E63946";
				break;
			case "green":
				ret = "#64D4D2";
				break;
			case "light blue":
				ret = "white";
				break;
			case 5:
				ret = "Friday";
				break;
			case 6:
				ret = "Saturday";
		}

		return ret;
	}
}


const styles = StyleSheet.create({
	agendaDate: {
		color: "gray",
		fontSize: 12,
		marginBottom: 3,
	},
	agendaItem: {
		alignSelf: "stretch",
		backgroundColor: "white",
		borderRadius: 5,
		borderRightWidth: 10,
		flex: 1,
		marginRight: 10,
		marginTop: 5,
		padding: 10,
	},
	agendaLocation: {
		color: "gray",
		fontSize: 12,
		marginTop: 5,
	},
	groupText: {
		color: "white",
		fontSize: 16,
	},

	groupView: {
		alignItems: "center",
		backgroundColor: "#D3D3D3",
		borderRadius: 3,
		height: 15,
		justifyContent: "center",
		paddingLeft: 0,
		paddingRight: 0,
		width: 95,
	},
	image: {
		height: 150,
		width: 300
	},
	imageView: {
		alignItems: "flex-end",
		flex: 1
	},

	opacity: {
		flexDirection: "row",
		marginBottom: 12
	},

	text: {
		color: "#000",
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 10,
		paddingTop: 5,
		textAlign: 'right'
	},
	textView: {
		alignItems: "flex-end",
		flex: 1
	},

});

export default CalendarItem;