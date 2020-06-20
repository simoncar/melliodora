
import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, TouchableOpacity, TouchableHighlight } from "react-native";
import * as firebase from "firebase";
import { Container, Content } from "native-base";
import { Entypo, AntDesign } from "@expo/vector-icons";
import ChatroomItem from "../components/ChatRoomItem";
import Analytics from "../lib/analytics";
import _ from "lodash";
import { connect } from "react-redux";
import { Text, ShortList } from "../components/sComponent";

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

		Analytics.track("Chatrooms");
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

	_renderItem(item) {
		return <ChatroomItem key={item.chatroom} {...item} navigation={this.props.navigation} card={true} />;
	}
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
		const card = this.props.card === false ? false : true;
		return <Container style={styles.homeContainer}>
			<TouchableHighlight style={styles.addButton} underlayColor="#ff7043" onPress={() => {
				this.newChatroom()
			}}>
				<Text style={styles.floatingButtonText}>+</Text>
			</TouchableHighlight>
			<Content showsVerticalScrollIndicator={false}>
				<View style={styles.newsContentLine}>
					<View>
						<View style={card && styles.card}>
							<View style={styles.newChatroomView}>
								<TouchableOpacity style={styles.newChatroomOpacity} onPress={() => {
									this.newChatroom()
								}}>
									<View style={styles.plusIconView}>
										<AntDesign style={styles.iconLeftPlus} name="pluscircleo" />
										<Text style={styles.cardTitle}>New Chat Group</Text>
										<Entypo style={styles.iconRight} name="chevron-right" />
									</View>
								</TouchableOpacity>
							</View>
						</View>

						<ShortList
							navigation={this.props.navigation}
							style={styles.card}
							data={this.state.userChatrooms}
							renderItem={this._renderItemNoCard}
							keyExtractor={this.keyExtractor} />
					</View>
				</View>
			</Content>
		</Container>;
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
		elevation: 1,
		marginBottom: 12,
		width: "98%",
	},
	cardTitle: {
		alignItems: "center",
		color: "#111111",
		fontSize: 16,
		justifyContent: "center",
	},
	floatingButtonText: {
		color: "white",
		fontSize: 44,
		left: "20%",
		position: "absolute",
		top: "-20%"
	},

	homeContainer: {
		backgroundColor: "#f2f2f2",
	},

	iconLeftPlus: {
		color: "#999999",
		fontSize: 35,
		margin: 12,
	},

	iconRight: {
		color: "#777777",
		fontSize: 25,
		lineHeight: 60,
		marginRight: 15,
	},
	newChatroomOpacity: {
		flexDirection: "row"
	},

	newChatroomView: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 5,
		paddingRight: 4
	},
	newsContentLine: {
		backgroundColor: "#f2f2f2",
		paddingTop: 10,
	},
	plusIconView: {
		alignItems: "center",
		flexDirection: "row"
	},

});

const mapStateToProps = state => ({
	community: state.community
});
export default connect(mapStateToProps)(chatRooms);
