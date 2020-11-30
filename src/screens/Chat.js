import React, { Component } from "react";
import { View, TouchableOpacity, Linking, Modal, FlatList, StyleSheet } from "react-native";
import { Container, Footer } from "native-base";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import CustomView from "../components/customView";
import CustomImage from "../components/ChatCustomImage";
import CustomVideo from "../components/ChatCustomVideo";
import I18n from "../lib/i18n";
import uuid from "uuid";
import Backend from "../components/backend";
import * as Analytics from 'expo-firebase-analytics';
import * as firebase from "firebase";
import { ListItem } from "react-native-elements";
import { SettingsListItem } from "../components/SettingsListItem";
import { connectActionSheet, ActionSheetProvider } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";
import { Text } from "../components/sComponent";

var localMessages = [];

class chat extends Component {

	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			loadEarlier: true,
			typingText: null,
			isLoadingEarlier: false,
			step: 0,
			muteState: false,
			user: null,
			authenticated: false,
			modalVisible: false,
			chatroomUsers: []
		};

		this._isMounted = false;
		this.onSend = this.onSend.bind(this);
		this.parsePatterns = this.parsePatterns.bind(this);
		this.onReceive = this.onReceive.bind(this);
		this.renderCustomActions = this.renderCustomActions.bind(this);
		this.renderFooter = this.renderFooter.bind(this);
		this.onLoadEarlier = this.onLoadEarlier.bind(this);

		localMessages = [];

		this.communityDomain = this.props.community.selectedCommunity.node;
		this.userInfo = this.props.auth.userInfo;

	}

	componentDidMount() {
		const { chatroom, title } = this.props.route.params;

		this.chatroom = chatroom;
		this.title = title;

		Backend.setLanguage(this.props.auth.language);
		Backend.setChatroom(this.chatroom, this.title);
		Backend.setMute(null);
		Backend.loadMessages(message => {
			if (!localMessages.includes(message._id)) {

				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, message)
				}));
			}
		});

		this.props.navigation.setOptions({
			headerBackTitleVisible: false
		});


		this.loadChatUsers();

		Analytics.logEvent("Chat", { chatroom: this.props.title });
	}
	_getInterestGroupUsers = async () => {
		const data = [];
		const querySnapshot = await firebase.firestore().collection(this.communityDomain).doc("user").collection("registered").where("interestGroups", "array-contains", this.props.title).limit(5000).get();

		querySnapshot.docs.forEach(doc => {
			data.push(doc.data());
		});
		return data;
	};

	_getPrivateChatUsers = async members => {
		const data = [];
		const querySnapshot = await firebase.firestore().collection(this.communityDomain).doc("user").collection("registered").where("uid", "in", members).get();

		querySnapshot.docs.forEach(doc => {
			data.push(doc.data());
		});
		return data;
	};

	loadChatUsers = () => {
		if (this.props.type == "interestGroup") {
			this._getInterestGroupUsers().then(data => this.setState({ chatroomUsers: data }));
		} else if (this.props.type == "private") {
			this._getPrivateChatUsers(this.props.members).then(data => this.setState({ chatroomUsers: data }));
		}
	};

	_renderUsersItem({ item }) {
		const avatarTitle = item.email.slice(0, 2);
		const fullName = item.firstName + " " + item.lastName;
		const avatar = item.photoURL ? { source: { uri: item.photoURL } } : { title: avatarTitle };
		return <TouchableOpacity onPress={() => {
			this.setState({ modalVisible: false });
			this.props.navigation.navigate("UserProfile", { uid: item.uid, user: item });
		}}>
			<ListItem leftAvatar={{
				rounded: true,
				...avatar
			}} title={<View style={styles.a221a2b50ac4611ea973dcfce83f911da}>
				<Text style={styles.a221a5260ac4611ea973dcfce83f911da}>{item.displayName || fullName}</Text>
			</View>} chevron={true} subtitle={<View style={styles.a221a5261ac4611ea973dcfce83f911da}>
				<Text style={styles.a221a5262ac4611ea973dcfce83f911da}>{fullName}</Text>
				<Text style={styles.a221a5263ac4611ea973dcfce83f911da}>{item.email}</Text>
			</View>} />
		</TouchableOpacity>;
	}

	onSend(messages = []) {
		if (messages[0]._id == undefined) {
			messages[0]._id = uuid.v4();
		}

		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages)
		}));

		localMessages.push(messages[0]._id);
		Backend.SendMessage(messages);
	}

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== "granted") {
				alert("Sorry, we need camera roll permissions to make this work!");
			}
		}
	};

	componentWillUnmount() {
		this._isMounted = false;
		Backend.closeChat();
	}

	onLoadEarlier() {
		this.setState(previousState => ({
			isLoadingEarlier: true
		}));
	}

	onReceive(text) { }

	renderCustomActions() {
		return <TouchableOpacity style={styles.photoContainer} onPress={this._pickImage}>
			<View>
				<Entypo name="camera" style={styles.cameraAction} />
			</View>
		</TouchableOpacity>;
	}

	_pickImage = async () => {
		this.getPermissionAsync();

		var images = [];
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images
		});

		if (!result.cancelled) {
			images[0] = {
				image: result.uri,
				filename: result.uri,
				user: {
					_id: this.userInfo.uid, // `${Constants.installationId}${Constants.deviceId}`, // sent messages should have same user._id
					name: this.userInfo.firstName
				}
			};

			this.onSend(images);
		}
	};

	renderCustomView(props) {
		return <CustomView {...props} />;
	}

	renderCustomImage(props) {
		return <CustomImage {...props} />;
	}

	renderCustomVideo(props) {
		return <CustomVideo {...props} />;
	}

	renderFooter(props) {
		if (this.state.typingText) {
			return <View style={styles.footerContainer}>
				<Text style={styles.footerText}>{this.state.typingText}</Text>
			</View>;
		}
		return null;
	}

	parsePatterns() {
		return [{ type: "url", style: styles.url, onPress: this._handleOpenWithLinking }];
	}

	_handleOpenWithLinking = sURL => {

		//if (sURL.indexOf("https://mystamford.edu.sg") == -1) {
		Linking.openURL(sURL);
		//} else {
		//this.props.navigation.navigate("authPortalEmbed", {
		//	url: sURL
		//});
		//}
	};

	refresh = ({ title }) => {
		this.props.navigation.setParams({ title: title });
	};

	_showActionSheet = () => {
		const options = ["Chatroom info", "Edit Chatroom", "Mute Conversation", "Unmute Conversation", "Cancel"];
		const { chatroom, title, type } = this.props.route.params;
		const cancelButtonIndex = options.length - 1;

		this.props.showActionSheetWithOptions({
			options,
			cancelButtonIndex
		}, buttonIndex => {
			switch (buttonIndex) {
				case 0:
					this.setState({ modalVisible: true });
					break;
				case 1:
					this.props.navigation.push("ChatTitle", {
						title: title,
						chatroom: chatroom,
						type: type,
						edit: true,
						onGoBack: this.refresh
					});
					break;
				case 2:
					Backend.setMute(true);
					break;
				case 3:
					Backend.setMute(false);
					break;
			}
		});
	};

	renderSend(props) {
		return <Send {...props}>
			<View style={styles.sendView}>
				<MaterialIcons name="send" style={styles.sendIcon} />
			</View>
		</Send>;
	}

	renderSeparator = () => {
		return <View style={styles.separator} />;
	};

	render() {
		// if (this.communityDomain == "sais_edu_sg" && !this.props.authPortal.authEmail) {
		// 	const { goBack } = this.props.navigation;

		// 	goBack(null);
		// 	setTimeout(() => {
		// 		this.props.navigation.navigate("authPortalEmbed");
		// 	}, 100);

		// 	this.props.navigation.navigate("chatRooms");
		// 	return <View>
		// 		<Text>{I18n.t("login")}</Text>
		// 	</View>;
		// }

		let userDetails = {};
		if (this.userInfo.isAnonymous) {
			userDetails = {
				name: "Guest"
			};
		} else {
			userDetails = {
				name: this.userInfo.firstName,
				email: this.userInfo.email,
				...(this.userInfo.photoURL && { avatar: this.userInfo.photoURL })
			};
		}

		return <Container>
			<View>
				<Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
					<View style={styles.a221aa080ac4611ea973dcfce83f911da}>
						<TouchableOpacity onPress={() => {
							this.setState({ modalVisible: false });
						}}>
							<AntDesign size={32} color={"#f2f2f2"} name="closecircleo" />
						</TouchableOpacity>

						<Text style={styles.a221aa082ac4611ea973dcfce83f911da}>
							{this.props.title}
						</Text>

						<View style={styles.a221aa083ac4611ea973dcfce83f911da}>
							<Text style={styles.a221aa084ac4611ea973dcfce83f911da}>Chatroom users ({this.state.chatroomUsers.length})</Text>
							{this.renderSeparator()}

							{["users", "public"].indexOf(this.props.route.params) > -1 ? <SettingsListItem title={"All Users"} onPress={() => {
								this.setState({ modalVisible: false });
								this.props.navigation.navigate("UserSearch");
							}} /> : <FlatList style={styles.a221aa085ac4611ea973dcfce83f911da} data={this.state.chatroomUsers} renderItem={this._renderUsersItem.bind(this)} keyExtractor={(_, idx) => "user" + idx} ItemSeparatorComponent={this.renderSeparator}
								// ListHeaderComponent={this.renderSeparator}
								/>}
						</View>
					</View>
				</Modal>

				<TouchableOpacity onPress={() => {
					this.props.navigation.navigate("selectLanguageChat", {
						chatroom: this.props.title,
						url: this.props.url
					});
				}}>
					<View style={styles.topBar}>
						<Text style={styles.chatBanner}>{I18n.t("translationsGoogle")}</Text>
					</View>
				</TouchableOpacity>
			</View>

			<GiftedChat
				messages={this.state.messages}
				onSend={this.onSend} user={{
					_id: this.userInfo.uid,
					...userDetails
				}}
				renderActions={this.renderCustomActions}
				renderCustomView={this.renderCustomView}
				renderMessageImage={this.renderCustomImage}
				renderMessageVideo={this.renderCustomVideo}
				showUserAvatar={true} bottomOffset={0}
				alwaysShowSend={true}
				textInputProps={{ autoFocus: true }}
				renderSend={this.renderSend}
				placeholder={I18n.t("typeMessage")}
				parsePatterns={this.parsePatterns}
				renderUsernameOnMessage={true} />

			<Footer style={styles.footer} />
		</Container>;
	}
}

