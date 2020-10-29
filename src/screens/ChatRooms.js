
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import * as firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-community/async-storage';
import ChatroomItem from "../components/ChatRoomItem";
import _ from "lodash";
import { connect } from "react-redux";
import { Text, ShortList } from "../components/sComponent";
import { SettingsListItem } from "../components/SettingsListItem";
import { TouchableOpacity } from "react-native-gesture-handler";


class chatRooms extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userChatrooms: {}
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({
			refresh: this.refresh
		});

		this.buildChatroomList();

	}

	buildChatroomList() {
		var userChatrooms = [];

		this.loadFromAsyncStorage();

		firebase.firestore().collection(global.domain).doc("chat").collection("chatrooms").orderBy("title").get().then(snapshot => {
			if (snapshot.empty) {
				return;
			}
			const userInterestGroupCheck = _.has(global, "userInfo.interestGroups") && Array.isArray(global.userInfo.interestGroups);
			const userInterestGroups = userInterestGroupCheck ? global.userInfo.interestGroups : [];

			snapshot.forEach(doc => {
				const item = doc.data();

				if (item.visible == false) return;
				if (item.type == "private" && item.members.indexOf(global.uid + "") > -1 || item.type == "interestGroup" && userInterestGroups && userInterestGroups.indexOf(item.title) > -1 || ["users", "public"].indexOf(item.type) > -1) {
					userChatrooms.push({
						...item,
						chatroom: doc.id
					});
				}
			});

			AsyncStorage.setItem("userChatrooms", JSON.stringify(userChatrooms));

			this.setState({
				userChatrooms,
				loading: false
			});
		});
	}

	loadFromAsyncStorage() {
		AsyncStorage.getItem("userChatrooms").then(fi => {
			var userChatrooms = JSON.parse(fi);

			this.setState({
				userChatrooms,
				loading: false
			});
		});
	}


	refresh = () => {
		this.buildChatroomList()
	};

	keyExtractor = item => item.chatroom;


	_renderItemNoCard(navigation, item) {
		return <ChatroomItem key={item.chatroom} {...item} navigation={navigation} card={false} />;
	}

	newChatroom() {
		this.props.navigation.navigate("ChatTitle", {
			edit: false,
			chatroom: "New Chatroom",
			title: "New Chatroom",
			onGoBack: this.refresh
		});
	}

	render() {
		return <View style={styles.container}>
			<TouchableOpacity
				style={styles.addButton}
				underlayColor="#ff7043"
				onPress={() => {
					this.newChatroom()
				}}>
				<Text style={styles.floatingButtonText}>+</Text>
			</TouchableOpacity>
			<View>
				<View style={styles.card}>
					<SettingsListItem
						hasNavArrow={true}
						icon={<AntDesign style={styles.iconLeftPlus} name="pluscircleo" />}
						title={"New Chat Group"}
						onPress={() => {
							this.newChatroom()
						}}
						lastItem={true} />
				</View>
				<View style={styles.card}>
					<ShortList
						navigation={this.props.navigation}
						style={styles.card}
						data={this.state.userChatrooms}
						renderItem={this._renderItemNoCard}
						keyExtractor={this.keyExtractor} />
				</View>
			</View>
		</View>;
	}
}

const styles = StyleSheet.create({
	addButton: {
		alignItems: "center",
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderRadius: 50 / 2,
		borderWidth: 1,
		bottom: 20,
		height: 50,
		justifyContent: "center",
		position: "absolute",
		right: 20,
		shadowColor: "#000000",
		shadowOffset: {
			height: 1,
			width: 0,
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		width: 50,
		zIndex: 1,
	},

	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 6,
		padding: 10,
		width: "95%",
	},
	container: { backgroundColor: "#EFEFF4", flex: 1, marginTop: 10 },

	floatingButtonText: {
		color: "white",
		fontSize: 44,
		left: "20%",
		position: "absolute",
		top: "-20%"
	},


	iconLeftPlus: {
		color: "#999999",
		fontSize: 25,
		marginLeft: 12,
	},


});

const mapStateToProps = state => ({
	community: state.community
});
export default connect(mapStateToProps)(chatRooms);
