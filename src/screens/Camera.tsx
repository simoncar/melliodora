import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { Text} from "../components/sComponent";
import I18n from "../lib/i18n";
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

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>{I18n.t("permissionsNoCamera")}</Text>;
	}
	return (
		<View style={styles.container}>
			<Camera
				style={styles.camera}
				ref={(ref) => {
					setCamRef(ref);
				}}
				type={type}></Camera>
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
					onPress={() => {
						camRef.takePictureAsync({ quality: 0 }).then((a) => {
							console.log("Pic:", a);
							saveProfilePic(a.uri).then((downloadURL) => {
								console.log("saved profile pic here:", downloadURL);
								setGPhotoURL(downloadURL);
								props.navigation.pop();
							});
						});
					}}></TouchableOpacity>
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
		flexDirection: "row",
		height: 70,
		justifyContent: "space-between",
		margin: 20,
		alignItems: "center",
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
		flex: 1,
		backgroundColor: "black",
	},

	textCancel: {
		alignItems: "center",
		justifyContent: "center",
		color: "white",
		fontSize: 16,
	},
});
