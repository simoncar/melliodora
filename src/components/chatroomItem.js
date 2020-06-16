
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { SettingsListItem } from "../components/SettingsListItem";

class ChatroomItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { title, mostRecentMessage } = this.props
		const props = this.props
		return (
			<SettingsListItem
				hasNavArrow={true}
				icon={<SimpleLineIcons style={styles.iconLeft} name="bubbles" />}
				title={title}
				titleInfo={mostRecentMessage}
				onPress={() => {
					this.props.navigation.navigate("chat", {
						...props
					})
				}} />
		)
	}
}

const styles = StyleSheet.create({
	iconLeft: {
		color: "#999999",
		fontSize: 35,
		margin: 12,
	},
});

export default ChatroomItem;