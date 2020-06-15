import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../components/common/sComponent"
import { Grid, Col, Row } from "react-native-easy-grid";
import moment from "moment";

class LogItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var timestamp = moment(this.props.item.item.logItem.timestamp).format("LLL");

		return (
			<View style={styles.chatRow}>
				<Grid>
					<Row>
						<Col>
							<View>
								<Text style={styles.title}>{timestamp}</Text>
								<Text style={styles.detail}>{this.props.item.item.logItem.method}</Text>
								<Text style={styles.detail}>{this.props.item.item.logItem.results}</Text>
								<Text style={styles.detail}>{this.props.item.item.logItem.source}</Text>
								<Text style={styles.detail}>{this.props.item.item._key}</Text>
								<Text style={styles.detail}>{this.props.item.item.logItem.parameters}</Text>
							</View>
						</Col>
					</Row>
				</Grid>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		marginTop: 7,
		fontSize: 20,
		fontWeight: "bold",
		backgroundColor: "white",
		color: "black",
		marginLeft: 15,
		paddingBottom: 5,
	},

	detail: {
		fontSize: 14,
		marginLeft: 15,
		paddingBottom: 5,
	},
});

export default LogItem;
