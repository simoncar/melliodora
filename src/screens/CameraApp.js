
import React, { Component } from "react";
import { View, Dimensions, TouchableHighlight, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

import { Text } from "../components/sComponent";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default class CameraApp extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		hasCameraPermission: null,
		type: Camera.Constants.Type.back,
		cameraIcon: "camera"
	};

	static navigationOptions = ({ navigation }) => ({
		headerLeft: <TouchableOpacity onPress={() => {
			navigation.goBack();
		}}>
			<Entypo name="chevron-left" style={styles.left} />
		</TouchableOpacity>,
		headerTitle: <Text style={styles.a9f20bde0b21211ea8aa31930972200e5}>Capture Event</Text>
	});

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === "granted" });
	}

	setUid(value) {
		this.uid = value;
	}

	get uid() {
		return (firebase.auth().currentUser || {}).uid;
	}

	get timestamp() {
		return firebase.database.ServerValue.TIMESTAMP;
	}

	uploadImage = async uri => {
		// const response = await fetch(uri);
		// console.log("response=", response);
		const blob = await uri.blob();
		var ref = firebase.storage().ref().child("my-image");
		return ref.put(blob);
	};

	async snapPhoto() {
		var d = new Date();
		const options = { quality: 1, base64: true, fixOrientation: true, exif: true };
		await this.camera.takePictureAsync(options).then(async photo => {
			const convertedImage = await new ImageManipulator.manipulateAsync(photo.uri, [{ resize: { height: 600 } }], {
				compress: 0
			});
			//photo.exif.Orientation = 1;
			fileToUpload = convertedImage.uri;

			this.setState({ profilePic: fileToUpload });
			this.goBack();
		});
	}

	goBack() {
		const { navigation } = this.props;
		navigation.state.params.onGoBack({ profilePic: this.state.profilePic });
		navigation.goBack();
	}

	render() {
		const { hasCameraPermission } = this.state;

		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			return <View style={styles.a9f210c00b21211ea8aa31930972200e5}>
				<TouchableHighlight style={styles.camera} underlayColor="#ff7043" onPress={this.snapPhoto.bind(this)}>
					<Entypo name={this.state.cameraIcon} size={28} color={"white"} />
				</TouchableHighlight>

				<Camera style={styles.a9f210c01b21211ea8aa31930972200e5} type={this.state.type} ref={ref => {
					this.camera = ref;
				}}></Camera>
			</View>;
		}
	}
}

const styles = StyleSheet.create({
	a9f20bde0b21211ea8aa31930972200e5: { fontSize: 18, fontWeight: "bold" },
	a9f210c00b21211ea8aa31930972200e5: { flex: 1 },
	a9f210c01b21211ea8aa31930972200e5: { flex: 1 },

	camera: {
		alignItems: "center",
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderWidth: 1,
		bottom: 30,
		height: 80,
		justifyContent: "center",
		left: WINDOW_WIDTH / 2 - 35,
		position: "absolute",
		shadowColor: "#000000",
		shadowOffset: {
			height: 1,
			width: 0
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
		width: 80,
		zIndex: 1
	},
	left: {
		alignSelf: "center",
		color: "#037AFF",
		fontSize: 30,
		paddingBottom: 5,
		paddingRight: 10
	}
});