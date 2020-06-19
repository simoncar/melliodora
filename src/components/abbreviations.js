
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./sComponent";


class Abbreviations extends Component {

	render() {
		return <View style={styles.ab9fe1b90af6411ea88c25dbffc760ad0}>
			<Text style={styles.eventTitle}>{this.props.content}</Text>
		</View>;
	}
}

const styles = StyleSheet.create({
	ab9fe1b90af6411ea88c25dbffc760ad0: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between"
	}
});

export default Abbreviations;