import React, { Component } from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import styles from "./styles";
import { Text } from "../../components/common/sComponent"
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { getLanguageString } from "../global";
import { Grid, Col, Row } from "react-native-easy-grid";
import { formatTime, formatMonth } from "../global.js";
const { width } = Dimensions.get("window");
import _ from "lodash";
class CalendarItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const item = this.props.item;
		return (
			<TouchableOpacity
				style={{ flexDirection: "row", marginBottom: 12 }}
				onPress={() => this.props.navigation.navigate("storyCalendar", item)}>
				<View
					style={[
						styles.agendaItem,
						{
							height: item.height,
							borderRightColor: this.formatBackground(item.color),
						},
					]}>
					<Grid>
						<Row>
							<Col>
								<View style={{ flex: 1, alignItems: "flex-end" }}>
									<Text style={styles.text}>{item.summary}</Text>
									<Text style={styles.agendaLocation}>{item.location} </Text>
									{this.renderTime(item.time_start_pretty, item.time_end_pretty)}
									{undefined !== item.group && item.group !== null && item.group.length > 0 && (
										<View style={styles.groupView}>
											<Text style={styles.groupText}>{item.group}</Text>
										</View>
									)}
								</View>
							</Col>
						</Row>
						<Row>
							<View style={{ flex: 1, alignItems: "flex-end" }}>{this.renderImage(item.photo1)}</View>
						</Row>
					</Grid>
				</View>
			</TouchableOpacity>
		);
	}
	renderImage(calImage) {
		if (_.isNil(calImage)) {
			var uri =
				"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2Fxdesk-calendar-980x470-20181016.jpg.pagespeed.ic.BdAsh-Nj_6.jpg?alt=media&token=697fef73-e77d-46de-83f5-a45540694274";
		} else {
			var uri = calImage;
		}
		const preview = {
			uri:
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
		};
		if (undefined != calImage && calImage.length > 0) {
			return <Image {...{ preview, uri }} style={{ width: 300, height: 150 }} resizeMode="contain" />;
		}
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

export default CalendarItem;