const mapStateToProps = state => ({
	communityCreation: state.communityCreation,
	community: state.community,
	auth: state.auth,
	authPortal: state.authPortal
});
const ConnectedApp = compose(connectActionSheet, connect(mapStateToProps))(chat);

export default class ActionSheetContainer extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerRight: <TouchableOpacity onPress={() => {
			navigation.state.params._showActionSheet();
		}}>
			<View style={styles.chatHeading}>
				<Entypo name="cog" style={styles.chatHeading} />
			</View>
		</TouchableOpacity>
	});

	render() {
		return <ActionSheetProvider>
			<ConnectedApp route={this.props.route} navigation={this.props.navigation} />
		</ActionSheetProvider>;
	}
}

const styles = StyleSheet.create({
	a221a2b50ac4611ea973dcfce83f911da: {
		flex: 1,
		flexDirection: "row"
	},
	a221a5260ac4611ea973dcfce83f911da: {
		flex: 1,
		fontSize: 16
	},
	a221a5261ac4611ea973dcfce83f911da: {
		flex: 1,
		flexDirection: "column",
		paddingTop: 3
	},
	a221a5262ac4611ea973dcfce83f911da: {
		color: "gray"
	},
	a221a5263ac4611ea973dcfce83f911da: {
		color: "gray"
	},
	a221aa080ac4611ea973dcfce83f911da: {
		backgroundColor: "#f2f2f2",
		flex: 1,
		marginTop: 22
	},
	a221aa082ac4611ea973dcfce83f911da: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
		textShadowColor: "#000",
		textShadowOffset: {
			width: 1,
			height: 0.8
		},
		textShadowRadius: 1
	},
	a221aa083ac4611ea973dcfce83f911da: {
		backgroundColor: "#fff",
		marginTop: 12
	},
	a221aa084ac4611ea973dcfce83f911da: {
		fontSize: 18,
		padding: 12
	},
	a221aa085ac4611ea973dcfce83f911da: {
		height: "70%"
	},

	cameraAction: {
		color: "#777777",
		fontSize: 25
	},
	chatBanner: {
		alignSelf: "center",
		borderBottomColor: "#666",
		borderBottomWidth: 1,
		color: "grey",
		fontSize: 14,
		paddingBottom: 5,
		paddingTop: 5
	},
	chatHeading: {
		alignSelf: "center",
		color: "black",
		flex: 1,
		flexDirection: "row",
		fontSize: 25,
		paddingBottom: 5,
		paddingRight: 10
	},
	footer: {
		height: 10
	},

	footerContainer: {
		marginBottom: 10,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 5
	},

	footerText: {
		color: "#000",
		fontSize: 14
	},

	photoContainer: {
		height: 26,
		marginBottom: 10,
		marginLeft: 10,
		width: 26
	},
	sendIcon: {
		color: "#777777",
		fontSize: 25
	},

	sendView: {
		marginBottom: 10,
		marginRight: 10
	},
	separator: {
		backgroundColor: "#CED0CE",
		height: 1
	},
	topBar: {
		alignItems: "center",
		backgroundColor: "white",
		height: 30
	},
	url: {
		color: "blue",
		textDecorationLine: "underline"
	}

});