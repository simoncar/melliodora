import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { SettingsListItem } from "./SettingsListItem";

class ChatroomItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { chatroom, title, mostRecentMessage, card, domain, uid, displayName, language, photoURL } = this.props;

		return (
			<SettingsListItem
				hasNavArrow={true}
				icon={<SimpleLineIcons style={styles.iconLeft} name="bubbles" />}
				title={title}
				subTitle={mostRecentMessage}
				onPress={() => {
					this.props.navigation.navigate("chat", {
						chatroom: chatroom,
						card: card,
						title: title,
						type: "public",
						domain: domain,
						uid: uid,
						displayName: displayName,
						language: language,
						photoURL: photoURL,
					});
				}}
			/>
		);
	}
}

const styles = StyleSheet.create({
	iconLeft: {
		color: "#999999",
		fontSize: 25,
		marginLeft: 10,
	},
});

export default ChatroomItem;
