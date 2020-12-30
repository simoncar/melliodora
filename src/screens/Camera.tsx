import React, { useState, useEffect } from "react";
import { View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Text } from "../components/sComponent";
import I18n from "../lib/i18n";

export  function CameraApp() {
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
		return <Text>No access to camera</Text>;
	}
	return (
		<View style={styles.container}>
			<Camera style={styles.camera} type={type}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
							setType(
								type === Camera.Constants.Type.back
									? Camera.Constants.Type.front
									: Camera.Constants.Type.back
							);
						}}>
						<Text style={styles.text}> Flip </Text>
					</TouchableOpacity>
				</View>
			</Camera>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {},
	button: {},
	buttonContainer: {},
	text: {},
	camera: {
		color: "white",
		marginBottom: 2,
	},
});
