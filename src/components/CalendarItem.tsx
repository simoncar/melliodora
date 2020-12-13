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
			<View style={styles.agendaItem}>
				<Grid>
					<Row>
						<Col>
							<View style={styles.textView}>
								<Text style={styles.text}>{item.summary}</Text>
								<Text style={styles.agendaLocation}>{item.location} </Text>
								{this.renderTime(item.time_start_pretty, item.time_end_pretty)}
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
		borderRightColor: "#8F63B8",
		borderRightWidth: 10,
		flex: 1,
		marginRight: 10,
		marginTop: 5,
		padding: 10
	},
	agendaLocation: {
		color: "gray",
		fontSize: 12,
		marginTop: 5,
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