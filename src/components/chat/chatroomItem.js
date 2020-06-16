import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../components/sComponent"
import { SimpleLineIcons, Entypo } from "@expo/vector-icons";
import styles from "./styles";

const preview = {
	uri:
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
};
const uri =
	"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2F201908%2FchatIcon.png?alt=media&token=c5667f8f-efc9-48f6-91a8-5cf57e856505";

class ChatroomItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const card = this.props.card === false ? false : true;
		const mostRecentMessage = this.props.mostRecentMessage;
		return (
			<View style={card && styles.card}>
				<View
					style={{
						flexDirection: "row",
						paddingRight: 4,
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: 5,
					}}>
					<TouchableOpacity
						style={{ flexDirection: "row" }}
						onPress={() => {
							this.props.navigation.navigate("chat", {
								chatroom: this.props.chatroom,
								title: this.props.title,
								description: this.props.description,
								contact: this.props.contact,
								url: this.props.url,
								language: this.props.language,
								type: this.props.type,
								members: this.props.members,
							});
						}}>
						<View style={styles.rowView}>
							<SimpleLineIcons style={styles.iconLeft} name="bubbles" />
							<View>
								<Text style={styles.cardTitle}>{this.props.title}</Text>
								<Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardLocation}>
									{mostRecentMessage}
								</Text>
							</View>

							<Entypo style={styles.iconRight} name="chevron-right" />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
export default ChatroomItem;
