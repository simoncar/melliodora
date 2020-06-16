
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { SettingsListItem } from "../components/SettingsListItem";

class ChatroomItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { chatroom, title, mostRecentMessage } = this.props

		return (
			<SettingsListItem
				hasNavArrow={true}
				icon={<SimpleLineIcons style={styles.iconLeft} name="bubbles" />}
				title={title}
				subTitle={mostRecentMessage}
				onPress={() => {
					this.props.navigation.navigate("chat", {
						chatroom: chatroom,
						card: false,
						title: title,
						type: "public",
					})
				}} />
		)
	}
}

const styles = StyleSheet.create({
	iconLeft: {
		color: "#999999",
		fontSize: 35,
		marginLeft: 10
	},
});

export default ChatroomItem;
