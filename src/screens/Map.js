
import React, { Component } from "react";
import { Image, View, StyleSheet } from "react-native";
import Analytics from "../lib/analytics";
import { Text } from "../components/sComponent";

class campusMap extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		Analytics.track("Map");
	}

	render() {
		return <View>
			<View style={styles.af99fd590af6911ea88c25dbffc760ad0}>
				<Text style={styles.heading}>Woodleigh Campus</Text>
				<Text style={styles.text}>1 Woodleigh Lane, 357684</Text>

				<Image source={require("../../images/sais_edu_sg/map1.png")} style={styles.mapImage} />
				<Image source={require("../../images/sais_edu_sg/map2.png")} style={styles.mapImageLegend} />
			</View>

			<View style={styles.af99fd591af6911ea88c25dbffc760ad0}>
				<Text style={styles.heading}>Early Learning Village</Text>
				<Text style={styles.text}>3 Chuan Lane (off Lorong Chuan)</Text>
				<Text style={styles.text2}>Singapore 554350</Text>

				<Image source={require("../../images/sais_edu_sg/map3.png")} style={styles.mapImageELV} />
				<Image source={require("../../images/sais_edu_sg/map4.png")} style={styles.mapImageLegendELV} />
			</View>
		</View>;
	}
}

const styles = StyleSheet.create({
	af99fd590af6911ea88c25dbffc760ad0: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center"
	},
	af99fd591af6911ea88c25dbffc760ad0: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center"
	},
	mapImage: {
		height: 200,
		resizeMode: "contain"
	},

	mapImageLegend: {
		height: 1100,
		resizeMode: "contain"
	},
	mapImageELV: {
		height: 380,
		resizeMode: "contain"
	},

	mapImageLegendELV: {
		height: 250,
		resizeMode: "contain"
	},
	heading: {
		color: "#707372",
		alignSelf: "center",
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 25
	},
	text: {
		color: "#707372",
		alignSelf: "center",
		paddingTop: 10,
		paddingBottom: 5,
		fontSize: 15
	},
	text2: {
		color: "#707372",
		alignSelf: "center",
		paddingBottom: 10,
		fontSize: 15
	}
});

export default campusMap;