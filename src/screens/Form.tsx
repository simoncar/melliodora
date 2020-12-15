
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Button, Alert, ScrollView, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import _ from "lodash";
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "uuid";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { connect } from "react-redux";
import { IconChat, OrderOnPage, ShowOnHomeScreen, EventDateTime } from "../components/formUtilities";
import { SaveFeature, DeleteFeature } from "../components/formAPI";
import { StackActions, StackActionType } from "@react-navigation/native";
import ImageList from "../components/ImageList"
import { StoryEntity, StoryState } from '../lib/interfaces';
import Image from "../components/Imgix"

interface TProps {
	auth: any,
	community: any,
	navigation: any,
	route: any,
}

class Form extends Component<TProps, StoryState> {

	constructor(props: TProps) {

		super(props);

		var story: StoryEntity

		if (this.props.route.params.story != undefined) {
			console.log("story defined", this.props.route.params.story);
			story = this.props.route.params.story
		} else {
			story = {
				_key: "",
				summary: "",
				description: "",
				photo1: "",
				visible: true,
				showIconChat: true,
				order: 1,
				dateTimeStart: "",
				dateTimeEnd: "",
				date_start: "",
				time_start_pretty: "",
				time_end_pretty: "",
			};
		}

		const { _key, summary, description, photo1, visible, showIconChat, order, dateTimeStart, dateTimeEnd, date_start, time_start_pretty, time_end_pretty } = story;

		this.state = {
			photo1: photo1 !== undefined ? photo1 : null,
			summary: summary,
			description: description,
			visible: visible,
			showIconChat: showIconChat,
			order: order,
			_key: _key,
			date_start: date_start,
			time_start_pretty: time_start_pretty,
			time_end_pretty: time_end_pretty,
			dateTimeStart: dateTimeStart,
			dateTimeEnd: dateTimeEnd,
			cameraIcon: "camera",
			edit: this.props.route.params.edit
		};

		this.handlerChat = this.handlerChat.bind(this);
		this.handlerOrder = this.handlerOrder.bind(this);
		this.handlerVisible = this.handlerVisible.bind(this);
		this.handleEventDateTime = this.handleEventDateTime.bind(this);
	}

	componentDidMount() {
		const navigation = this.props.navigation;

		navigation.setOptions({
			save: this.save,
			headerRight: () => <Button onPress={() => this.save()} title={I18n.t("save")} />,
			headerBackTitleVisible: false
		});
	}

	handlerChat(show: boolean) {
		this.setState({ showIconChat: show });
	}

	handlerOrder(order: number) {
		this.setState({ order: order });
	}
	handlerVisible(visible: boolean) {
		this.setState({ visible: visible });
	}

	handleEventDateTime(dateTimeStart: string, dateTimeEnd: string, date_start: string) {
		this.setState({
			dateTimeStart: dateTimeStart,
			dateTimeEnd: dateTimeEnd,
			date_start: date_start
		});
	}

