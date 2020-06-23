import React, { Component } from "react";
import { View, Dimensions, TouchableHighlight, StyleSheet } from "react-native";
import * as firebase from "firebase";
import { Entypo } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Text } from "../components/sComponent";
import I18n from "../lib/i18n";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default class CameraApp extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		hasCameraPermission: null,
		type: Camera.Constants.Type.front,
		cameraIcon: "camera"
	};


	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === "granted" });
	}


	async snapPhoto() {
		const options = { quality: 1, base64: true, fixOrientation: true, exif: true };
		await this.camera.takePictureAsync(options).then(async photo => {
			const convertedImage = await new ImageManipulator.manipulateAsync(photo.uri, [{ resize: { height: 600 } }], {
				compress: 0
			});
			var fileToUpload = convertedImage.uri;

			this.setState({ profilePic: fileToUpload });
			this.goBack();
		});
	}

	goBack() {

		const { navigation } = this.props;
		this.props.route.params.onGoBack({ profilePic: this.state.profilePic });
		navigation.goBack();
	}

	render() {
		const { hasCameraPermission } = this.state;
		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>{I18n.t("permissionsNoCamera")}</Text>;
		} else {
			return <View style={styles.flexView}>
				<TouchableHighlight
					testID="camera.button"
					style={styles.camera}
					underlayColor="#ff7043"
					onPress={this.snapPhoto.bind(this)}>
					<Entypo testID="camera.takePhoto" name={this.state.cameraIcon} size={28} color={"white"} />
				</TouchableHighlight>

				<Camera style={styles.flexCamera} type={this.state.type} ref={ref => {
					this.camera = ref;
				}}></Camera>

			</View>;
		}
	}
}

const styles = StyleSheet.create({
	camera: {
		alignItems: "center",
		backgroundColor: "#ff5722",
		borderColor: "#ff5722",
		borderRadius: 150 / 2,
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
	flexCamera: { flex: 1 },
	flexView: { flex: 1 },

});