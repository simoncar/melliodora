import React, { useState, useEffect } from "react";
import { View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Text, Button } from "../components/sComponent";
import I18n from "../lib/i18n";

export default function CameraScreen() {
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);

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
			<Camera style={styles.camera} type={type}></Camera>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.buttonCancel}
					onPress={() => {
						setType(
							type === Camera.Constants.Type.back
								? Camera.Constants.Type.front
								: Camera.Constants.Type.back
						);
					}}>
					<Text style={styles.textCancel}>{I18n.t("cancel")}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttonPhoto}
					onPress={() => {
						setType(
							type === Camera.Constants.Type.back
								? Camera.Constants.Type.front
								: Camera.Constants.Type.back
						);
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
	textPhoto: {
		alignItems: "center",
		justifyContent: "center",
		color: "#ccac08",
		fontSize: 14,
	},
	textCancel: {
		alignItems: "center",
		justifyContent: "center",
		color: "white",
		fontSize: 16,
	},
});