	getPermissionAsync = async () => {
		if (Constants?.platform?.ios ?? false) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== "granted") {
				alert("Sorry, we need camera roll permissions to make this work!");
			}
		}
	};

	save() {

		SaveFeature(this.state);

		if (this.props.route.params.edit) {
			const refreshFunction = this.props.route.params.refreshFunction;
			refreshFunction(this.state);
			const popAction = StackActions.pop(1);
			this.props.navigation.dispatch(popAction);
		} else {
			const popAction = StackActions.pop(2);
			this.props.navigation.dispatch(popAction);
		}

	}

	deleteHandler(navigation: { dispatch: (arg0: StackActionType) => void; }) {
		const popAction = StackActions.pop(2);
		navigation.dispatch(popAction);
	}

	deleteButton() {
		const { _key, edit } = this.state;
		if (edit) {
			return <TouchableOpacity
				style={styles.SubmitButtonStyle}
				activeOpacity={0.5}
				onPress={() => {
					Alert.alert(I18n.t("delete"), "Are you sure?", [{
						text: I18n.t("cancel"),
						onPress: () => console.log("Cancel Pressed"),
						style: "cancel"
					}, {
						text: I18n.t("delete"), onPress: () => {
							console.log("Delete feature:", _key)
							DeleteFeature(_key, this.deleteHandler(this.props.navigation))
						}
					}], { cancelable: false });
				}}>
				<Text >{I18n.t("delete")}</Text>
			</TouchableOpacity>;
		}
	}

	setUid(value: string | undefined) {
		this.uid = value;
	}

	get uid() {
		return (firebase.auth().currentUser || {}).uid;
	}

	set uid(uid) { }

	get timestamp() {
		return firebase.database.ServerValue.TIMESTAMP;
	}

	_pickImage = async () => {
		var d = new Date();

		console.log("AAA")

		// let result = await ImagePicker.launchImageLibraryAsync({
		// 	mediaTypes: ImagePicker.MediaTypeOptions.Images
		// });


		let result = await ImagePicker.launchImageLibraryAsync();


		console.log("BBB")


		if (!result.cancelled) {

			this.setState({ cameraIcon: "hour-glass" });

			var fileToUpload = "";
			var mime = "";

			const convertedImage = await new ImageManipulator.manipulateAsync(result.uri, [{ resize: { height: 1000 } }], {
				compress: 0
			});

			fileToUpload = convertedImage.uri;
			mime = "image/jpeg";
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					reject(new TypeError("Network request failed"));
				};
				xhr.responseType = "blob";
				xhr.open("GET", fileToUpload, true);
				xhr.send(null);
			});

			const ref = firebase.storage().ref("random/" + d.getUTCFullYear() + ("0" + (d.getMonth() + 1)).slice(-2)).child(uuid.v4());

			const snapshot = await ref.put(blob, { contentType: mime, cacheControl: 'max-age=31536000' }).then(snapshot => {
				return snapshot.ref.getDownloadURL(); // Will return a promise with the download link
			}).then(downloadURL => {
				console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
				this.setState({ photo1: downloadURL });
				return downloadURL;
			}).catch(error => {
				// Use to signal error if something goes wrong.
				console.log(`Failed to upload file and get link - ${error}`);
			});

			// We're done with the blob, close and release it
			blob.close();
			this.setState({ cameraIcon: "camera" });
		}
	};

	render() {

		const story: StoryEntity = this.props.route.params.story
		const edit = this.props.route.params.edit
		const refreshFunction = this.props.route.params.refreshFunction;



		return (
			<View style={styles.container}>

				<View>

					<Image
						style={styles.storyPhoto}
						source={{ uri: this.state.photo1 }} />

					<TouchableOpacity
						style={styles.photoButton}
						onPress={this._pickImage}>
						<Entypo name={this.state.cameraIcon} style={styles.cameraIcon} />
					</TouchableOpacity>
				</View>

				<ScrollView showsVerticalScrollIndicator={false}>
					<View>
						<View>
							<View style={styles.formControls}>
								<View style={styles.containerStyle}>
									<IconChat handler={this.handlerChat} showIconChat={this.state.showIconChat} />
									<ShowOnHomeScreen handler={this.handlerVisible} visible={this.state.visible} />
									<OrderOnPage handler={this.handlerOrder} order={this.state.order} />
									<EventDateTime handler={this.handleEventDateTime} dateTimeStart={this.state.dateTimeStart} dateTimeEnd={this.state.dateTimeEnd} />
								</View>
							</View>
						</View>
					</View>
					<View style={styles.formLongValues}>
						<Input onChangeText={text => this.setState({ summary: text })} placeholder="Title" autoFocus={true} inputContainerStyle={{ borderBottomWidth: 0 }} containerStyle={styles.containerStyle} value={this.state.summary} />

						<View style={styles.formSpace}></View>

						<Input onChangeText={text => this.setState({ description: text })} placeholder="Description" multiline inputContainerStyle={{ borderBottomWidth: 0 }} containerStyle={styles.containerStyle} value={this.state.description} />
					</View>
					<View style={styles.formButton}>{this.deleteButton()}</View>

					{edit && <ImageList
						feature={story._key}
						refreshFunction={refreshFunction}
						edit={true}
					/>}

				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	SubmitButtonStyle: {
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		elevation: 4,
		height: 50,
		justifyContent: "center",
		marginBottom: 30,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		width: 250,
	},

	cameraIcon: {
		color: "white",
		fontSize: 25
	},
	container: {
		backgroundColor: "#f2f2f2",
		flex: 1
	},
	containerStyle: {
		backgroundColor: "#ffffff",
		borderColor: "#d2d2d2",
		borderRadius: 10,
		borderWidth: 1,
		marginVertical: 8,
	},
	formButton: {
		alignItems: "center",
		flexDirection: "column",
		marginTop: 12
	},
	formControls: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 20
	},

	formLongValues: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 20
	},

	formSpace: {
		flexDirection: "row",
		paddingTop: 20
	},

	photoButton: {
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
		zIndex: 990,
	},

	storyPhoto: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		borderColor: "lightgray",
		borderWidth: 1,
		height: 200,
		marginBottom: 12,
		shadowColor: "rgba(0,0,0, .4)",
		shadowOffset: { height: 1, width: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 0.5,
		width: "98%",
	},


});


const mapStateToProps = state => ({
	auth: state.auth,
	community: state.community
});
export default connect(mapStateToProps)(Form);