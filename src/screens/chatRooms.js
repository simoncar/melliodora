
import React, { Component } from "react";
import { StyleSheet, FlatList, View, AsyncStorage, TouchableOpacity, TouchableHighlight } from "react-native";
import * as firebase from "firebase";
import { Container, Content } from "native-base";
import { Entypo, AntDesign } from "@expo/vector-icons";
import ChatroomItem from "../components/chatroomItem";
import Analytics from "../lib/analytics";
import _ from "lodash";
import { connect } from "react-redux";
import { Text } from "../components/sComponent";

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
				console.log("No notifications");
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


	refresh = ({ title }) => {
	};

	keyExtractor = item => item.chatroom;

	_renderItem({ item }) {
		return <ChatroomItem {...item} navigation={this.props.navigation} card={true} />;
	}
	_renderItemNoCard({ item }) {
		return <ChatroomItem {...item} navigation={this.props.navigation} card={false} />;
	}

	render() {
		const card = this.props.card === false ? false : true;
		return <Container style={styles.homeContainer}>
			<TouchableHighlight style={styles.addButton} underlayColor="#ff7043" onPress={() => {
				this.props.navigation.navigate("ChatTitle", {
					edit: false,
					chatroom: "New Chatroom",
					onGoBack: this.refresh
				});
			}}>
				<Text style={styles.acfd00760af6b11ea88c25dbffc760ad0}>+</Text>
			</TouchableHighlight>
			<Content showsVerticalScrollIndicator={false}>
				<View style={styles.newsContentLine}>
					<View>
						<View style={card && styles.card}>
							<View style={styles.acfd00761af6b11ea88c25dbffc760ad0}>
								<TouchableOpacity style={styles.acfd02e70af6b11ea88c25dbffc760ad0} onPress={() => {
									this.props.navigation.navigate("ChatTitle", {
										edit: false,
										chatroomTitle: "New Chatroom",
										onGoBack: this.refresh
									});
								}}>
									<View style={styles.acfd02e71af6b11ea88c25dbffc760ad0}>
										<AntDesign style={styles.iconLeftPlus} name="pluscircleo" />
										<Text style={styles.cardTitle}>New Chat Group</Text>
										<Entypo style={styles.iconRight} name="chevron-right" />
									</View>
								</TouchableOpacity>
							</View>
						</View>

						<FlatList style={styles.card} data={this.state.userChatrooms} renderItem={this._renderItemNoCard.bind(this)} keyExtractor={this.keyExtractor} />
					</View>
				</View>
			</Content>
		</Container>;
	}
}

const styles = StyleSheet.create({
	acfd00760af6b11ea88c25dbffc760ad0: {
		fontSize: 44,
		color: "white",
		position: "absolute",
		left: "20%",
		top: "-20%"
	},
	acfd00761af6b11ea88c25dbffc760ad0: {
		flexDirection: "row",
		paddingRight: 4,
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 5
	},
	acfd02e70af6b11ea88c25dbffc760ad0: {
		flexDirection: "row"
	},
	acfd02e71af6b11ea88c25dbffc760ad0: {
		flexDirection: "row",
		alignItems: "center"
	},

	iconRight: {
		fontSize: 25,
		color: "#777777",
		marginRight: 15,
		lineHeight: 60,
	},

	iconLeftPlus: {
		fontSize: 35,
		color: "#999999",
		margin: 12,
	},

	card: {
		backgroundColor: "#fff",
		elevation: 1,
		marginBottom: 12,
		width: "98%",
		alignSelf: "center",
		borderRadius: 15,
	},
	addButton: {
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderWidth: 1,
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		bottom: 20,
		right: 20,
		shadowColor: "#000000",
		shadowOpacity: 0.8,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 0,
		},
		zIndex: 1,
	},

	newsContentLine: {
		backgroundColor: "#f2f2f2",
		paddingTop: 10,
	},
	cardTitle: {
		justifyContent: "center",
		alignItems: "center",
		fontSize: 16,
		color: "#111111",
	},
	homeContainer: {
		backgroundColor: "#f2f2f2",
	},

});

const mapStateToProps = state => ({
	community: state.community
});
export default connect(mapStateToProps)(chatRooms);