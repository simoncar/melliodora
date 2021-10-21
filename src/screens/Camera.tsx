import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { Text } from "../components/sComponent";
import I18n from "../lib/i18n";
import { LinearProgress } from "react-native-elements";
import { saveProfilePic } from "../lib/APIUploadImage";
import { usePhotoURLP } from "../lib/globalState";

interface TProps {
	navigation: any;
	route: any;
}

export default function CameraScreen(props: TProps) {
	const [camRef, setCamRef] = useState(null);
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.front);
	const [statePhotoURL, setGPhotoURL, isUpdatedPhotoURL] = usePhotoURLP();
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return (
			<View style={styles.buttonContainer}>
				<Text>{I18n.t("permissionsNoCamera")}</Text>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<Camera
				style={styles.camera}
				ref={(ref) => {
					setCamRef(ref);
				}}
				type={type}></Camera>
			<View>{saving && <LinearProgress color="primary" />}</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.buttonCancel}
					onPress={() => {
						props.navigation.pop();
					}}>
					<Text style={styles.textCancel}>{I18n.t("cancel")}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttonPhoto}
					testID="camera.takePhoto"
					onPress={() => {
						camRef.takePictureAsync({ quality: 0 }).then((a) => {
							setSaving(true);
							saveProfilePic(a.uri).then((downloadURL) => {
								setGPhotoURL(downloadURL);
								setSaving(false);
								props.navigation.pop();
							});
						});
					}}
				/>
				<TouchableOpacity
					style={styles.buttonFlip}
					onPress={() => {
						setType(
							type === Camera.Constants.Type.back
								? Camera.Constants.Type.front
								: Camera.Constants.Type.back
						);
					}}>
					<Fontisto
						name="spinner-refresh"
						size={30}
						color="black"
						style={{ transform: [{ rotateZ: "70deg" }] }}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	buttonCancel: {
		alignItems: "center",
	},
	buttonContainer: {
		alignItems: "center",
		flexDirection: "row",
		height: 70,
		justifyContent: "space-between",
		margin: 20,
	},
	buttonFlip: {
		alignItems: "center",
		backgroundColor: "darkgrey",
		borderRadius: 50 / 2,
		height: 50,
		justifyContent: "center",
		right: 15,
		width: 50,
	},
	buttonPhoto: {
		alignItems: "center",
		backgroundColor: "lightgrey",
		borderColor: "darkgrey",
		borderRadius: 80 / 2,
		borderWidth: 2,
		height: 80,
		justifyContent: "center",
		width: 80,
	},
	camera: {
		height: 600,
	},
	container: {
		backgroundColor: "black",
		flex: 1,
	},
	textCancel: {
		alignItems: "center",
		color: "white",
		fontSize: 16,
		justifyContent: "center",
	},
});
